import axios from "axios";
import { useEffect, useState } from "react";
import { TextField, Select, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box } from "@mui/material";
import { validatePhone } from "../utils/validatePhone";

const EditarPerfilModal = ({ open, setOpen, id_usuario,renderFunction }) => {
    const [universidades, setUniversidades] = useState([]);
    const [usuario, setUsuario] = useState(null);

    const loadData = async () => {
        try {
            console.log("LOAD DATA de id:",id_usuario)
            const res = await axios.get(`${import.meta.env.VITE_BACK_URL}usuario/${id_usuario}`);
            console.log("RES:", res.data)
            setUsuario(res.data);
        } catch (error) {
            console.error('Error al cargar los datos del usuario:', error);
        }
    }

    const loadUniversidades = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACK_URL}universidades`);
            setUniversidades(res.data);
        } catch (error) {
            console.error('Error al cargar universidades:', error);
        }
    };

    useEffect(() => {
        loadUniversidades();
        console.log("ID USUARIO:", id_usuario)
        loadData();
    }, []);

    const handleInputChange = (event) => {
        setUsuario({
            ...usuario,
            [event.target.name]: event.target.value
        });
    }
    const handleSubmit = async () => {
        //check data
        if(!usuario) return;
        const telephone = usuario.telefono;
        const validatePhoneCheck = validatePhone(telephone);
        console.log("TELEFONO:", telephone);
        if (!validatePhoneCheck) {
            alert("El teléfono debe tener el formato +56912345678");
            return;
        }
        try {
            const res = await axios.put(`${import.meta.env.VITE_BACK_URL}usuario/update`, usuario);
            console.log("RES:", res.data);
            setOpen(false);
            renderFunction();
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    }

    if (!usuario) return null;

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogContent>
                <Box marginBottom={2}>
                    <TextField name="descripcion" label="Descripción" value={usuario.descripcion} onChange={handleInputChange} fullWidth />
                </Box>
                <Box marginBottom={2}>
                    <Select name="genero" value={usuario.genero} onChange={handleInputChange} fullWidth>
                        <MenuItem value="Masculino">Masculino</MenuItem>
                        <MenuItem value="Femenino">Femenino</MenuItem>
                    </Select>
                </Box>
                <Box marginBottom={2}>
                    <TextField name="telefono" label="Teléfono" value={usuario.telefono} onChange={handleInputChange} fullWidth />
                </Box>
                <Box marginBottom={2}>
                    <Select name="id_universidad" value={usuario.id_universidad} onChange={handleInputChange} fullWidth>
                        {universidades.map((universidad) => (
                            <MenuItem key={universidad.id} value={universidad.id}>{universidad.nombre}</MenuItem>
                        ))}
                    </Select>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={handleSubmit}>Guardar cambios</Button>
            </DialogActions>
        </Dialog>
    )
};

export default EditarPerfilModal;
