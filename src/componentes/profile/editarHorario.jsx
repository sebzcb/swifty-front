import { Modal, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';

const colorMap = {
  green: 'success.main',
  red: 'error.main'
};

//MODAL HORARIO TUTOR
const EditarHorario = ({ data, open, handleClose, handleSave, handleCircleClick, times, days }) => {
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box 
          sx={{
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: 600, 
            bgcolor: 'background.paper', 
            border: '2px solid #000', 
            boxShadow: 24, 
            p: 4 
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell> {/* Empty cell for the times column */}
                  {days.map((day) => (
                    <TableCell key={day}>
                      <Typography variant="body2">{day}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>
                      <Typography variant="body2">{times[rowIndex]}</Typography>
                    </TableCell>
                    {row.map((color, colIndex) => (
                      <TableCell key={colIndex}>
                        <IconButton onClick={() => handleCircleClick(rowIndex, colIndex)}>
                          <CircleIcon sx={{ color: colorMap[color] }} />
                        </IconButton>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleSave}>Guardar</Button>
        </Box>
      </Modal>
    </>
  );
};

export default EditarHorario;