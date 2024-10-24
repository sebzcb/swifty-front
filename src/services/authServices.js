import axios from "axios";

export const registerUserService = async (usuario) => {
    const response = await axios.post(`${import.meta.env.VITE_BACK_URL}auth/registro`, usuario);
    return response;
}