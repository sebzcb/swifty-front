import axios from "axios";

export const getAsignaturasService = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACK_URL}asignaturas`);
    return res;
}
