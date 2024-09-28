import {
    Typography, Container,
    Grid, Card, CardContent, Box
} from '@mui/material';
import NavBar from '../componentes/navBar';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BusquedaBarra from '../componentes/busquedaBarra';
import { getAsignaturasService } from '../services/asignaturasServices';

function Home() {
    const navigate = useNavigate();
    const [tutores, getTutores] = useState(null);
    const [asignaturas, setAsignaturas] = useState([]);
    const hanlerPerfil = (id) => {
        navigate('/' + id);
    }
    const getAsignaturas = async () => {
        getAsignaturasService().then((res) => {
            setAsignaturas(res.data);
        }).catch((error) => {
            console.error('Hubo un problema al realizar la solicitud:', error);
        });
    };
    useEffect(() => {
        const getTutoresBackend = async () => {
            await axios.get(`${import.meta.env.VITE_BACK_URL}usuario/lista/tutores`)
                .then((response) => {
                    if (response.status !== 200) {
                        throw new Error('Hubo un problema al realizar la solicitud.');
                        return;
                    }
                    const data = response.data;
                    getTutores(data);
                }).catch((error) => {
                    console.error('Hubo un problema al realizar la solicitud:', error);
                });
        }
        getTutoresBackend();
        getAsignaturas();
    }, []);
    const CardHome = ({ nombre ,codigo}) => {
        //http://localhost:5173/search?keyword=d&page=1&limit=9&order=valoracion&direction=desc&asignaturas=
        return (
            <Card sx={{
                ":hover": {
                    cursor: 'pointer',
                    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                }
            }}
        
                onClick={() => navigate('/search?&asignaturas='+codigo)}
            >
                <CardContent>
                    <Typography variant="h6" align="center">
                       {nombre}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
    return (
        <>
            <NavBar />
            {/* Contenido principal */}
            <Container style={{ marginTop: '20px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Encuentra tu tutor perfecto en Swifty!
                </Typography>
                <Typography variant="subtitle1" align="center" style={{ marginBottom: '20px' }}>
                    1,480,086 tutores listos para ayudarte con tus exámenes!
                </Typography>

                <Box mb={4}>
                    <BusquedaBarra isHomePage={true} />
                </Box>

                {/* Categorías Populares */}
                <Typography variant="h5" style={{ marginBottom: '20px' }}>
                    Asignaturas populares
                </Typography>
                <Grid container spacing={2} mb={4}>
                    {
                        asignaturas.map((asignatura, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <CardHome nombre={asignatura?.nombreasignatura} codigo={asignatura.codigo}/>
                            </Grid>
                        ))
                    }
                </Grid>

                {/* Tutores con mejor valoración */}
                <Typography variant="h5" style={{ margin: '40px 0 20px 0' }}>
                    Tutores con mejor valoración!
                </Typography>
                <Grid container spacing={2}>
                    {tutores?.map((tutor, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                            <Card sx={{
                                ":hover": {
                                    cursor: 'pointer',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                                }
                            }}
                                onClick={() => { hanlerPerfil(tutor.id) }}
                            >
                                <CardContent>
                                    <Typography variant="h6" align="center">
                                        {tutor.nombre}
                                    </Typography>
                                    <Typography variant="subtitle1" align="center">
                                        PUCV
                                    </Typography>
                                    <Typography variant="subtitle2" align="center">
                                        {tutor.correo}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Pie de página */}
            <footer style={{ marginTop: '40px', textAlign: 'center', padding: '20px', background: '#f5f5f5' }}>
                <Typography variant="body1">Swifty © 2022</Typography>
                <Typography variant="body2">
                    Soporte | Centro de ayuda | Equipo de soporte | Cómo funciona | Contáctanos
                </Typography>
            </footer>
        </>
    );
}

export default Home;