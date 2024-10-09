import axios from "axios";

export const getAsignaturasService = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACK_URL}asignaturas`);
    return res;
}
export const addAsignaturasImpartirService = async (id_tutor, codigo_asignatura,id_universidad,precio,nombre) => {
    const res = await axios.post(`${import.meta.env.VITE_BACK_URL}asignaturas/impartir`, {id_tutor, codigo_asignatura,id_universidad,precio,nombre});
    return res;
}

export const getAsignaturasImpartidasPorTutorService = async (id_tutor) => {
    console.log("ID_TUTOR:", id_tutor);
    const res = await axios.get(`${import.meta.env.VITE_BACK_URL}asignaturas/impartir/${id_tutor}`);
    return res;
}
export const editAsignaturasImpartirService = async (codigo_asignatura,id_tutor, precio) => {
    const res = await axios.put(`${import.meta.env.VITE_BACK_URL}asignaturas/impartir`,
         {codigo_asignatura,id_tutor, precio});
    return res;
}
export const deleteAsignaturasImpartirService = async (codigo_asignatura,id_tutor) => {
    const res = await axios.delete(`${import.meta.env.VITE_BACK_URL}asignaturas/impartir/${codigo_asignatura}/${id_tutor}`);
    return res;
}