import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem } from '@mui/material';

const EditarTutoriaModal = ({ setOpenModalEditar, tutoria, handleEditarTutoria }) => {
    const [descripcion, setDescripcion] = useState(tutoria.descripcion);
    const [modalidad, setModalidad] = useState(tutoria.modalidad);
    const [fecha, setFecha] = useState(tutoria.fecha);
    const [horaInicio, setHoraInicio] = useState(tutoria.hora);
    const [horaFin, setHoraFin] = useState(tutoria.horafinal);
    const [maxEstudiantes, setMaxEstudiantes] = useState(tutoria.cantidadmaximaestudiantes);
    console.log(tutoria);
    const handleGuardar = async () => {
        // Aquí puedes manejar la lógica para guardar los cambios
        console.log('Guardar cambios', descripcion, modalidad, fecha, horaInicio, horaFin, maxEstudiantes);
        setOpenModalEditar(false);
        await handleEditarTutoria(descripcion,modalidad,fecha,horaInicio,horaFin,maxEstudiantes);
    };

    return (
        <Modal open={true} onClose={() => setOpenModalEditar(false)}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 2,
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                bgcolor: 'background.paper', 
                boxShadow: 24, 
                borderRadius: 2 
            }}>
                <h1>Editar Tutoría</h1>
                <TextField
                    label="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    margin="normal"
                    fullWidth
                    multiline
                    rows={4}
                />
                <Select
                    label="Modalidad"
                    value={modalidad}
                    onChange={(e) => setModalidad(e.target.value)}
                    margin="normal"
                    fullWidth
                >
                    <MenuItem value="virtual">Virtual</MenuItem>
                    <MenuItem value="hibrida">Híbrida</MenuItem>
                    <MenuItem value="presencial">Presencial</MenuItem>
                </Select>
                <TextField
                    label="Fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Hora Inicial"
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Hora Final"
                    type="time"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Cantidad máxima de estudiantes"
                    type="number"
                    value={maxEstudiantes}
                    onChange={(e) => setMaxEstudiantes(e.target.value)}
                    margin="normal"
                    fullWidth
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
                <Button onClick={handleGuardar} color="primary" variant="contained" sx={{ mt: 2 }}>
                    Guardar 
                </Button>
                <Button onClick={()=>{setOpenModalEditar(false)}} color="primary" variant="contained" sx={{ mt: 2 }}>
                    Cancelar 
                </Button>
            </Box>
        </Modal>
    );
}

export default EditarTutoriaModal;
