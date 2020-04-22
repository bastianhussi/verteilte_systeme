import React from "react";
import { logout } from "../utils/auth";
import styles from "./navbar.module.css";
import Calendar from "./calendar";
import AdminPanel from "./adminPanel";
import Account from "./account";
import AppContext from "./appContext";
import MyCourses from "./myCourses";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  static contextType = AppContext;

  render() {
    const { user } = this.context;
    const { changeView } = this.props;
    return (
      <div className={styles.navbar}>
        <a onClick={() => changeView(<Calendar />)}>Home</a>
        <a>Up next...</a>
        {user.admin ? (
          <a onClick={() => changeView(<AdminPanel />)}>Admin</a>
        ) : (
          <></>
        )}
        <a onClick={() => changeView(<MyCourses />)}>My Courses</a>
        <div className={styles.dropdown} style={{ float: "right" }}>
          <div className={styles.dropbtn}>{user.name}</div>
          <div className={styles.dropdownContent}>
            <a onClick={() => changeView(<Account />)}>Account</a>
            <a href="#help">Help</a>
            <a onClick={logout}>Logout</a>
          </div>
        </div>
      </div>
    );
  }
}
