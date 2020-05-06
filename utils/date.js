// This file contains multiple helper-functions for parsing dates.
// These function are required by React components that need to perform
// parsing strings like 2020-04-20 into javascript date objects and otherwise.

/**
 * Checks if the date in the Javascript date object is today.
 * @param {Date} date - A Javascript date object.
 */
export function isToday(date) {
    return (
        date.getFullYear() === new Date().getFullYear() &&
        date.getMonth() === new Date().getMonth() &&
        date.getDate() === new Date().getDate()
    );
}

/**
 *
 * @param {Date} firstDay - A Javascript date object.
 * @param {Date} secondDay - A Javascript date object.
 */
export function isSameDay(firstDay, secondDay) {
    return (
        firstDay.getFullYear() === secondDay.getFullYear() &&
        firstDay.getMonth() === secondDay.getMonth() &&
        firstDay.getDate() === secondDay.getDate()
    );
}

/**
 *
 * @param {Date} day - A Javascript date object.
 */
export function getDayName(day) {
    const weekDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    return weekDays[day.getDay()];
}

/**
 *
 * @param {Date} month - A Javascript date object.
 */
export function getMonthDays(month) {
    const date = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return date.getDate();
}

/**
 * Returns a "HH:MM" (e.g. 12:15) string for a given Javascript date object.
 * @param {Date} date - A Javascript date object.
 */
export function getHHMMFromDate(date) {
    const [hours, minutes] = date.toTimeString().split(' ')[0].split(':');
    return `${hours}:${minutes}`;
}

/**
 * Returns a Javascript date object for the given date string (e.g. '12:15').
 * The reference date provide the other date properties (year, month, day).
 * @param {string} time - The time string.
 * @param {Date} date - The reference date.
 */
export function getDateFromHHMM(time, date) {
    const [hours, minutes] = time.split(':');
    const parsedDate = new Date(date);
    parsedDate.setHours(hours);
    parsedDate.setMinutes(minutes);
    parsedDate.setSeconds(0);
    parsedDate.setMilliseconds(0);
    return parsedDate;
}

/**
 * Returns a "YYYY-MM-DD" (e.g. 2020-04-20) string for a given Javascript date object.
 * @param {Date} date - A Javascript date object.
 */
export function getYYYYMMDDFromDate(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Returns a Javascript date object from the given date string (e.g. 2020-04-20).
 * Hours, minutes, seconds and milliseconds are set to zero.
 * @param {string} time - The time string.
 */
export function getDateFromYYYMMDD(time) {
    const [year, month, day] = time.split('-');
    const parsedDate = new Date();
    parsedDate.setFullYear(year);

    // month in js go from 0-11 (January: 0, December: 11)
    parsedDate.setMonth(month - 1);
    parsedDate.setDate(day);
    parsedDate.setHours(0);
    parsedDate.setMinutes(0);
    parsedDate.setSeconds(0);
    parsedDate.setMilliseconds(0);
    return parsedDate;
}
