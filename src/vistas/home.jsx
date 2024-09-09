import { 
    Typography, Container, 
    Grid, Card, CardContent
} from '@mui/material';
import NavBar from '../componentes/navBar';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BusquedaBarra from '../componentes/busquedaBarra';

function Home() {
    const navigate = useNavigate();
    const [tutores, getTutores] = useState(null);

    const hanlerPerfil = (id) => {
        navigate('/' + id);
    }
    useEffect(() => {
        const getTutoresBackend = async () => {
            await axios.get(`${import.meta.env.VITE_BACK_URL}usuario/lista/tutores`)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Hubo un problema al realizar la solicitud.');
                    return;
                }
                const data = response.data;
                // console.log(data);
                getTutores(data);
            }).catch((error) => {
                console.error('Hubo un problema al realizar la solicitud:', error);
            });
        }
        getTutoresBackend();
    }, []);
    return (
        <>
            <NavBar/>
            {/* Contenido principal */}
            <Container style={{ marginTop: '20px' }}>
                <Typography variant="h4" align="center">
                    Encuentra tu tutor perfecto en Swifty!
                </Typography>
                <Typography variant="subtitle1" align="center" style={{ marginBottom: '20px' }}>
                    1,480,086 tutores listos para ayudarte con tus exámenes!
                </Typography>

                <BusquedaBarra isHomePage={true}/>
                {/* Categorías Populares */}
                <Typography variant="h5" style={{ marginBottom: '20px' }}>
                    Categorías populares
                </Typography>
                <Grid container spacing={2}>
                    {[...Array(6)].map((_, index) => (
                    <Grid item xs={4} key={index}>
                        <Card sx={{":hover": {
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                        }}}
                            onClick={() => navigate('/busqueda')}
                        >
                        <CardContent>
                                <Typography variant="h6" align="center">
                                Matemáticas 23
                                </Typography>
                        </CardContent>
                        </Card>
                    </Grid>
                    ))}
                </Grid>

                {/* Tutores con mejor valoración */}
                <Typography variant="h5" style={{ margin: '40px 0 20px 0' }}>
                    Tutores con mejor valoración!
                </Typography>
                <Grid container spacing={2}>
                    {tutores?.map((tutor, index) => (
                    <Grid item xs={2} key={index}>
                        <Card sx={{":hover": {
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(0,0,0,0.2)'
                        }}}
                            onClick={()=>{hanlerPerfil(tutor.id)}}
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
