/*
Semana actual: 41
Número de semanas a generar: 100
*/
export const getFutureWeeks = (currentWeek, numberOfWeeks) => {
    console.log('Semana actual:', currentWeek);
    console.log('Número de semanas a generar:', numberOfWeeks);
    const weeks = [];
    let year = new Date().getFullYear();
    let week = currentWeek;

    for (let i = 0; i < numberOfWeeks; i++) {
        weeks.push(`Semana ${week} (${year})`);
        week++;
        if (week > 52) { // Asumiendo que hay 52 semanas en un año
            week = 1;
            year++;
        }
    }
    return weeks;
};