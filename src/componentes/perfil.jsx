import { useState, useEffect } from 'react';
import { Typography, Button, Stack, Card, CardContent, Avatar, List, ListItem, ListItemIcon, ListItemText, Paper, IconButton, Box, Chip } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import GenderIcon from '@mui/icons-material/Wc';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ReportIcon from '@mui/icons-material/Report';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NuevaTutoria from './nuevaTutoria';
import Report from './reporte';
import Calificar from './calificar';
import EditarPerfilModal from './editarPerfilModal';
import { getEstudiantesSolicitudesDeTutor } from '../services/tutoresServices';
import { getAsignaturasImpartidasPorTutorService } from '../services/asignaturasServices';

const Perfil = () => {
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [usuarioExterno, setUsuarioExterno] = useState(false);
    const [tuvoClaseConTutor, setTuvoClaseConTutor] = useState(false);
    const { idUsuario } = useParams();
    const [openModalTutor, setOpenModalTutor] = useState(false);
    const [openModalReport, setOpenModalReport] = useState(false);
    const [openModalCalificar, setOpenModalCalificar] = useState(false);
    const [promedioCalificaciones, setPromedioCalificaciones] = useState(null); // Estado para almacenar el promedio
    const [estudiantes, setEstudiantes] = useState([]);
    const [asignaturasImpartidas, setAsignaturasImpartidas] = useState(null);
    const handleOpenTutor = () => setOpenModalTutor(true);
    const handleOpenReport = () => setOpenModalReport(true);
    const handleOpenCalificar = () => setOpenModalCalificar(true);

    const handleCloseTutor = () => setOpenModalTutor(false);
    const handleCloseReport = () => setOpenModalReport(false);
    const handleCloseCalificar = () => setOpenModalCalificar(false);
    const handleEditarPerfil = () => {
        setOpenModalEditar(true);
        console.log("editar : true")
    }
    const obtenerUsuario = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACK_URL}usuario/${idUsuario}`);
            if (response.status !== 200) {
                throw new Error('Hubo un problema al realizar la solicitud.');
            }
            const data = response.data;
            console.log("usauario id",data);
            setUsuario(data);
            const user = JSON.parse(localStorage.getItem('usuario'));
            const idUserStorage = user.id;
            console.log("USER:", idUserStorage);
            console.log("params user:", idUsuario);
            const isMismoUsuario = idUserStorage === idUsuario;
            if (isMismoUsuario) {
                console.log("es el mismo usuario");
                setUsuarioExterno(false);
            }
            else {
                console.log("es un usuario externo");
                setUsuarioExterno(true);
            }
            // Llamar a la función para calcular el promedio de calificaciones
            calcularPromedioCalificaciones(data.id_tutor);

        } catch (error) {
            console.error('Hubo un problema al realizar la solicitud:', error);
        }
    };
    const loadUsuarios = async () => {
        getEstudiantesSolicitudesDeTutor(idUsuario).then((res) => {
            console.log("res:", res);
            setEstudiantes([...res]);
        }).catch((error) => {
            console.error('Hubo un problema al realizar la solicitud:', error);
        });/*
        const id_tutor = idUsuario;
        const res = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/tutorias/solicitudes/estudiantes`,{id_tutor});
        console.log("res:",res.data);
        setEstudiantes([...res.data]);*/
    }
    useEffect(() => {
        if(!usuario) return;
        const id_tutor = usuario.id_tutor;
        if(!id_tutor) return;
        getAsignaturasImpartidasPorTutorService(id_tutor).then((res) => {
            setAsignaturasImpartidas(res.data);
        }).catch((error) => {
            console.error('Hubo un problema al realizar la solicitud:', error);
        });

    }, [usuario]);
    useEffect(() => {
        obtenerUsuario();
    }, [idUsuario]);
    useEffect(() => {
        if (!usuarioExterno) return;
        console.log("===== load usuarios =====");
        loadUsuarios();
    }, [usuarioExterno]);
    useEffect(() => {
        if (!usuario) return;
        const id_user_actual = JSON.parse(localStorage.getItem('usuario')).id;
        console.log("estudiantes:", estudiantes)
        const id_estudiante = estudiantes.find(estudiante => estudiante.id === id_user_actual);
        if (id_estudiante) setTuvoClaseConTutor(true);
    }, [usuario, estudiantes]);

    const calcularPromedioCalificaciones = async (idTutor) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/comentarios`, {
                id_tutor: idTutor,
            });
            if (response.status === 200 && response.data.length > 0) {
                const calificaciones = response.data;
                const totalCalificaciones = calificaciones.length;
                const sumatoriaCalificaciones = calificaciones.reduce((acc, curr) => acc + curr.calificacion, 0);
                const promedio = sumatoriaCalificaciones / totalCalificaciones;
                setPromedioCalificaciones(promedio.toFixed(1)); // Redondear el promedio a 1 decimal
            } else {
                setPromedioCalificaciones(null); // No hay calificaciones disponibles
            }
        } catch (error) {
            console.error('Error al obtener las calificaciones del tutor:', error);
        }
    };

    const obtenerMensajeCalificacion = (promedio) => {
        if (promedio === null) {
            return ''; // En caso de que no haya promedio definido aún
        } else if (promedio === 0) {
            return 'NO CALIFICADO';
        } else if (promedio > 0 && promedio < 3) {
            return 'BAJA CALIFICACIÓN';
        } else if (promedio >= 3 && promedio < 4) {
            return 'BIEN CALIFICADO';
        } else if (promedio >= 4 && promedio <= 5) {
            return 'ALTAMENTE CALIFICADO';
        }
        return ''; // En caso de promedios fuera de rango por seguridad
    };

    return (
        <>
            <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', justifyContent: 'space-between' }}>
                        <Avatar sx={{ bgcolor: deepOrange[500], width: '60px', height: '60px' }}>
                            {usuario?.nombre && usuario?.nombre[0]}
                        </Avatar>
                        {usuarioExterno === true &&
                            <IconButton onClick={handleOpenReport} sx={{ alignSelf: 'flex-start' }}>
                                <ReportIcon sx={{ marginRight: '10px', color: 'red' }} />
                            </IconButton>
                        }
                    </Box>
                    <Typography variant="h6" sx={{ marginTop: 2 }}>{usuario?.nombre}</Typography>
                    {usuario?.rol === 'tutor' || usuario?.id_tutor != null ? (
                        <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
                            <Paper sx={{ backgroundColor: 'black', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
                                <Typography variant="h6">{promedioCalificaciones || '-'}</Typography>
                            </Paper>
                            <Stack direction="column" spacing={0}>
                                <Typography variant="body2">{obtenerMensajeCalificacion(parseFloat(promedioCalificaciones))}</Typography>
                                <Typography variant="body2" color="textSecondary">+2 reviews</Typography>
                            </Stack>
                        </Stack>
                    ) : null}
                    <Typography variant="body2" sx={{ wordBreak: 'break-word', marginTop: 2 }}>
                        {usuario?.descripcion}
                    </Typography>
                    {usuarioExterno === false ? (
                        <Button color="primary" onClick={() => handleEditarPerfil()} sx={{ marginTop: 2 }}>
                            <EditIcon sx={{ marginRight: '10px' }} /> Editar perfil
                        </Button>
                    ) : usuario?.id_tutor != null ? (
                        <Stack direction="column" spacing={1} sx={{ marginTop: 2 }}>
                            <Button
                                color="primary"
                                onClick={handleOpenTutor}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark'
                                    },
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    textTransform: 'none'
                                }}
                            >
                                <FlashOnIcon sx={{ marginRight: '10px' }} />Solicitar Tutoría
                            </Button>
                            {
                                tuvoClaseConTutor &&
                                <Button
                                    color="primary"
                                    onClick={handleOpenCalificar}
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark'
                                        },
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        textTransform: 'none'
                                    }}
                                >
                                    <ThumbsUpDownIcon sx={{ marginRight: '10px' }} />Calificar
                                </Button>
                            }
                        </Stack>
                    ) : null}
                    <List sx={{ marginTop: 2 }}>
                        {
                            asignaturasImpartidas &&
                            <>
                                {asignaturasImpartidas.map((asignatura) => (
                                    <Chip key={asignatura.codigo_asignatura} label={asignatura.nombre_asignatura + " - $" +
                                        asignatura.precio + " CLP/hora"
                                    } sx={{ margin: '5px' }} />
                                ))}
                            </>

                        }
                        <ListItem>
                            <ListItemIcon sx={{ color: 'primary.main' }}>
                                <SchoolIcon />
                            </ListItemIcon>
                            <ListItemText primary="PUCV" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{ color: 'primary.main' }}>
                                <EmailIcon />
                            </ListItemIcon>
                            <ListItemText primary={usuario?.correo} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{ color: 'primary.main' }}>
                                <PhoneIcon />
                            </ListItemIcon>
                            <ListItemText primary={usuario?.telefono} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{ color: 'primary.main' }}>
                                <GenderIcon />
                            </ListItemIcon>
                            <ListItemText primary={usuario?.genero} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon sx={{ color: 'primary.main' }}>
                                <EventIcon />
                            </ListItemIcon>
                            <ListItemText primary={usuario?.fechanacimiento} />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
            <NuevaTutoria open={openModalTutor} handleClose={handleCloseTutor} id_tutor={usuario?.id_tutor} />
            <Report open={openModalReport} handleClose={handleCloseReport} idUsuario={usuario?.id} />
            {usuarioExterno && <Calificar open={openModalCalificar} handleClose={handleCloseCalificar} idUsuario={usuario?.id} />}
            {usuario && openModalEditar && <EditarPerfilModal open={openModalEditar} setOpen={setOpenModalEditar} id_usuario={usuario?.id} renderFunction={obtenerUsuario} />}
        </>
    );
};

export default Perfil;
