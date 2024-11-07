import axios from "axios";

export const getReportesService = async (keyword,page,states) => {
    //states es un array de strings que contiene los estados de los reportes que se quieren obtener
    console.log("estados:",states);
    const res = await axios.get(`${import.meta.env.VITE_BACK_URL}reportes?keyword=${keyword}&page=${page}&limit=9&states=${states}`);
    return res;
}
export const editReporteService = async (id,estado) => {
    const res = await axios.put(`${import.meta.env.VITE_BACK_URL}reportes/update`,{id,estado});
    return res;
}