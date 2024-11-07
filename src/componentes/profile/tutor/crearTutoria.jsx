import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Autocomplete, CircularProgress } from '@mui/material';
import axios from 'axios';
import { getEstudiantesSolicitudesDeTutor } from '../../../services/tutoresServices';
import { getAsignaturasImpartidasPorTutorService } from '../../../services/asignaturasServices';
import { CLAVES } from '../../../constants/claves';
import { useSnackContext } from '../../../context/SnackContext';
import { sendEmail } from '../../../utils/sendEmail';
import { getUserService } from '../../../services/usersServices';
import { TUTORIA_INFO } from './tutoriainfo';
import { useUserContext } from '../../../context/UserContext';

const ModalTutoria = ({ setOpenModal, loadTutorias }) => {
    const [formData, setFormData] = useState({
        codigo_asignatura: '',
        modalidad: '',
        descripcion: '',
        maxEstudiantes: 2,
        precioHora: '',
        fecha: '',
        horaInicio: '',
        horaFin: ''
    });
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [idEstudiante, setIdEstudiante] = useState(null); // Añade un nuevo estado para almacenar el id del estudiante seleccionado
    const loading = open && options.length === 0;
    const [asignaturas, setAsignaturas] = useState([]); // Añade un nuevo estado para almacenar las asignaturas 
    const clavesArray = Object.keys(CLAVES);
    const { openSnack } = useSnackContext();
    const { userInfo } = useUserContext();
    const handleChangeIdEstudiante = (e, value) => {
        console.log("value:", value);
        setIdEstudiante(value); // Almacena el id del estudiante seleccionado
    };

    const handleChange = (event) => {
        console.log(event.target);
        const { name, value } = event.target;
        console.log(name, value);
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const getAsignaturas = async () => {
        const id_tutor = userInfo.id;
        getAsignaturasImpartidasPorTutorService(id_tutor).then((res) => {
            console.log(res.data);
            setAsignaturas(res.data);
        }).catch((error) => {
            console.error('Hubo un problema al realizar la solicitud:', error);
        });
    };

    useEffect(() => {
        getAsignaturas();
    }, []);

    const subirTutoria = async (dataToSend) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/tutorias/subir`, dataToSend);
            console.log(res.data);
            return res.data;
        } catch (e) {
            console.log("status:", e.response.status);
            if (e.response && e.response.status === 409) {
                openSnack('Ya existe una tutoría en las horas seleccionadas', 'error');
            } else {
                openSnack('Hubo un error al crear la tutoría', 'error');
            }
            console.log("error:", e);
            throw e;
        }
    };

    const enviarCorreoNotificacion = async (id_estudiante, formData) => {
        try {
            const res = await getUserService(id_estudiante);
            console.log("res:", res);
            const { correo, nombre } = res.data;
            console.log("correo:", correo);
            // estudiantes datos
            const correoEstudianteAyudado = correo;
            const nombreEstudiante = nombre;
            // tutorias datos
            const fechaTutorial = formData.fecha;
            const horaInicioTutorial = formData.horaInicio;
            const horaFinTutorial = formData.horaFin;
            const precioPorHora = formData.precioHora;
            const descripcion = formData.descripcion;
            const modalidad = formData.modalidad;
            const codigo_asignatura = formData.codigo_asignatura;
            const nombreTutor = userInfo.nombre;
            const msj = `Hola ${nombreEstudiante},\n\nSe ha creado una tutoría contigo para la asignatura ${codigo_asignatura}.\n\nFecha: ${fechaTutorial}\nHora de inicio: ${horaInicioTutorial}\nHora de fin: ${horaFinTutorial}\nModalidad: ${modalidad}\nPrecio por hora: $${precioPorHora}\nDescripción: ${descripcion}\n\nTutor: ${nombreTutor}\n\nSaludos,\nSwifty.`;
            await sendEmail(correoEstudianteAyudado, 'Tutoría programada', msj);
            openSnack('Correo de notificación enviado exitosamente', 'success');
        } catch (error) {
            console.error('Hubo un problema al enviar el correo de notificación:', error);
            openSnack('Hubo un problema al enviar el correo de notificación', 'error');
        }
    };

    const handleSubmit = async () => {
        // Verifica que la hora final sea mayor que la hora de inicio
        if (formData.fecha === '') {
            alert('Debes seleccionar una fecha');
            return;
        }
        if (formData.horaInicio >= formData.horaFin) {
            alert('La hora final debe ser mayor que la hora de inicio');
            return;
        }
        if (formData.precioHora === '') {
            alert('Debes ingresar un precio por hora');
            return;
        }
        if (formData.precioHora < TUTORIA_INFO.MIN_PRICE || formData.precioHora > TUTORIA_INFO.MAX_PRICE) {
            alert(`El precio por hora debe estar entre $${TUTORIA_INFO.MIN_PRICE} y $${TUTORIA_INFO.MAX_PRICE}`);
            return;
        }

        // Verifica que la fecha sea igual o posterior a la fecha actual
        const currentDate = new Date();
        const selectedDate = new Date(formData.fecha);
        console.log(formData);
        const id_tutor = userInfo.id;
        console.log("id_tutor", id_tutor);
        if (!idEstudiante) {
            alert('Debes seleccionar un estudiante');
            return;
        }
        const id_estudiante = idEstudiante.id;
        const dataToSend = {
            ...formData,
            id_tutor,
            id_estudiante
        };
        console.log("data send:", JSON.stringify(dataToSend));

        try {
            await subirTutoria(dataToSend);
            setOpenModal(false);
            openSnack('Tutoría creada exitosamente', 'success');
            await loadTutorias();
            await enviarCorreoNotificacion(id_estudiante, formData);
        } catch (e) {
            console.log("Error en el proceso:", e);
        }
    };

    function sleep(duration) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, duration);
        });
    }

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if (active) {
                setOptions([...estudiantes]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const loadUsuarios = async () => {
        const id_tutor = userInfo.id;
        getEstudiantesSolicitudesDeTutor(id_tutor).then((res) => {
            setEstudiantes([...res]);
        }).catch((error) => {
            console.error('Hubo un problema al realizar la solicitud:', error);
        });
    }

    const handleClaveChange = (event, value) => {
        setFormData(prevState => ({
            ...prevState,
            clave: value,
        }));
    };

    useEffect(() => {
        loadUsuarios();
    }, []);

    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    return (
        <Dialog open={true} onClose={() => setOpenModal(false)}>
            <DialogTitle>Crear Tutoría</DialogTitle>
            <DialogContent>
                <TextField
                    label="Descripción"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <TextField
                    select
                    label="Asignatura"
                    name="codigo_asignatura"
                    value={formData.codigo_asignatura}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                >
                    {asignaturas.map((asignatura) => (
                        <MenuItem key={asignatura.codigo_asignatura} value={asignatura.codigo_asignatura}>{asignatura.nombre_asignatura}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Modalidad"
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                >
                    <MenuItem value="presencial">Presencial</MenuItem>
                    <MenuItem value="virtual">Virtual</MenuItem>
                    <MenuItem value="hibrida">Híbrida</MenuItem>
                </TextField>
                <TextField
                    label="Cantidad máxima de estudiantes"
                    name="maxEstudiantes"
                    value={formData.maxEstudiantes}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
                <TextField
                    label="Precio por hora"
                    name="precioHora"
                    value={formData.precioHora}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    type="number"
                    InputProps={{ inputProps: { min: TUTORIA_INFO.MIN_PRICE, max: TUTORIA_INFO.MAX_PRICE } }}
                />
                <TextField
                    label="Fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: today }} // Establecer la fecha mínima como hoy
                />
                <TextField
                    label="Hora inicial"
                    name="horaInicio"
                    value={formData.horaInicio}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Hora final"
                    name="horaFin"
                    value={formData.horaFin}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                    type="time"
                    InputLabelProps={{ shrink: true }}
                />
                <Autocomplete
                    id="asynchronous-demo"
                    sx={{ width: 300 }}
                    open={open}
                    onOpen={() => {
                        setOpen(true);
                    }}
                    onClose={() => {
                        setOpen(false);
                    }}
                    value={idEstudiante} // Asigna el valor del id del estudiante seleccionado
                    onChange={handleChangeIdEstudiante}
                    isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
                    getOptionLabel={(option) => option.nombre}
                    options={options}
                    loading={loading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tus estudiantes"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setOpenModal(false) }}>Cancelar</Button>
                <Button onClick={handleSubmit} color="primary">
                    Crear Tutoría
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalTutoria;