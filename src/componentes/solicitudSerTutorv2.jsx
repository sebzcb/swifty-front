import { Box, Button, Modal, TextField, Typography, IconButton, Autocomplete } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SolicitudSerTutorv2 = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Solicitar ser Tutor
        </Typography>
        <Typography variant="body1" gutterBottom>
          Envía un correo a <strong>swifty@gmail.cl</strong> con los siguientes datos:
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Nombre y Apellido</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Universidad</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Las asignaturas que te interesan impartir</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Credencial universitaria:</strong> Archivos que demuestran que es parte de la universidad en el formato que estime conveniente.
        </Typography>
        <Typography>
          <strong>¡Gracias por querer ser parte de nuestra comunidad! Cualquier duda/inconveniente se te respondera al correo. </strong>
        </Typography>
      </Box>
    </Modal>
  );
};

export default SolicitudSerTutorv2;
