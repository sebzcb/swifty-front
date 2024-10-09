import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Autocomplete, CircularProgress } from '@mui/material';
import axios from 'axios';
import { getEstudiantesSolicitudesDeTutor } from '../services/tutoresServices';
import { getAsignaturasImpartidasPorTutorService } from '../services/asignaturasServices';
import { CLAVES } from '../constants/claves';
import { useSnackContext } from '../context/SnackContext';

const ModalTutoria = ({ setOpenModal,loadTutorias }) => {
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
    const {openSnack} = useSnackContext();
    const handleChangeIdEstudiante = (e,value) => {
        console.log("value:",value);
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
        const id_tutor = JSON.parse(localStorage.getItem('usuario')).id;
        getAsignaturasImpartidasPorTutorService(id_tutor).then((res) => {
            console.log(res.data);
            setAsignaturas(res.data);
        }).catch((error) => {
            console.error('Hubo un problema al realizar la solicitud:', error);
        });/*
        const res = await axios.get(`${import.meta.env.VITE_BACK_URL}asignaturas`);
        console.log(res.data);
        setAsignaturas(res.data);*/
    };
    useEffect(() => {
        getAsignaturas();
    }, []);
    const handleSubmit = async () => {
        /*if(formData.clave === ''){
            alert('Debes seleccionar una clave');
            return;
        }*/
        // Verifica que la hora final sea mayor que la hora de inicio
        if(formData.fecha === ''){
            alert('Debes seleccionar una fecha');
            return;
        }
        if (formData.horaInicio >= formData.horaFin) {
            alert('La hora final debe ser mayor que la hora de inicio');
            return;
        }

        // Verifica que la fecha sea igual o posterior a la fecha actual
        const currentDate = new Date();
        const selectedDate = new Date(formData.fecha);
        /*if (selectedDate < currentDate) {
            alert('La fecha seleccionada debe ser igual o posterior a la fecha actual');
            return;
        }*/
        console.log(formData);
        const id_tutor = JSON.parse(localStorage.getItem('usuario')).id;
        console.log("id_tutor", id_tutor);
        if(!idEstudiante ){
            alert('Debes seleccionar un estudiante');
            return;
        }
        const id_estudiante = idEstudiante.id;
        const dataToSend = {
            ...formData,
            id_tutor,
            id_estudiante
        };
        try{
            const res = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/tutorias/subir`, dataToSend);
            console.log(res.data);
            setOpenModal(false);
            openSnack('Tutoría creada exitosamente', 'success');
            await loadTutorias();
        }catch (e) {
            console.log("status:",e.response.status)
            if (e.response && e.response.status == 409) {
                openSnack('Ya existe una tutoría en las horas seleccionadas', 'error');
            } else {
                openSnack('Hubo un error al crear la tutoría', 'error');
            }
            console.log("error:", e);
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
        const id_tutor = JSON.parse(localStorage.getItem('usuario')).id;
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
                    {/* Mapea las opciones de modalidad aquí */}
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
                    InputProps={{ inputProps: { min: 0 } }}
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
                />
                {/*array: clavesArray */}
               {/* <Autocomplete
                    id="combo-box-demo"
                    onChange={handleClaveChange}
                    value={formData.clave}
                    options={clavesArray}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Clave" />}
                />*/}
                    
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
