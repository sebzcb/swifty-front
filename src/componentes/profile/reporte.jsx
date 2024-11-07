import  { useState } from 'react';
import { Modal, Box, Typography, TextField, MenuItem, Button, IconButton, Stack } from '@mui/material';
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

const Report = ({ open, handleClose, idUsuario }) => {
  const [motivo, setMotivo] = useState('');
  const [detalles, setDetalles] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState(null);
  const {openSnack} = useSnackContext();
  const { userInfo } = useUserContext();
  const motivosReporte = ['Acoso', 'Spam', 'Contenido inapropiado', 'Otros'];

  const handleEnviarReporte = async () => {
    if (!motivo || !detalles) {
      setError('Por favor complete todos los campos requeridos.');
      return;
    }

    try {
      const id_usuario_reporto = userInfo.id;
      const datosReporte = {
        id_reportado: idUsuario,
        id_usuario_reporto,
        motivo,
        detalles,
        imagenes: imagenes.map(imagen => imagen.name)
      };

      console.log('Datos del reporte:', datosReporte);

      const res = await axios.post(`${import.meta.env.VITE_BACK_URL}reportes/upload`, datosReporte);

      console.log(res.data);
      setTicket(res.data.ticket);
      handleClose();
      openSnack('Reporte enviado con éxito', 'success');
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      openSnack('Hubo un problema al enviar el reporte.', 'error');
    }
  };

  const handleChangeImagenes = (e) => {
    setImagenes([...e.target.files]);
  };

  const handleCloseModal = () => {
    handleClose();
    setMotivo('');
    setDetalles('');
    setImagenes([]);
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
          Reportar usuario
        </Typography>
        {ticket ? (
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Gracias por tu reporte. Tu número de ticket es: {ticket}
          </Typography>
        ) : (
          <>
            <TextField
              fullWidth
              select
              margin="normal"
              label="Motivo del reporte"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            >
              {motivosReporte.map((motivo) => (
                <MenuItem key={motivo} value={motivo}>{motivo}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={4}
              margin="normal"
              label="Detalles"
              placeholder="Proporcione detalles adicionales (máximo 500 caracteres)"
              value={detalles}
              onChange={(e) => setDetalles(e.target.value)}
              inputProps={{ maxLength: 500 }}
            />
{/*            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Adjuntar imágenes
              <input
                type="file"
                hidden
                accept="image/png, image/jpeg"
                multiple
                onChange={handleChangeImagenes}
              />
            </Button>*/}
            <Stack spacing={1} sx={{ marginTop: 2 }}>
              {imagenes.length > 0 && (
                <Typography variant="body2">Imágenes seleccionadas:</Typography>
              )}
              {imagenes.map((imagen, index) => (
                <Typography key={index} variant="body2">
                  {imagen.name}
                </Typography>
              ))}
            </Stack>
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
              onClick={handleEnviarReporte}
            >
              Enviar reporte
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default Report;
