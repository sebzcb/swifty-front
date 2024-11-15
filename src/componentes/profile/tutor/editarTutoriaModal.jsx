import { useState } from 'react';
import { Modal, Box, TextField, Button, Select, MenuItem, Typography } from '@mui/material';
import { TUTORIA_INFO } from './tutoriainfo';

const EditarTutoriaModal = ({ setOpenModalEditar, tutoria, handleEditarTutoria }) => {
    const [descripcion, setDescripcion] = useState(tutoria.descripcion);
    const [modalidad, setModalidad] = useState(tutoria.modalidad);
    const [fecha, setFecha] = useState(tutoria.fecha);
    const [horaInicio, setHoraInicio] = useState(tutoria.hora);
    const [horaFin, setHoraFin] = useState(tutoria.horafinal);
    const [maxEstudiantes, setMaxEstudiantes] = useState(tutoria.cantidadmaximaestudiantes);
    const [precioHora, setPrecioHora] = useState(tutoria.precioporhora);
    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    console.log(tutoria);
    const handleGuardar = async () => {
        // Aquí puedes manejar la lógica para guardar los cambios
        console.log('Guardar cambios', descripcion, modalidad, fecha, horaInicio, horaFin, maxEstudiantes);
        if( horaInicio >= horaFin){
            alert('La hora final debe ser mayor que la hora de inicio');
            return;
        }
        if(precioHora < TUTORIA_INFO.MIN_PRICE || precioHora > TUTORIA_INFO.MAX_PRICE){
            alert(`El precio por hora debe estar entre $${TUTORIA_INFO.MIN_PRICE} y $${TUTORIA_INFO.MAX_PRICE}`);
            return;
        }
        setOpenModalEditar(false);
        await handleEditarTutoria(descripcion, modalidad, fecha, horaInicio, horaFin, maxEstudiantes,precioHora);
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
                borderRadius: 2,
                width: 400
            }}>
                <Typography id="modal-title" variant="h6" component="h2">
                    Editar Tutoria de: {tutoria?.nombre_estudiante}
                </Typography>
                <TextField
                    label="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    margin="normal"
                    fullWidth
                    multiline
                    rows={2}
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
                    inputProps={{ min: today }}
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
                     <TextField
                    label="Precio por hora"
                    name="precioHora"
                    value={precioHora}
                    onChange={(e) => setPrecioHora(e.target.value)}
                    fullWidth
                    margin="dense"
                    type="number"
                    InputProps={{ inputProps: { min: TUTORIA_INFO.MIN_PRICE, max: TUTORIA_INFO.MAX_PRICE } }}
                    />
                <Box sx={{display:'flex',gap:'10px'}}>
                <Button onClick={() => { setOpenModalEditar(false) }} color="primary" variant="contained" sx={{ mt: 2 }}>
                    Cancelar
                </Button>
                <Button onClick={handleGuardar} color="primary" variant="contained" sx={{ mt: 2 }}>
                    Guardar
                </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default EditarTutoriaModal;
