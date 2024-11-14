import axios from "axios";
export const getClavesService = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACK_URL}horario/claves`);
    return response;
}