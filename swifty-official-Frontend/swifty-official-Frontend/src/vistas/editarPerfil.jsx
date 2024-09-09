import { Container, Grid } from '@mui/material';
import Perfil from '../componentes/perfil';
import Horario from '../componentes/horario';
import TutoresSeguidos from '../componentes/tutoresSeguidos';
import Navbar from '../componentes/navBar';

const EdicionPerfil = () => {
    

  return (
    <>
        <Navbar/>
        <Container sx={{marginTop:'20px'}}>
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Perfil />
            </Grid>
            <Grid item xs={9}>
                <Horario />
            </Grid>
          {/*  <Grid item xs={3}>
                <TutoresSeguidos />
            </Grid>*/}
        </Grid>
        </Container>
    </>
  );
};

export default EdicionPerfil;
