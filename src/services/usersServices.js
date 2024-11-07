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
export const sendCodigoRecuperacionService = async (email) => {
    if (!email) {
        return;
    }
    const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/sendcodigorecuperacion`, { email });
    return response;
}
export const sendEmailRecuperacionService = async (email) => {
    if (!email) {
        return;
    }
    const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/sendemailrecuperacion`, { email });
    return response;
}
export const verificarCodigoService = async (email, codigoRecuperacion) => {
    if (!email || !codigoRecuperacion) {
        return;
    }
    const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/verificarcodigo`, { email, codigoRecuperacion });
    return response;
}
export const deleteCodigoRecuperacionService = async (email) => {
    if (!email) {
        return;
    }
    const response = await axios.post(`${import.meta.env.VITE_BACK_URL}usuario/deletecodigorecuperacion`, { email });
    return response;
}
export const updatePasswordService = async (email, password) => {
    if (!email || !password) {
        //retornar error de que no existe el email o la contraseña
        return Promise.reject("No existe el email o la contraseña");
    }
    console.log("updatePasswordService:", email, password);
    const response = await axios.put(`${import.meta.env.VITE_BACK_URL}usuario/update/password`, { email, password });
    return response;
}
export const logoutService = async () => {
    const response = await axios.post(`${import.meta.env.VITE_BACK_URL}auth/logout`);
    return response;
}