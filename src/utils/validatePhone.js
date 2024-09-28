//telefono formato: +56911111111
//los 3 primeros digitos deben ser 569
//los siguientes 8 digitos deben ser numeros
//largo total 11
//56975411111
export const validatePhone = (number) => {
    const regex = /^569[0-9]{8}$/;
    return regex.test(number);
}