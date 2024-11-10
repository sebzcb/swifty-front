import { Modal, Box, Typography, Button } from "@mui/material";
import axios from "axios";
import { useSnackContext } from "../context/SnackContext";

const SolicitudTutoriaModal = ({
    setOpenModal,
    id,
    nombre,
    asignaturaElegida,
    modalidad,
    fecha,
    hora,
    correo,
    descripcion,
    renderSolicitudes
}) => {
    const { openSnack } = useSnackContext();
    const rechazo = 'Rechazado';
    const aceptado = 'Aceptado';
    // En SolicitudTutoriaModal.js
    const handleRechazo = async () => {
        console.log('Rechazar solicitud');
        try {
            await axios.put(`${import.meta.env.VITE_BACK_URL}usuario/solicitudes/solicitud/estado/actualizar`, { id_solicitud: id, estado: rechazo });
            setOpenModal(false);
            openSnack('Solicitud rechazada', 'error');
            await renderSolicitudes();
        } catch (error) {
            console.error('There was an error!', error);
        }
    }

    const handleAceptar = async () => {
        console.log('Aceptar solicitud');
        try {
            await axios.put(`${import.meta.env.VITE_BACK_URL}usuario/solicitudes/solicitud/estado/actualizar`, { id_solicitud: id, estado: aceptado });
            setOpenModal(false);
            openSnack('Solicitud aceptada', 'success');
            await renderSolicitudes();
        } catch (error) {
            console.error('There was an error!', error);
        }
    }
    return (
        <Modal
            open={true}
            onClose={() => setOpenModal(false)}
            aria-labelledby="modal-titulo"
            aria-describedby="modal-descripcion"
        >
            <Box sx={{ borderRadius: 5, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography id="modal-titulo" variant="h6" component="h2">
                    Solicitud de Tutoría
                </Typography>
                <Typography id="modal-descripcion" sx={{ mt: 2 }}>
                    Nombre: {nombre}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Correo: {correo}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Asignatura Elegida: {asignaturaElegida}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Modalidad: {modalidad}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Fecha: {fecha}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Hora: {hora}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    Descripción: {descripcion}
                </Typography>
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" sx={{ borderRadius: 20, color: 'red', borderColor: 'red', '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' } }}
                        onClick={() => handleRechazo()}>
                        Rechazar
                    </Button>
                    <Button variant="contained" sx={{ borderRadius: 20, color: 'white', backgroundColor: 'green', '&:hover': { backgroundColor: 'rgba(0, 128, 0, 0.8)' } }} onClick={() => handleAceptar()} >
                        Aceptar
                    </Button>
                </Box>
            </Box>
        </Modal >
    );
}

export default SolicitudTutoriaModal;
