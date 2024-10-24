import { CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { getWeekNumber } from '../../utils/getWeeNumber';
import { getFutureWeeks } from '../../utils/getFutureWeeks';

const HorarioVer = ({ data, handleOpen, usuario, days, times,añoSeleccionado, setAñoSeleccionado, week, setWeek }) => {
    // Si data no está definido, inicializamos todos los valores a 'green'
    const horario = data || new Array(times.length).fill(new Array(days.length).fill('green'));
    const [semanaSeleccionada, setSemanaSeleccionada] = useState('');
    const [semanas, setSemanas] = useState([]);

    useEffect(() => {
        const currentWeek = week;
        setSemanaSeleccionada(`Semana ${currentWeek} (${new Date().getFullYear()})`);
        setSemanas(getFutureWeeks(currentWeek, 100)); // Genera las próximas 100 semanas
    }, []);

    const handleChangeSemana = (e) => {
        const selectedValue = e.target.value;
        const [_, week, year] = selectedValue.match(/Semana (\d+) \((\d+)\)/);
        setSemanaSeleccionada(selectedValue);
        setAñoSeleccionado(parseInt(year, 10));
        setWeek(parseInt(week, 10));
       // console.log('Semana seleccionada:', week, 'Año seleccionado:', year);
    };
    useEffect(() => {
        console.log('Semana seleccionada:', semanaSeleccionada);
    }, [semanaSeleccionada]);
    return (
        <CardContent>
            <Typography variant="h6">Horario</Typography>
            {/* Parte para seleccionar la semana a mostrar */}
            <Select
                value={semanaSeleccionada}
                onChange={handleChangeSemana}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value="" disabled>
                    Semana
                </MenuItem>
                {semanas.map((semana) => (
                    <MenuItem key={semana} value={semana}>{semana}</MenuItem>
                ))}
            </Select>
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