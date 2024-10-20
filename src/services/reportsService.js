import axios from "axios";

export const getReportesService = async (keyword,page) => {
    const res = await axios.get(`${import.meta.env.VITE_BACK_URL}reportes?keyword=${keyword}&page=${page}&limit=9`);
    return res;
}