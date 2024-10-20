/*
Fecha getWeekNumber: Thu Oct 10 2024 12:47:00 GMT-0300 (hora de verano de Chile)
*/
export const getWeekNumber = (date) => {
    console.log('Fecha getWeekNumber:', date);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    console.log('Número de semana:', weekNumber);
    return weekNumber;
};