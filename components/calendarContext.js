import React from 'react';

const CalendarContext = React.createContext({
    selectedDate: new Date(),
});

export default CalendarContext;
