import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { validateEmail } from '../utils/validateEmail';
import { validatePassword } from '../utils/validatePassword';

const theme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Swifty
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Login() {

    const navigate = useNavigate();

    const handleLogin = async (e)=>{

        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

        if(email == '' || password == ''){
            alert('El correo o contraseña no se ingreso');
            return;
        }
        if(!validateEmail(email)){
            alert('Correo no válido');
            return;
        }
        if (!validatePassword(password)) {
            alert('Contraseña no válida, formato: 8 a 20 caracteres, con al menos una letra mayúscula y un número');
            return;
        }
        const urlBase = import.meta.env.VITE_BACK_URL;
        await axios.post(`${urlBase}auth/login`, {
            correo: email, contrasenia: password
        }).then((response) => {
            // Verifica si la respuesta es correcta
            if (response.status !== 200) {
                throw new Error('Hubo un problema al realizar la solicitud.');
            }
            window.location.replace("/"); // Cambia la ruta y recarga la página
        }).catch((error) => {
            alert('El nombre y/o contraseña son incorrectas');
            console.error(error);
        });
    }


    return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <img src="/logo.png" alt="Logo" style={{ width: '100px', height: '100px', marginBottom: '16px' }} onClick={() => navigate('/')} />
                <Typography component="h1" variant="h5">
                    Iniciar sesión
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus/>
                    <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password"/>
{/*                    <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me"/>
*/}                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Iniciar sesión	
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="recuperarcontrasena" variant="body2">
                            ¿Olvidaste tu contraseña?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="registro" variant="body2">
                            {"¿No tienes cuenta? Registrate"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
        </ThemeProvider>
    );
}

export default Login;