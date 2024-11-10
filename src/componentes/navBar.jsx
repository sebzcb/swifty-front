import { AppBar, Toolbar, Typography, Button, Container, IconButton, Avatar, Badge, Menu, MenuItem, useMediaQuery } from '@mui/material';  
import SchoolIcon from '@mui/icons-material/School';
import MenuIcon from '@mui/icons-material/Menu';
import { deepOrange } from '@mui/material/colors';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SolicitudSerTutorv2 from './solicitudSerTutorv2';
import { ROL } from '../constants/rol';
import { useUserContext } from '../context/UserContext';
import { logoutService } from '../services/usersServices';

function Navbar() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const { userInfo } = useUserContext();
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
        logoutService().then(() => 
            //recargar la pagina
            window.location.reload()
        ).catch((error) => console.error('Error al cerrar sesión:', error));
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
        console.log('ver perfil id '+userInfo.id);
        navigate('/' + userInfo.id);
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
    //{"rol":"tutor"}
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Container style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', gap:'20px' }}>
                        <Button color="inherit" onClick={handleHome}>
                            <img src="/logo.png" alt="Logo" style={{ width: '60px', height: '60px'}} onClick={() => navigate('/')} />
                           {
                                 !isMobile &&
                           
                           <Typography variant="h6" >
                                Swifty
                            </Typography>
                           } 
                        </Button>
                        {
                            userInfo != null && userInfo.rol === ROL.ESTUDIANTE &&
                            <Button color="inherit" onClick={solicitarSerTutor}>
                                <SchoolIcon style={{ marginRight: '20px' }} /> Solicitar ser tutor
                            </Button>
                        }
                        {
                            userInfo != null && userInfo.rol === ROL.TUTOR &&
                            <Button color="inherit" onClick={gestionarTutorias}>
                                <ManageSearchIcon style={{ marginRight: '20px' }} /> Gestionar tutorias
                            </Button>
                        }
                    </Container>
                    {
                        userInfo == null ? 
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
{/*                                <MenuItem onClick={handleClose}>Configuracion</MenuItem>
*/}                                
{/*                                <MenuItem onClick={handleClose}>Mensajes</MenuItem>
*/}                                {
                                    userInfo.rol == ROL.ADMINISTRADOR && 
                                    <MenuItem onClick={verAdminPanel}>Administrador</MenuItem>

                                }
                                <MenuItem onClick={cerrarSesion} style={{color: 'red'}}>Cerrar Sesión</MenuItem>
                            </Menu>
                            {
                                !isMobile &&
                            <IconButton color="inherit" onClick={verPerfil}>
                                <Avatar sx={{ bgcolor: deepOrange[500] }}>{userInfo.nombre[0]}</Avatar>
                            </IconButton>
                            }
                        </>
                    }
                </Toolbar>
                
            </AppBar>
            <SolicitudSerTutorv2 open={openModal} handleClose={handleCloseTutor}/>
        </>

       
    );
}

export default Navbar;