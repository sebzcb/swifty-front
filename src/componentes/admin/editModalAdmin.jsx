import { Box, Button, Select, Typography } from "@mui/material";
import CustomModal from "../../utils/Modal";
import { useSnackContext } from "../../context/SnackContext";
import { ROL } from "../../constants/rol";
import { useState } from "react";
import { getUserService, updateUserRolService } from "../../services/usersServices";
import { sendEmail } from "../../utils/sendEmail";

const EditModalAdmin = ({ open, setOpen,username,id,rol,renderFunction}) => {
    const {openSnack } = useSnackContext();
    const [rolUpdate, setRolUpdate] = useState(rol);
    const sendEmailUserEdited = async () => {
        getUserService(id).then((res) => {
            console.log('Usuario encontrado', res);
            const user = res.data;
            console.log('Usuario encontrado', user);
            const email = user.correo;
            const nombre = user.nombre;
            console.log('email:', email);
            const subject = 'Actualización de rol';
            let message = `Hola ${nombre}, tu rol ha sido actualizado a ${rolUpdate}\n\n`;
            if(rolUpdate == ROL.TUTOR){
                message += 'Ahora puedes gestionar tus asignaturas impartidas desde "Editar perfil" y gestionar tus tutorías';
            }
            console.log('message:', message);
            sendEmail(email, subject, message);
        }).catch((error) => {
            console.error('Error al buscar el usuario', error);
        });
    }
    const handleEdit = () => {
        console.log('editar usuario id:',id);
        console.log('rol:',rolUpdate);
        updateUserRolService(id,rolUpdate).then((res) => {
            console.log('Usuario editado correctamente', res);
            openSnack('Usuario editado correctamente', 'success');
            renderFunction();
            sendEmailUserEdited(); // Ejecutar el envío de correo después de editar el usuario
        }).catch((error) => {
            console.error('Error al editar el usuario', error);
            openSnack('Error al editar el usuario', 'error');
        });
    }
    const roles = Object.values(ROL);
    return (
        <>
            <CustomModal
                open={open}
                title="Editar usuario"
                actions={{
                    onCancel: () => setOpen(false),
                    onSave: () => {
                        console.log('Guardar');
                        handleEdit();
                        setOpen(false);
                    },
                }}
            >
                <div>
                    <p>Editar usuario {username} ID:{id} </p>
                </div>
                <Box>
                    <Typography> Editar Rol </Typography>
                    <Select
                        native
                        value={rolUpdate}
                        onChange={(e) => setRolUpdate(e.target.value)}
                    >
                        {
                            roles.map((rol) => (
                                <option key={rol} value={rol}>{rol}</option>
                            ))
                        }
                    </Select>
                </Box>
            </CustomModal>
        </>
    )
};
export default EditModalAdmin;