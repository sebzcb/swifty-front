import axios from "axios";
import { ROL } from "../constants/rol";
export const getUserService = async (idUsuario) => {
    console.log("getuserservice:", idUsuario);
    if (!idUsuario) {
        return;
    }
    console.log("getuserservice:", `${import.meta.env.VITE_BACK_URL}usuario/${idUsuario}`);
    const response = await axios.get(`${import.meta.env.VITE_BACK_URL}usuario/${idUsuario}`);
    return response;
}
export const getUsersService = async (keyword, page, order, direction, filters,typeUser=ROL.TUTOR) => {
    const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/lista/usuarios?keyword=${keyword}&page=${page}&limit=9&orderBy=${order}&direction=${direction}`, {
        filters: filters,
        typeUser:typeUser
    });
    return response;
}
export const deleteUserService = async (id) => {
    if (!id) {
        return;
    }
    const response = await axios.delete(`${import.meta.env.VITE_BACK_URL}usuario/delete/${id}`);
    return response;
}
export const updateUserRolService = async (id, rol) => {
    if (!id) {
        return;
    }
    const response = await axios.put(`${import.meta.env.VITE_BACK_URL}usuario/update/rol`, { id, rol });
    return response;
}