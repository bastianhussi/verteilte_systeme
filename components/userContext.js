import React from 'react';

/**
 * This context contains all the basic informations to run the app
 * and the user information.
 * Token and apiUrl are needed to make api request with axios.
 * For each attribute of the user there has to be a function the change it.
 * For more information on Context see: https://reactjs.org/docs/context.html
 */
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
