import  { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Rating } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useSnackContext } from '../../context/SnackContext';
import { useUserContext } from '../../context/UserContext';

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

const Calificar = ({ open, handleClose, idUsuario }) => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState(null);
  const {openSnack } = useSnackContext();
  const { userInfo } = useUserContext();
  useEffect(() => {
    const obtenerCalificacionPrevio = async () => {
      try {
        const id_estudiante = userInfo.id;
        const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/comentario`, {
          id_estudiante,
          id_tutor: idUsuario,
        });
        console.log(response);
        if (response.status === 200 && response.data) {
          const { calificacion, comentario } = response.data[0];
          setCalificacion(calificacion || 0);
          setComentario(comentario || '');
        }
      } catch (error) {
        console.error('Error al obtener la calificación previa:', error);
        openSnack('Hubo un problema al obtener la calificación previa.', 'error');
      }
    };

    if (open) {
      obtenerCalificacionPrevio();
    }
  }, [open, idUsuario]);

  const handleEnviarCalificacion = async () => {
    if (calificacion === 0 || comentario.trim() === '') {
      setError('Por favor complete todos los campos requeridos.');
      return;
    }

    try {
      const id_estudiante = userInfo.id;
      const datosCalificacion = {
        id_estudiante,
        id_tutor: idUsuario,
        comentario,
        calificacion,
      };

      const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/calificar`, datosCalificacion);
      setTicket(response.data.ticket);
      handleClose();
      openSnack('Calificación enviada', 'success');
    } catch (error) {
      console.error('Error al enviar la calificación:', error);
      setError('Hubo un problema al enviar la calificación. Por favor, inténtelo de nuevo.');
      openSnack('Hubo un problema al enviar la calificación. Por favor, inténtelo de nuevo.', 'error');
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setCalificacion(0);
    setComentario('');
    setError('');
    setTicket(null);
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-title" variant="h6" component="h2">
          Calificar usuario
        </Typography>
        {ticket ? (
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Gracias por tu calificación. Tu número de ticket es: {ticket}
          </Typography>
        ) : (
          <>
            <Rating
              name="calificacion"
              value={calificacion}
              onChange={(event, newValue) => {
                setCalificacion(newValue);
                setError('');
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              margin="normal"
              label="Comentario"
              placeholder="Escribe tu comentario (máximo 300 caracteres)"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              inputProps={{ maxLength: 300 }}
            />
            {error && (
              <Typography color="error" sx={{ marginTop: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={handleEnviarCalificacion}
            >
              Comentar
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default Calificar;
