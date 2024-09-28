import axios from "axios";

export const getEstudiantesSolicitudesDeTutor = async (idUsuario) => {
    const id_tutor = idUsuario;
    const res = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/tutorias/solicitudes/estudiantes`,{id_tutor});
    console.log("res:",res.data);
    return res.data;
}