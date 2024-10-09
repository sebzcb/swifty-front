import axios from "axios";
import { ROL } from "../constants/rol";

export const getUsersService = async (keyword, page, order, direction, filters,typeUser=ROL.TUTOR) => {
    const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/lista/usuarios?keyword=${keyword}&page=${page}&limit=9&orderBy=${order}&direction=${direction}`, {
        filters: filters,
        typeUser:typeUser
    });
    return response;
}