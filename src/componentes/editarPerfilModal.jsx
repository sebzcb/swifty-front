import axios from "axios";
import { useEffect, useState } from "react";
import { TextField, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Autocomplete, Divider, IconButton, Icon } from "@mui/material";
import { validatePhone } from "../utils/validatePhone";
import { addAsignaturasImpartirService, deleteAsignaturasImpartirService, editAsignaturasImpartirService, getAsignaturasImpartidasPorTutorService } from "../services/asignaturasServices";
import { useSnackContext } from "../context/SnackContext";
import { Delete, Edit } from "@mui/icons-material";

const EditarPerfilModal = ({ open, setOpen, id_usuario, renderFunction }) => {
    const [universidades, setUniversidades] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [isTutor, setIsTutor] = useState(false);
    const [asignaturas, setAsignaturas] = useState([]);
    const [asignaturaAdd, setAsignaturaAdd] = useState(null);
    const [precio, setPrecio] = useState(null);
    const [asignaturasImpartidas, setAsignaturasImpartidas] = useState(null);
    //second modal
    const [openSecondModal, setOpenSecondModal] = useState(false);
    const [asignaturaEdit, setAsignaturaEdit] = useState(null);
    const [asignaturaEditPrecio, setAsignaturaEditPrecio] = useState(null);
    //delete modal 
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [asignaturaDelete, setAsignaturaDelete] = useState(null);
    const { openSnack } = useSnackContext();
    const loadData = async () => {
        try {
            console.log("LOAD DATA de id:", id_usuario)
            const res = await axios.get(`${import.meta.env.VITE_BACK_URL}usuario/${id_usuario}`);
            console.log("RES:", res.data)
            setUsuario(res.data);
        } catch (error) {
            console.error('Error al cargar los datos del usuario:', error);
        }
    }

    const loadUniversidades = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACK_URL}universidades`);
            setUniversidades(res.data);
        } catch (error) {
            console.error('Error al cargar universidades:', error);
        }
    };
    const loadAsignaturas = async () => {
        const id_universidad = usuario.id_universidad;
        const res = await axios.get(`${import.meta.env.VITE_BACK_URL}asignaturas/${id_universidad}`);
        console.log("ASIGNATURAS:", res.data);
        setAsignaturas(res.data);
    }
    useEffect(() => {
        if (!isTutor) return;
        console.log("CARGANDO asignaturas...");
        loadAsignaturas();
        loadAsignaturasImpartidasPorTutor();
    }, [isTutor]);
    useEffect(() => {
        if (!usuario) return;
        const user = JSON.parse(localStorage.getItem('usuario'));
        console.log("USER:", user);
        if (user.rol === 'tutor') {
            setIsTutor(true);
        }
    }, [usuario]);
    useEffect(() => {
        console.log("CARGANDO UNIVERSIDADES...");
        loadUniversidades();
        console.log("ID USUARIO:", id_usuario)
        loadData();
    }, []);

    const handleInputChange = (event) => {
        setUsuario({
            ...usuario,
            [event.target.name]: event.target.value
        });
    }
    const handleSubmit = async () => {
        //check data
        if (!usuario) return;
        const telephone = usuario.telefono;
        const validatePhoneCheck = validatePhone(telephone);
        console.log("TELEFONO:", telephone);
        if (!validatePhoneCheck) {
            alert("El teléfono debe tener el formato +56912345678");
            return;
        }
        try {
            const res = await axios.put(`${import.meta.env.VITE_BACK_URL}usuario/update`, usuario);
            console.log("RES:", res.data);
            setOpen(false);
            renderFunction();
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    }
    const handleAddPrecio = (event) => {
        console.log("PRECIO:", event.target.value);
        setPrecio(event.target.value);
    }
    const loadAsignaturasImpartidasPorTutor = async () => {
        getAsignaturasImpartidasPorTutorService(usuario.id).then((res) => {
            console.log("ASIGNATURAS IMPARTIDAS:", res.data);
            setAsignaturasImpartidas(res.data);
        }).catch((error) => {
            console.error('Error al obtener asignaturas impartidas:', error);
        });
    }
    const handleAddAsignaturaImpartida = async () => {
        console.log("ASIGNATURA:", asignaturaAdd);
        console.log("PRECIO:", precio);
        if (!asignaturaAdd) {
            alert("Debes seleccionar una asignatura");
            return;
        }
        if (!precio) {
            alert("Debes ingresar un precio");
            return;
        }
        const codigo = asignaturaAdd.codigo;
        const id_universidad = asignaturaAdd.id_universidad;
        const id_tutor = usuario.id;
        const nombre = asignaturaAdd.nombreasignatura;
        console.log("CODIGO:", codigo, "ID_UNIVERSIDAD:", id_universidad, "ID_TUTOR:", id_tutor, "PRECIO:", precio, "NOMBRE:", nombre);
        addAsignaturasImpartirService(id_tutor, codigo, id_universidad, precio, nombre).then((res) => {
            console.log("RES:", res.data);
            setPrecio(null);
            setAsignaturaAdd(null);
            openSnack('Asignatura agregada', 'success');
            loadAsignaturasImpartidasPorTutor();
        }).catch((error) => {
            console.error('Error al agregar asignatura:', error);
            openSnack('Error al agregar asignatura', 'error');
        });
    }
    const handleEditAsignaturaImpartida = (asignatura,open) => {
        setAsignaturaEdit(asignatura);
        console.log("precio asig:", asignatura?.precio);
        setAsignaturaEditPrecio(asignatura?.precio);
        setOpenSecondModal(open);
    }
    const handleSaveAsignaturaEdit = async () => {
        console.log("ASIGNATURA EDIT:", asignaturaEdit);
        console.log("PRECIO:", asignaturaEditPrecio);
        if (!asignaturaEdit) {
            alert("No hay asignatura seleccionada");
            return;
        }
        if (!asignaturaEditPrecio) {
            alert("Debes ingresar un precio");
            return;
        }
        const codigo = asignaturaEdit.codigo_asignatura;
        const id_tutor = usuario.id;
        const precioNuevo = asignaturaEditPrecio;
        editAsignaturasImpartirService(codigo, id_tutor, precioNuevo).then((res) => {
            console.log("RES:", res.data);
            openSnack('Asignatura editada', 'success');
            handleEditAsignaturaImpartida(null,false);
            loadAsignaturasImpartidasPorTutor();
        }).catch((error) => {
            console.error('Error al editar asignatura:', error);
            openSnack('Error al editar asignatura', 'error');
        });
       
    }
    const handleDeleteAsignaturaImpartida = async (asignatura,open) => {
        setAsignaturaDelete(asignatura);
        setOpenDeleteModal(open);
    }
    const handleSaveEliminarAsignatura = async () => {
        console.log("ASIGNATURA DELETE:", asignaturaDelete);
        if (!asignaturaDelete) {
            alert("No hay asignatura seleccionada");
            return;
        }
        const codigo = asignaturaDelete.codigo_asignatura;
        const id_tutor = usuario.id;
        deleteAsignaturasImpartirService(codigo, id_tutor).then((res) => {
            console.log("RES:", res.data);
            openSnack('Asignatura eliminada', 'success');
            handleDeleteAsignaturaImpartida(null,false);
            loadAsignaturasImpartidasPorTutor();
        }).catch((error) => {
            console.error('Error al eliminar asignatura:', error);
            openSnack('Error al eliminar asignatura', 'error');
        });
    }
    const RowAsignatura = ({ asignatura }) => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{asignatura.nombre_asignatura} - {asignatura.codigo_asignatura} - ${asignatura.precio}</Typography>
                <IconButton onClick={() => handleEditAsignaturaImpartida(asignatura,true)}>
                    <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteAsignaturaImpartida(asignatura,true)}>
                    <Delete />
                </IconButton>
            </Box>

        )
    }
    if (!usuario) return null;

    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        width: 'auto',
                        height: 'auto',
                        maxHeight: '90vh', // Para evitar que el modal sea demasiado alto
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                    }
                }}
            >
                <DialogTitle>Editar Perfil</DialogTitle>
                <DialogContent>
                    <Box marginBottom={2}>
                        <TextField name="descripcion" label="Descripción" value={usuario.descripcion} onChange={handleInputChange} fullWidth />
                    </Box>
                    <Box marginBottom={2}>
                        <Select name="genero" value={usuario.genero} onChange={handleInputChange} fullWidth>
                            <MenuItem value="Masculino">Masculino</MenuItem>
                            <MenuItem value="Femenino">Femenino</MenuItem>
                        </Select>
                    </Box>
                    <Box marginBottom={2}>
                        <TextField name="telefono" label="Teléfono" value={usuario.telefono} onChange={handleInputChange} fullWidth />
                    </Box>
                    <Box marginBottom={2}>
                        <Select name="id_universidad" value={usuario.id_universidad} onChange={handleInputChange} fullWidth>
                            {universidades.map((universidad) => (
                                <MenuItem key={universidad.id} value={universidad.id}>{universidad.nombre}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                </DialogContent>
                {
                    isTutor && (
                        <>
                            <Divider sx={{ width: '100%', pb: '50px' }} />
                            <Typography gutterBottom variant="h6">
                                Asignaturas impartidas
                            </Typography>
                            <Autocomplete
                                options={asignaturas}
                                getOptionLabel={(option) => option.nombreasignatura}
                                onChange={(event, newValue) => {
                                    setAsignaturaAdd(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Asignaturas"
                                        placeholder="Asignaturas"
                                    />
                                )}
                                sx={{ width: '100%' }}
                            />
                            <TextField name="precio" label="Precio por hora" value={usuario.precio} onChange={
                                handleAddPrecio
                            } fullWidth
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}>
                            </TextField>
                            <Button onClick={handleAddAsignaturaImpartida}>Agregar asignatura</Button>
                            <Typography> Asignaturas impartidas </Typography>
                            {
                                asignaturasImpartidas &&
                                asignaturasImpartidas.map((asignatura) => (
                                    <Box key={asignatura.codigo}>
                                        <RowAsignatura asignatura={asignatura} />
                                    </Box>
                                ))
                            }
                        </>
                    )
                }
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar cambios</Button>
                </DialogActions>
            </Dialog>
            {/* Modal secundario  */}
            <Dialog
                open={openSecondModal}
                onClose={() => handleEditAsignaturaImpartida(null,false)}
                PaperProps={{
                    sx: {
                        width: 'auto',
                        height: 'auto',
                        maxHeight: '90vh', // Para evitar que el modal sea demasiado alto
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                    }
                }}
            >
                <DialogTitle>Editar Asignatura: {asignaturaEdit?.nombre_asignatura} - {asignaturaEdit?.codigo_asignatura}</DialogTitle>
                <DialogContent>
                    <TextField name="precio" label="Precio por hora" 
                    value={asignaturaEditPrecio} onChange={
                        (event) => setAsignaturaEditPrecio(event.target.value)
                    } fullWidth
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleEditAsignaturaImpartida(null,false)}>Cancelar</Button>
                    <Button onClick={handleSaveAsignaturaEdit}>Guardar cambios</Button>
                </DialogActions>
            </Dialog>
            {/* MOdal eliminar */}
            <Dialog
                open={openDeleteModal}
                onClose={() => handleDeleteAsignaturaImpartida(null,false)}
                PaperProps={{
                    sx: {
                        width: 'auto',
                        height: 'auto',
                        maxHeight: '90vh', // Para evitar que el modal sea demasiado alto
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                    }
                }}
            >
                <DialogTitle>Eliminar Asignatura: {asignaturaDelete?.nombre_asignatura} - {asignaturaDelete?.codigo_asignatura}</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro que deseas eliminar esta asignatura?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDeleteAsignaturaImpartida(null,false)}>Cancelar</Button>
                    <Button onClick={handleSaveEliminarAsignatura}>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default EditarPerfilModal;