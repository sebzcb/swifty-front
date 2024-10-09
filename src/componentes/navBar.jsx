import { AppBar, Toolbar, Typography, Button, Container, IconButton, Avatar, Badge, Menu, MenuItem } from '@mui/material';  
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import { deepOrange } from '@mui/material/colors';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SolicitudSerTutor from './solicitudSerTutor';
import SolicitudSerTutorv2 from './solicitudSerTutorv2';
import { ROL } from '../constants/rol';

function Navbar() {
    const [usuario, setUsuario] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [openModal, setOpenModal] = useState(false);

    const handleOpenTutor = () => setOpenModal(true);
    const handleCloseTutor = () => setOpenModal(false);

    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleHome = (e) => {
        e.preventDefault();
        navigate('/');
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const cerrarSesion = (e) => {
        e.preventDefault();
        localStorage.removeItem('usuario');
        setUsuario(null);
        navigate('/');
    }
    
    const iniciarSesion = (e) => {
        e.preventDefault();
        navigate('/login');
    }
    const registro = (e) => {
        e.preventDefault();
        navigate('/registro');
    }

    const verPerfil = (e)=>{
        e.preventDefault();
        navigate('/' + usuario.id);
    }

    const gestionarTutorias = (e)=>{
        e.preventDefault();
        navigate('/tutorias');
    }
    const verAdminPanel = (e)=>{
        e.preventDefault();
        navigate('/admin/users');
    }
    const solicitarSerTutor = (e)=>{
        e.preventDefault();
        handleOpenTutor();
        console.log('solicitar ser tutor'); 
    }

    useEffect(() => {
        setUsuario(JSON.parse(localStorage.getItem('usuario')));
        // setUsuario(usuarioActual);
    }, []);

    //{"rol":"tutor"}
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Container style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', gap:'20px' }}>
                        <Button color="inherit" onClick={handleHome}>
                            <Typography variant="h6" >
                                Swifty
                            </Typography>
                        </Button>
                        {
                            usuario != null ?
                            usuario.rol == 'estudiante' ?
                                <Button color="inherit" onClick={solicitarSerTutor}><SchoolIcon style={{marginRight:'20px'}}/> Solicitar ser tutor </Button>:
                                <Button color="inherit" onClick={gestionarTutorias}><ManageSearchIcon style={{marginRight:'20px'}}/> Gestionar tutorias </Button>
                            :
                            null
                        }
                    </Container>
                    {
                        usuario == null ? 
                        <>
                            <Button color="inherit" onClick={iniciarSesion}>Iniciar sesión</Button>
                            <Button color="inherit" onClick={registro}>Regístrate</Button>
                        </> :
                        <>
                            <IconButton 
                                id="basic-button" aria-controls={open ? 'basic-menu' : undefined} 
                                aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}
                                color="inherit"
                            > 
                                <MenuIcon/> 
                            </IconButton>
                            <Menu 
                                id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={verPerfil}>Mi perfil</MenuItem>
                                <MenuItem onClick={handleClose}>Configuracion</MenuItem>
                                
                                <MenuItem onClick={handleClose}>Mensajes</MenuItem>
                                {
                                    usuario.rol == ROL.ADMINISTRADOR && 
                                    <MenuItem onClick={verAdminPanel}>Administrador</MenuItem>

                                }
                                <MenuItem onClick={cerrarSesion} style={{color: 'red'}}>Cerrar Sesión</MenuItem>
                            </Menu>

                            <IconButton color="inherit" onClick={verPerfil}>
                                <Avatar sx={{ bgcolor: deepOrange[500] }}>{usuario.nombre[0]}</Avatar>
                            </IconButton>
                        </>
                    }
                </Toolbar>
                
            </AppBar>
            <SolicitudSerTutorv2 open={openModal} handleClose={handleCloseTutor}/>
        </>

       
    );
}

export default Navbar;