import { Box, Button, Modal } from "@mui/material";

const ConfirmarEliminarTutoriaModal = ({ setOpenModalEliminar, handleEliminarTutoria }) => {
    return (
        <Modal
            open={true}
            onClose={() => setOpenModalEliminar(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
        >
            <Box sx={{ borderRadius: 5, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                    <h2>¿Estás seguro de eliminar esta tutoría?</h2>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                <Button onClick={() => setOpenModalEliminar(false)}>Cancelar</Button>
                    <Button onClick={handleEliminarTutoria}>Eliminar</Button>
                </Box>
            </Box>
        </Modal>
    );
}
export default ConfirmarEliminarTutoriaModal;