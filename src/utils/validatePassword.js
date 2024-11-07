/*
Contraseña: la contraseña debe tener de 8 a 20 caracteres, con al menos una letra mayúscula y un
número. Campo obligatorio.
*/
export const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[0-9]).{8,20}$/;
    return regex.test(password);
}