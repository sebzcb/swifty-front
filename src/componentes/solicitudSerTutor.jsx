import  { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, IconButton, Autocomplete } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackContext } from '../context/SnackContext';

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

const SolicitudSerTutor = ({open, handleClose}) => {
  const [subjects, setSubjects] = useState(['Arquitectura de hardware', 'Redeszzz']);
  const [newSubject, setNewSubject] = useState('');
  const { openSnack } = useSnackContext();
  const handleSubmit = () => {
    handleClose();
    openSnack('Solicitud enviada', 'success');
  }
  const handleAddSubject = () => {
    if (newSubject && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
    }
  };

  const handleDeleteSubject = (subjectToDelete) => () => {
    setSubjects(subjects.filter((subject) => subject !== subjectToDelete));
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <IconButton onClick={handleClose} style={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2">
            ¡Conviértete en tutor!
          </Typography>
          <Box my={2}>
            <Typography>¿Qué asignaturas quieres impartir?</Typography>
            {/* <Box display="flex" alignItems="center"> */}
            <Autocomplete
              multiple
              id="tags-outlined"
              options={subjects}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  // label="filterSelectedOptions"
                  placeholder="Asignaturas"
                />
              )}
            />
            {/* </Box> */}
          </Box>
          <Box mt={2}>
            <Typography>Subir archivos</Typography>
            <TextField
              type="file"
              inputProps={{ multiple: true }}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Box>
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            Enviar solicitud
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default SolicitudSerTutor;
