import {  CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const HorarioVer = ({data, handleOpen, usuario, days, times }) => {
    // Si data no está definido, inicializamos todos los valores a 'green'
    const horario = data || new Array(times.length).fill(new Array(days.length).fill('green'));

    return (
        <CardContent>
            <Typography variant="h6">Horario</Typography>
            {
                usuario?.rol == 'tutor' ?
                    <Button onClick={handleOpen} startIcon={<EditIcon />}>Editar horario</Button> :
                    null
            }
            <Typography variant="h6">Horario</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            {days.map((day) => (
                                <TableCell key={day}>
                                    <Typography variant="body2">{day}</Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {times.map((time, timeIndex) => (
                            <TableRow key={time}>
                                <TableCell>
                                    <Typography variant="body2">{time}</Typography>
                                </TableCell>
                                {days.map((day, dayIndex) => (
                                    <TableCell key={day} align="center">
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                width: '15px',
                                                height: '15px',
                                                borderRadius: '50%',
                                                backgroundColor: horario[timeIndex][dayIndex],
                                            }}
                                        ></span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </CardContent>
    );
};

export default HorarioVer;
