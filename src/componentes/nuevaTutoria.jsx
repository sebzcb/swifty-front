import React from 'react';
import { Modal, Box, Typography, TextField, MenuItem, Button, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSnackContext } from '../context/SnackContext';
import { getAsignaturasImpartidasPorTutorService } from '../services/asignaturasServices';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

const NuevaTutoria = ({ open, handleClose, id_tutor }) => {
  const [modalidad, setModalidad] = React.useState('');
  const [fecha, setFecha] = React.useState(dayjs(null));
  const [hora, setHora] = React.useState(dayjs(null));
  const [asignaturas, setAsignaturas] = useState([]); // Añade un nuevo estado para almacenar las asignaturas 
  const [asignaturaElegida, setAsignaturaElegida] = useState(''); // Añade un nuevo estado para almacenar la asignatura elegida
  const [descripcion, setDescripcion] = useState('');
  const { openSnack } = useSnackContext();

  const getAsignaturas = async () => {
    getAsignaturasImpartidasPorTutorService(id_tutor).then((res) => {
      console.log("asignaturas:", res.data);
      setAsignaturas(res.data);
    }).catch((error) => {
      console.error('Error al cargar las asignaturas:', error);
    });
  };

  useEffect(() => {
    getAsignaturas();
  }, []);

  const handleChangeAsignatura = (e) => {
    console.log(e.target.value);
    setAsignaturaElegida(e.target.value); // Almacena la asignatura elegida
  };

  const handleEnviarSolicitud = async () => {
    // Verificar que todos los campos obligatorios estén rellenos
    if (!asignaturaElegida || !modalidad || !fecha.isValid() || !hora.isValid()) {
      openSnack('Por favor, rellena todos los campos obligatorios', 'error');
      return;
    }

    console.log("fecha:", fecha);
    console.log("hora:", hora);

    console.log('Enviar solicitud');
    const id_estudiante = JSON.parse(localStorage.getItem('usuario')).id;

    console.log("idest:", id_estudiante, "idtut:", id_tutor, asignaturaElegida, modalidad, fecha.format('YYYY-MM-DD'), hora.format('HH:mm'), descripcion);
    const fechaHora = `${fecha.format('YYYY-MM-DD')}T${hora.format('HH:mm')}:00`;

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/solicitudes/subir`, 
        { id_estudiante, id_tutor, id_asignatura: asignaturaElegida, modalidad, 
          fecha: fecha.format('YYYY-MM-DD'), hora: fechaHora, descripcion 
        });

      console.log(res.data);
      handleClose();
      openSnack('Solicitud enviada', 'success');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      openSnack('Hubo un problema al enviar la solicitud', 'error');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-title" variant="h6" component="h2">
          Ayuda al tutor a entender sobre tu contexto 😊
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          margin="normal"
          label="Descripción"
          placeholder="Puedes escribir en qué asignatura quieres que te ayude."
          value={descripcion} // Vincula el estado de la descripción con el campo de texto
          onChange={(e) => setDescripcion(e.target.value)} // Actualiza el estado cuando el usuario escribe
        />
        <TextField
          fullWidth
          select
          margin="normal"
          label="Asignatura"
          onChange={handleChangeAsignatura}
        >
          {asignaturas.map((asignatura) => (
            <MenuItem key={asignatura.codigo} value={asignatura.codigo_asignatura}>{asignatura.nombre_asignatura}</MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          margin="normal"
          label="Modalidad (Opcional)"
          value={modalidad}
          onChange={(e) => setModalidad(e.target.value)}
        >
          <MenuItem value="presencial">Presencial</MenuItem>
          <MenuItem value="online">Online</MenuItem>
          <MenuItem value="hibrida">Híbrida</MenuItem>
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" spacing={3} marginTop={3}>
            <DatePicker
              label="Fecha"
              value={fecha}
              onChange={(newValue) => setFecha(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
            <TimePicker
              label="Hora"
              value={hora}
              onChange={(newValue) => setHora(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </Stack>
        </LocalizationProvider>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleEnviarSolicitud}
        >
          Enviar solicitud
        </Button>
      </Box>
    </Modal>
  );
};

export default NuevaTutoria;