import React from 'react';
import UserContext from './userContext';
import Calendar from './calendar';
import UpNext from './upNext';
import MyCourses from './myCourses';
import AdminPanel from './adminPanel';
import Account from './account';
import { logout } from '../utils/auth';
import styles from './navbar.module.css';

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = UserContext;

    render() {
        const { changeView } = this.props;
        return (
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
                            <></>
                        )}
                        <a onClick={() => changeView(<MyCourses />)}>
                            My Courses
                        </a>
                        <div
                            className={styles.dropdown}
                            style={{ float: 'right' }}>
                            <div className={styles.dropbtn}>{user.name}</div>
                            <div className={styles.dropdownContent}>
                                <a onClick={() => changeView(<Account />)}>
                                    Account
                                </a>
                                <a href='#help'>Help</a>
                                <a onClick={logout}>Logout</a>
                            </div>
                        </div>
                    </div>
                )}
            </UserContext.Consumer>
        );
    }
}
