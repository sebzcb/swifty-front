import { Box, Button, Typography, Divider, TextField } from "@mui/material";
import CustomModal from "../../utils/Modal";
import { useSnackContext } from "../../context/SnackContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserService } from "../../services/usersServices";

const ModalReport = ({ open, setOpen, report, renderFunction }) => {
    const { openSnack } = useSnackContext();
    const navigate = useNavigate();
    const [usuarioReporto, setUsuarioReporto] = useState(null); // Quien hizo el reporte
    const [usuarioReportado, setUsuarioReportado] = useState(null); // Quien fue reportado
    const { motivo, detalles, fecha_reporte, id_reportado, id_usuario_reporto } = report;
    const loadUserReportAutor = async () => {
        // Lógica para obtener el usuario que reportó
        getUserService(id_usuario_reporto).then((response) => {
            if (response && response.data) {
                setUsuarioReporto(response.data);
            }
        }).catch((error) => {
            openSnack('Error al obtener el usuario que reporto', 'error');
        });
    }
    const loadUserReportado = async () => {
        // Lógica para obtener el usuario reportado
        getUserService(id_reportado).then((response) => {
            if (response && response.data) {
                setUsuarioReportado(response.data);
            }
        }).catch((error) => {
            openSnack('Error al obtener el usuario reportado', 'error');
        });
    }
    useEffect(() => {
        loadUserReportAutor();
        loadUserReportado();
    }, [report]);

    const handleEdit = () => {
        // Implementar la lógica de edición aquí
    }

    if (!usuarioReporto) { return null; }

    const verPerfil = (e) => {
        e.preventDefault();
        console.log('Ver perfil');
        console.log('id_reportado', id_reportado);
        navigate('/' + id_reportado);
    }

    return (
        <>
            <CustomModal
                open={open}
                title="Información del reporte"
                actions={{
                    onCancel: () => setOpen(false),
                    onSave: () => {
                        console.log('Guardar');
                        handleEdit();
                        setOpen(false);
                    },
                }}
            >
                <Box>
                    <Divider />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        {/* Información del usuario que reportó */}
                        <Box width="48%">
                            <Typography variant="subtitle1" gutterBottom><strong>Usuario que reportó:</strong></Typography>
                            <Typography variant="body1"><strong>Nombre:</strong> {usuarioReporto.nombre}</Typography>
                            <Typography variant="body1"><strong>Correo:</strong> {usuarioReporto.correo}</Typography>
                            <Typography variant="body1"><strong>Teléfono:</strong> {usuarioReporto.telefono}</Typography>
                            <Typography variant="body1"><strong>Género:</strong> {usuarioReporto.genero}</Typography>
                        </Box>

                        {/* Información del usuario reportado */}
                        <Box width="48%">
                            <Typography variant="subtitle1" gutterBottom><strong>Usuario reportado:</strong></Typography>
                            {
                                usuarioReportado ? (
                                    <>
                                        <Typography variant="body1"><strong>Nombre:</strong> {usuarioReportado.nombre}</Typography>
                                        <Typography variant="body1"><strong>Correo:</strong> {usuarioReportado.correo}</Typography>
                                        <Typography variant="body1"><strong>Teléfono:</strong> {usuarioReportado.telefono}</Typography>
                                        <Typography variant="body1"><strong>Género:</strong> {usuarioReportado.genero}</Typography>
                                    </>
                                ) : (
                                    <Typography variant="body1">Usuario ya no existe</Typography>
                                )
                            }
                        </Box>
                    </Box>
                    <Divider style={{ margin: '20px 0' }} />
                    <Box>
                        <Typography variant="h6" gutterBottom> Detalles reporte </Typography>
                        <Typography variant="body1"><strong>Motivo:</strong> {motivo}</Typography>
                        <Typography variant="body1"><strong>Detalles:</strong> {detalles}</Typography>
                        <Typography variant="body1"><strong>Fecha de reporte:</strong> {new Date(fecha_reporte).toLocaleDateString()}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Acciones
                        </Typography>
                        {
                            usuarioReportado ? (
                                <Button variant="contained" color="primary" onClick={verPerfil} style={{ marginRight: '10px' }}>
                                Ver perfil del usuario reportado
                            </Button>
                            ) : <Typography variant="body1">No existe perfil del usuario reportado</Typography>
                        }
                    </Box>
                    <Divider style={{ margin: '20px 0' }} />
                    <Typography variant="body1" gutterBottom> Enviar respuesta al usuario que reportó </Typography>
                    <TextField
                        label="Mensaje"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        style={{ marginBottom: '20px' }}
                    />
                    <Button variant="contained" color="primary">
                        Enviar correo
                    </Button>
                </Box>
            </CustomModal>
        </>
    )
};

export default ModalReport;