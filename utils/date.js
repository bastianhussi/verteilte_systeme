export function getHHMMFromDate(date) {
    const [hours, minutes] = date.toTimeString().split(' ')[0].split(':');
    return `${hours}:${minutes}`;
}

export function getDateFromHHMM(time, date) {
    const [hours, minutes] = time.split(':');
    const parsedDate = new Date(date);
    parsedDate.setHours(hours);
    parsedDate.setMinutes(minutes);
    parsedDate.setSeconds(0);
    parsedDate.setMilliseconds(0);
    return parsedDate;
}

export function getYYYYMMDDFromDate(date) {
    return date.toISOString().split('T')[0];
}

export function getDateFromYYYMMDD(time) {
    const [year, month, day] = time.split('-');
    const parsedDate = new Date();
    parsedDate.setFullYear(year);
    parsedDate.setMonth(month);
    parsedDate.setDate(day);
    parsedDate.setHours(0);
    parsedDate.setMinutes(0);
    parsedDate.setSeconds(0);
    parsedDate.setMilliseconds(0);
    return parsedDate;
}
