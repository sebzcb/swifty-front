import axios from "axios";

export const sendEmail = async (to, subject, text) => {
    console.log("enviando correo...");
    const res = await axios.post(`${import.meta.env.VITE_BACK_URL}send-email`, { to, subject, text });
    console.log(res.data);
    return res.data;
}