import { Container, Grid } from '@mui/material';
import Navbar from '../componentes/navBar';
import Perfil from '../componentes/profile/perfil';
import Horario from '../componentes/profile/horario';
import { useMediaQuery } from '@mui/material';

const EdicionPerfil = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <>
      <Navbar />
      <Container sx={{ marginTop: '20px' }}>
        <Grid container spacing={2}>
          {
            !isMobile &&
            <>
              <Grid item xs={3}>
                <Perfil />
              </Grid>
              <Grid item xs={9}>
                <Horario />
              </Grid>
            </>
          }
          {
            isMobile &&
            <>
              <Grid item xs={12}>
                <Perfil />
              </Grid>
              <Grid item xs={12}>
                <Horario />
              </Grid>
            </>
          } 
          {/*  <Grid item xs={3}>
                <TutoresSeguidos />
            </Grid>*/}
        </Grid>
      </Container>
    </>
  );
};

export default EdicionPerfil;
