import React from "react";

/**
 * The AppContext will store information about the user,
 * a function that will change the user (changeUser), the api token (token)
 * and the current api url (apiUrl).
 * This information will be provided by the Index Component (pages/index.jsx).
 */
const AppContext = React.createContext();
AppContext.displayName = "AppContext";

export default AppContext;
