import axios from "axios";

export const getUniversidadesService = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACK_URL}universidades`);
    return res;
}