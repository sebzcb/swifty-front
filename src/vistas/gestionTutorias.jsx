// src/App.js
import  { useState } from 'react';
import { Container, Button, Box } from '@mui/material';
import VerTutorias from '../componentes/profile/tutor/verTutorias';
import VerSolicitudes from '../componentes/profile/tutor/verSolicitudes';
import Navbar from '../componentes/navBar';

function GestionTutorias() {
  const [view, setView] = useState('tutorias');

  return (
    <>
        <Navbar/>
        <Container>
            <Box display="flex" justifyContent="center" marginY={2}>
                <Button variant={view === 'tutorias' ? 'contained' : 'outlined'} onClick={() => setView('tutorias')}>
                Ver tutorías
                </Button>
                <Button variant={view === 'solicitudes' ? 'contained' : 'outlined'} onClick={() => setView('solicitudes')}>
                Ver solicitudes
                </Button>
            </Box>
            {view === 'tutorias' ? <VerTutorias /> : <VerSolicitudes />}
        </Container>
    </>
  );
}

export default GestionTutorias;
