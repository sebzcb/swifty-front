import { Box, Button, Modal, Typography } from "@mui/material";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 4,
    pr:4,
    pl:4,
    borderRadius: 4,
};
const ConfirmarEliminarTutoriaModal = ({ setOpenModalEliminar, handleEliminarTutoria }) => {
    return (
        <Modal
            open={true}
            onClose={() => setOpenModalEliminar(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Box sx={{ ...style }}>
                <Typography id="modal-title" variant="h6" component="h2">
                    ¿Estás seguro de que deseas eliminar esta tutoría?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                    <Button onClick={() => setOpenModalEliminar(false)}>Cancelar</Button>
                    <Button onClick={handleEliminarTutoria}>Eliminar</Button>
                </Box>
            </Box>
        </Modal>
    );
}
export default ConfirmarEliminarTutoriaModal;