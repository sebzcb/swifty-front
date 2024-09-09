import  { useState, useEffect } from 'react';
import {  Typography, Button, Stack, Card, CardContent, Avatar, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
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

const Perfil = () => {
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [usuario, setUsuario] = useState(null);
    const [usuarioExterno, setUsuarioExterno] = useState(false);
    const { idUsuario } = useParams();
    const [openModalTutor, setOpenModalTutor] = useState(false);
    const [openModalReport, setOpenModalReport] = useState(false);
    const [openModalCalificar, setOpenModalCalificar] = useState(false);
    const [promedioCalificaciones, setPromedioCalificaciones] = useState(null); // Estado para almacenar el promedio

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
    useEffect(() => {
        const obtenerUsuario = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACK_URL}usuario/${idUsuario}`);
                if (response.status !== 200) {
                    throw new Error('Hubo un problema al realizar la solicitud.');
                }
                const data = response.data;
                console.log(data);
                setUsuario(data);
                const user = JSON.parse(localStorage.getItem('usuario'));
                const idUserStorage = user.id;
                console.log("USER:", idUserStorage);
                console.log("params user:",idUsuario);
                const isMismoUsuario =idUserStorage === idUsuario;
                if(isMismoUsuario){
                    console.log("es el mismo usuario");
                    setUsuarioExterno(false);
                }
                else{
                    console.log("es un usuario externo");
                    setUsuarioExterno(true);
                }
                // Llamar a la función para calcular el promedio de calificaciones
                calcularPromedioCalificaciones(data.id_tutor);

            } catch (error) {
                console.error('Hubo un problema al realizar la solicitud:', error);
            }
        };

        obtenerUsuario();
    }, [idUsuario]);

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
            return 'EL TUTOR NO HA SIDO CALIFICADO';
        } else if (promedio > 0 && promedio < 3) {
            return 'EL TUTOR NO ESTÁ BIEN CALIFICADO';
        } else if (promedio >= 3 && promedio < 4) {
            return 'EL TUTOR SE ENCUENTRA CALIFICADO';
        } else if (promedio >= 4 && promedio <= 5) {
            return 'EL TUTOR SE ENCUENTRA ALTAMENTE CLASIFICADO';
        }
        return ''; // En caso de promedios fuera de rango por seguridad
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Avatar sx={{ bgcolor: deepOrange[500], width: '60px', height: '60px' }}>
                        {usuario?.nombre && usuario?.nombre[0]}
                    </Avatar>
                    <Typography variant="h6">{usuario?.nombre}</Typography>
                    {usuario?.rol === 'tutor' || usuario?.id_tutor != null ? (
                        <Stack direction="row" spacing={1}>
                            <Paper sx={{ backgroundColor: 'black', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
                                <Typography variant="h6">{promedioCalificaciones || '-'}</Typography>
                            </Paper>
                            <Stack direction="column" spacing={0}>
                                <Typography variant="body2">{obtenerMensajeCalificacion(parseFloat(promedioCalificaciones))}</Typography>
                                <Typography variant="body2" color="textSecondary">+2 reviews</Typography>
                            </Stack>
                        </Stack>
                    ) : null}
                    <Typography variant="body2">{usuario?.descripcion}</Typography>
                    <Typography variant="body2" color="textSecondary">leer más</Typography>
                    {usuarioExterno === false ? (
                        <Button color="primary" onClick={() => handleEditarPerfil()}>
                            <EditIcon sx={{ marginRight: '10px' }} /> Editar perfil
                        </Button>
                    ) : usuario?.id_tutor != null ? (
                        <Stack direction="column" spacing={1}>
                            <Button color="primary" onClick={handleOpenTutor}>
                                <FlashOnIcon sx={{ marginRight: '10px' }} />Solicitar Tutoría
                            </Button>
                            <Button color="primary" onClick={handleOpenCalificar}>
                                <ThumbsUpDownIcon sx={{ marginRight: '10px' }} />Calificar
                            </Button>
                            <Button color="primary" onClick={handleOpenReport}>
                                <ReportIcon sx={{ marginRight: '10px' }} />Reportar
                            </Button>
                            <Button color="primary" onClick={() => alert('no implementado')}>
                                <EmailIcon sx={{ marginRight: '10px' }} />Enviar Mensaje
                            </Button>
                        </Stack>
                    ) : null}
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <SchoolIcon />
                            </ListItemIcon>
                            <ListItemText primary="PUCV" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <EmailIcon />
                            </ListItemIcon>
                            <ListItemText primary={usuario?.correo} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PhoneIcon />
                            </ListItemIcon>
                            <ListItemText primary={usuario?.telefono} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <GenderIcon />
                            </ListItemIcon>
                            <ListItemText primary={usuario?.genero} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <EventIcon />
                            </ListItemIcon>
                            <ListItemText primary={usuario?.fechaNacimiento} />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
            <NuevaTutoria open={openModalTutor} handleClose={handleCloseTutor} id_tutor={usuario?.id_tutor} />
            <Report open={openModalReport} handleClose={handleCloseReport} idUsuario={usuario?.id} />
            {usuarioExterno && <Calificar open={openModalCalificar} handleClose={handleCloseCalificar} idUsuario={usuario?.id} />}
            {usuario && <EditarPerfilModal open={openModalEditar} setOpen={setOpenModalEditar} id_usuario={usuario?.id} />}
        </>
    );
};

export default Perfil;
