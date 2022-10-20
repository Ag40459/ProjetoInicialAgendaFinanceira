export function currentDateFormatted(selectDate) {
    let data = new Date(selectDate),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(),
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}

export function dayWeek(dateFull) {
    const dateModified = currentDateFormatted(dateFull);
    const dateModified2 = new Date(dateModified);
    const numberDay = dateModified2.getDay();
    if (numberDay === 0) { return 'Domingo' }
    if (numberDay === 1) { return 'Segunda' }
    if (numberDay === 2) { return 'Terça' }
    if (numberDay === 3) { return 'Quarta' }
    if (numberDay === 4) { return 'Quinta' }
    if (numberDay === 5) { return 'Sexta' }
    else {
        return 'Sábado'
    }
}