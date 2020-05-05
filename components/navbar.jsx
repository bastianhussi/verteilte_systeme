import React from 'react';
import UserContext from './userContext';
import Calendar from './calendar';
import UpNext from './upNext';
import AdminPanel from './adminPanel';
import Account from './account';
import { logout } from '../utils/auth';
import styles from './navbar.module.css';

/**
 * This component will always be shown at the top of the index component.
 * The changeView function given in the props is beeing called on each entry
 * of this navbar to change the view below.
 */
export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = UserContext;

    render() {
        const { changeView } = this.props;
        return (
            // Consuming the UserContext to display his name in the right corner.
            <UserContext.Consumer>
                {({ user }) => (
                    <div className={styles.navbar}>
                        <a onClick={() => changeView(<Calendar />)}>Home</a>
                        <a onClick={() => changeView(<UpNext />)}>Up next</a>
                        {user.admin ? (
                            <a onClick={() => changeView(<AdminPanel />)}>
                                Admin
                            </a>
                        ) : (
                            // only display this entrie if the user is an admin.
                            <></>
                        )}
                        <div
                            className={styles.dropdown}
                            style={{ float: 'right' }}>
                            <div className={styles.dropbtn}>{user.name}</div>
                            <div className={styles.dropdownContent}>
                                <a onClick={() => changeView(<Account />)}>
                                    Account
                                </a>
                                <a onClick={logout}>Logout</a>
                            </div>
                        </div>
                    </div>
                )}
            </UserContext.Consumer>
        );
    }
}
