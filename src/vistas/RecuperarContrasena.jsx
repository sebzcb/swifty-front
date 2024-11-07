import { Box, Button, TextField, Typography } from "@mui/material";
import { validateEmail } from "../utils/validateEmail";
import { useSnackContext } from "../context/SnackContext";
import { deleteCodigoRecuperacionService, sendCodigoRecuperacionService, sendEmailRecuperacionService, updatePasswordService, verificarCodigoService } from "../services/usersServices";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { validatePassword } from "../utils/validatePassword";

export const RecuperarContrasena = () => {
    const { openSnack } = useSnackContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState(new Array(6).fill(""));
    const [codigoEnviado, setCodigoEnviado] = useState(false);
    const [codigoVerificado, setCodigoVerificado] = useState(false);
    const [passwordNew, setPasswordNew] = useState('');
    const inputRefs = useRef([]);

    const handleSaveNewPassword = (e) => {
        e.preventDefault();
        console.log('Guardar nueva contraseña', passwordNew);
        // Proceso de guardar nueva contraseña
        const passwordValid = validatePassword(passwordNew);
        if (!passwordValid) {
            alert('Contraseña no válida, formato: 8 a 20 caracteres, con al menos una letra mayúscula y un número');
            setPasswordNew('');
            return;
        }
        // Enviar a backend la nueva contraseña
        updatePasswordService(email, passwordNew).then(() => {
            // Mostrar mensaje de éxito
            openSnack('Contraseña guardada', 'success');
            navigate('/login');
        }).catch((error) => {
            console.error('Error al guardar la contraseña', error);
            openSnack('Error al guardar la contraseña', 'error');
        });
    }
    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Recuperar contraseña');
        const form = e.currentTarget;
        const email = form.email.value;

        if (email === '') {
            alert('El correo no se ingresó');
            return;
        }

        const validateMail = validateEmail(email);
        if (!validateMail) {
            alert('Correo no válido');
            return;
        }

        // Proceso de enviar a backend código de recuperación y email (se agrega en la base de datos y se eliminan los códigos anteriores)
        sendCodigoRecuperacionService(email).then(() => {
            console.log('Código de recuperación enviado');
            // Enviar email con código de recuperación
            return sendEmailRecuperacionService(email);
        }).then(() => {
            // Mostrar mensaje de éxito
            console.log('Correo de recuperación enviado');
            openSnack('Correo de recuperación enviado', 'success');
            setCodigoEnviado(true);
            setEmail(email);
        }).catch((error) => {
            console.error('Error al enviar el correo de recuperación', error);
            openSnack('Error al enviar el correo de recuperación', 'error');
        });
    }

    const handleVerificarCodigo = (e) => {
        e.preventDefault();
        const codigoCompleto = codigo.join("");
        console.log('Verificar código', codigoCompleto);
        if (codigoCompleto.length !== 6) {
            alert('El código no se ingresó completamente');
            return;
        }
        // Proceso de verificar código de recuperación
        verificarCodigoService(email, codigoCompleto).then(() => {
            console.log('Código de recuperación verificado');
            // Eliminar códigos de recuperación
            return deleteCodigoRecuperacionService(email);
        }).then(() => {
            // Mostrar mensaje de éxito
            console.log('Códigos de recuperación eliminados');
            openSnack('Códigos de recuperación eliminados', 'success');
            setCodigoVerificado(true);
        }).
            catch((error) => {
                //error 404 => Código incorrecto
                //error 500 => Error en el servidor
                console.error('Error al verificar el código de recuperación', error);
                const message = error.response?.status === 404 ? 'Código incorrecto' : 'Error al verificar el código de recuperación';
                openSnack(message, 'error');
            });
    }

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]?$/.test(value)) {
            const newCodigo = [...codigo];
            newCodigo[index] = value;
            setCodigo(newCodigo);
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && codigo[index] === "") {
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    }

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
            <Box sx={{ bgcolor: 'white', padding: '20px', borderRadius: '8px', boxShadow: 3, width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Recuperar Contraseña
                </Typography>
                {
                    codigoVerificado ?
                        <div>
                            <Typography variant="body1" gutterBottom>
                                Ingresa tu nueva contraseña (opcional)
                            </Typography>
                            <TextField margin="normal" required fullWidth id="password" label="Contraseña" name="password" type="password" autoComplete="password" autoFocus onChange={(e) => setPasswordNew(e.target.value)} />
                            <Button onClick={handleSaveNewPassword} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Guardar </Button>
                            <Button onClick={() => navigate('/')} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}> Ir a inicio </Button>
                        </div> :
                        <>
                            {codigoEnviado ?
                                <form onSubmit={handleVerificarCodigo} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    {codigo.map((value, index) => (
                                        <TextField
                                            key={index}
                                            value={value}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            inputRef={(el) => (inputRefs.current[index] = el)}
                                            margin="normal"
                                            required
                                            sx={{ width: '40px', margin: '0 5px' }}
                                            inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                                        />
                                    ))}
                                    <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, ml: 2 }}>
                                        Enviar
                                    </Button>
                                </form>
                                :
                                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                                    <TextField margin="normal" required fullWidth id="email" label="Ingresa tu email" name="email" autoComplete="email" autoFocus />
                                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                        Enviar
                                    </Button>
                                </form>
                            }
                        </>
                }
            </Box>
        </Box>
    );
};