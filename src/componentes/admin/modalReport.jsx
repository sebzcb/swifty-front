import { Box, Button, Typography, Divider, TextField, Select } from "@mui/material";
import CustomModal from "../../utils/Modal";
import { useSnackContext } from "../../context/SnackContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserService } from "../../services/usersServices";
import { REPORT_STATE } from "../../constants/reportState";
import { editReporteService } from "../../services/reportsService";

const ModalReport = ({ open, setOpen, report, renderFunction }) => {
    console.log("entro modal report")
    const { openSnack } = useSnackContext();
    const navigate = useNavigate();
    const [usuarioReporto, setUsuarioReporto] = useState(null); // Quien hizo el reporte
    const [usuarioReportado, setUsuarioReportado] = useState(null); // Quien fue reportado
    const { id, motivo, detalles, fecha_reporte, id_reportado, id_usuario_reporto, estado } = report;
    const [estadoReporte, setEstadoReporte] = useState(estado);
    const reportsState = Object.values(REPORT_STATE);
    const loadUserReportAutor = async () => {
        // Lógica para obtener el usuario que reportó
        console.log("==================================")
        console.log("id_usuario_reporto:", id_usuario_reporto);
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
        const estadoEdit = estadoReporte;
        const idReport = id;
        editReporteService(idReport, estadoEdit).then((response) => {
            openSnack('Reporte editado correctamente', 'success');
            renderFunction();
        }).catch((error) => {
            openSnack('Error al editar el reporte', 'error');
            console.log(error);
        });
    }
    console.log("usuario reoprt...", usuarioReporto);
    // if (!usuarioReporto) { return null; }

    const verPerfil = (e) => {
        e.preventDefault();
        console.log('Ver perfil');
        console.log('id_reportado', id_reportado);
        navigate('/' + id_reportado);
    }
    const verPerfilUsuarioReporto = (e) => {
        e.preventDefault();
        console.log('Ver perfil');
        console.log('id_usuario_reporto', id_usuario_reporto);
        navigate('/' + id_usuario_reporto);
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
                    <Divider style={{ margin: '20px 0' }} />
                    <Box>
                        <Typography variant="body1"><strong>Motivo:</strong> {motivo}</Typography>
                        <Typography variant="body1"><strong>Detalles:</strong> {detalles}</Typography>
                        <Typography variant="body1"><strong>Fecha de reporte:</strong> {new Date(fecha_reporte).toLocaleDateString()}</Typography>
                    </Box>
                    <Divider style={{ margin: '20px 0' }} />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        {/* Información del usuario que reportó */}
                        <Box width="48%">
                            <Typography variant="subtitle1" gutterBottom><strong>Usuario que reportó:</strong></Typography>
                            {
                                usuarioReporto ? (
                                    <>
                                        <Typography variant="body1"><strong>Nombre:</strong> {usuarioReporto.nombre}</Typography>
                                        <Typography variant="body1"><strong>Correo:</strong> {usuarioReporto.correo}</Typography>
                                        <Typography variant="body1"><strong>Teléfono:</strong> {usuarioReporto.telefono}</Typography>
                                        <Button variant="contained" color="primary" onClick={verPerfilUsuarioReporto} sx={{ m: '10px' }}>
                                            Ver perfil
                                        </Button>
                                    </>
                                ) :
                                    <>
                                        <Typography variant="body1">Usuario ya no existe</Typography>
                                        <Button variant="contained" color="primary" disabled sx={{ m: '10px' }}>Ver perfil</Button>
                                    </>

                            }
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
                                    </>
                                ) : (
                                    <Typography variant="body1">Usuario ya no existe</Typography>
                                )
                            }
                            {
                                usuarioReportado ? (
                                    <Button variant="contained" color="primary" onClick={verPerfil} sx={{ m: '10px' }}>
                                        Ver perfil
                                    </Button>
                                ) : <Button variant="contained" color="primary" disabled sx={{ m: '10px' }}>Ver perfil</Button>
                            }
                        </Box>
                    </Box>
                    <Divider style={{ margin: '20px 0' }} />
                    <Box>
                        <Select
                            native
                            value={estadoReporte}
                            onChange={(e) => setEstadoReporte(e.target.value)}
                        >
                            {
                                reportsState.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))
                            }
                        </Select>
                    </Box>
                </Box>
            </CustomModal>
        </>
    )
};

export default ModalReport;