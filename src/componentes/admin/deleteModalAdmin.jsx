import { Button } from "@mui/material";
import CustomModal from "../../utils/Modal";
import { useSnackContext } from "../../context/SnackContext";
import { deleteUserService, getUserService } from "../../services/usersServices";
import { sendEmail } from "../../utils/sendEmail";

const DeleteModalUserAdmin = ({ open, setOpen,username,id,renderFunction }) => {
    const {openSnack } = useSnackContext();
    const sendEmailUserDeleted = async (user) => {
        const email = user.correo;
        const nombre = user.nombre;
        const subject = 'Eliminación de usuario';
        const message = `Hola ${nombre}, tu usuario ha sido eliminado`;
        console.log('message:', message);
        sendEmail(email, subject, message);
    }
    
    const handleDeleteUser = () => {
        console.log('Eliminar usuario id:', id);
        getUserService(id).then((res) => {
            console.log('Usuario encontrado', res);
            const user = res.data;
            deleteUserService(id).then((res) => {
                console.log('Usuario eliminado correctamente', res);
                openSnack('Usuario eliminado correctamente', 'success');
                setOpen(false);
                renderFunction();
                sendEmailUserDeleted(user); // Ejecutar el envío de correo después de eliminar el usuario
            }).catch((error) => {
                console.error('Error al eliminar el usuario', error);
                openSnack('Error al eliminar el usuario', 'error');
            });
        }).catch((error) => {
            console.error('Error al buscar el usuario', error);
        });
    }
    /*
    const sendEmailUserDeleted = async () => {
        getUserService(id).then((res) => {
            console.log('Usuario encontrado', res);
            const user = res.data;
            console.log('Usuario encontrado', user);
            const email = user.correo;
            const nombre = user.nombre;
            console.log('email:', email);
            const subject = 'Eliminación de usuario';
            const message = `Hola ${nombre}, tu usuario ha sido eliminado`;
            console.log('message:', message);
            sendEmail(email, subject, message);
        }).catch((error) => {
            console.error('Error al buscar el usuario', error);
        });
    }
    const handleDeleteUser = () => {
        console.log('Eliminar usuario id:',id);
        deleteUserService(id).then((res) => {
            console.log('Usuario eliminado correctamente', res);
            openSnack('Usuario eliminado correctamente', 'success');
            setOpen(false);
            renderFunction();
            sendEmailUserDeleted(); // Ejecutar el envío de correo después de eliminar el usuario
        }).catch((error) => {
            console.error('Error al eliminar el usuario', error);
            openSnack('Error al eliminar el usuario', 'error');
        });
    }*/
    return (
        <>
            <CustomModal
                open={open}
                title="Eliminar usuario"
                actions={{
                    onCancel: () => setOpen(false),
                    onSave: () => {
                        console.log('Guardar');
                        setOpen(false);
                    },
                    buttons: (
                        <>
                            <Button
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleDeleteUser}
                            >
                                Eliminar
                            </Button>
                        </>
                    )
                }}
            >
                <div>
                    <p>¿Está seguro que desea eliminar el usuario {username}? ID:{id} </p>
                </div>
            </CustomModal>
        </>
    )
};
export default DeleteModalUserAdmin;