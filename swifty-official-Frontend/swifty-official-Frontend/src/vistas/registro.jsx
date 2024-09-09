import  { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
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
      <Link color="inherit" href="/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Registro() {
  const navigate = useNavigate();
  const [universidades, setUniversidades] = useState([]);
  const [universidad, setUniversidad] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadUniversidades = async () => {
      try {
        const res = await axios.get('http://localhost:3030/universidades');
        setUniversidades(res.data);
      } catch (error) {
        console.error('Error al cargar universidades:', error);
      }
    };
    loadUniversidades();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const name = data.get('name');

    let validationErrors = {};

    if (!validateName(name)) {
      validationErrors.name = 'El nombre solo puede contener letras y espacios';
    }

    if (!validateEmail(email)) {
      validationErrors.email = 'Correo no válido';
    }

    if (password === '') {
      validationErrors.password = 'La contraseña es requerida';
    }

    if (universidad === '') {
      validationErrors.universidad = 'Debe seleccionar una universidad';
    }

    if (!termsChecked) {
      validationErrors.terms = 'Debe aceptar los términos y condiciones';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }

    try {
      const response = await axios.post('http://localhost:3030/auth/registro', {
        nombre: name,
        correo: email,
        contrasenia: password,
        id_universidad: universidad
      });

      if (response.status !== 201) {
        throw new Error('Hubo un problema al realizar la solicitud.');
      }

      navigate('/');
    } catch (error) {
      alert('Hubo un problema al registrar el usuario');
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              margin="normal"
              required
              select
              fullWidth
              name="universidad"
              label="Universidad"
              value={universidad}
              onChange={(e) => setUniversidad(e.target.value)}
              error={!!errors.universidad}
              helperText={errors.universidad}
            >
              {universidades.map((universidad) => (
                <MenuItem key={universidad.id} value={universidad.id}>
                  {universidad.nombre}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={<Checkbox checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} color="primary" />}
              label="I agree with the terms and conditions."
            />
            {errors.terms && <Typography color="error" variant="body2">{errors.terms}</Typography>}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Registro;
