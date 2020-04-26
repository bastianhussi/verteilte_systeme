import React from 'react';

const UserContext = React.createContext({
    user: undefined,
    changeUser: () => {},
    token: undefined,
    apiUrl: undefined,
    lectures: [],
    courses: [],
    rooms: [],
});
UserContext.displayName = 'UserContext';

export default UserContext;
