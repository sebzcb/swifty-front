import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const theme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://your-website.com/">
        Your Website
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

        //Esto es muy poco seguro, pero es solo para pruebas
        const urlBase = import.meta.env.VITE_BACK_URL;
        await axios.post(`${urlBase}auth/login`, {
            correo: email, contrasenia: password
        }).then((response) => {
            // Verifica si la respuesta es correcta
            if (response.status !== 200) {
                throw new Error('Hubo un problema al realizar la solicitud.');
            }
        
            // Maneja la respuesta JSON
            const data = response.data;
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            // setEmail('');
            // setPassword('');
            navigate('/');
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
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