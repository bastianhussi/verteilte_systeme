import React from 'react';

/**
 * This context contains all the information needed to work with the
 * calendar (month and week view). It contains the selected date and semester.
 * Also methods to change them and a method to display the form for creating
 * and editing lectures.
 * For more information on Context see: https://reactjs.org/docs/context.html
 */
const CalendarContext = React.createContext({
    selectedDate: undefined,
    changeDate: () => {},
    selectedSemester: undefined,
    selectedLecture: undefined,
    changeLecture: () => {},
    changeView: () => {},
    showForm: () => {},
});
CalendarContext.displayName = 'CalendarContext';

export default CalendarContext;
