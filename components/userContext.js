import React from 'react';

const UserContext = React.createContext({
    token: undefined,
    apiUrl: undefined,
    user: undefined,
    changeUser: () => {},
    courses: [],
    changeCourses: () => {},
    rooms: [],
    changeRooms: () => {},
    semesters: [],
    changeSemesters: () => {},
    lectures: [],
    changeLectures: () => {},
});
UserContext.displayName = 'UserContext';

export default UserContext;
