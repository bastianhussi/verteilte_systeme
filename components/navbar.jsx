import React from 'react';
import Link from 'next/link';
import { logout } from '../utils/auth';
import styles from './navbar.module.css';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.navbar}>
        <Link href="/"><a>Home</a></Link>
        <a href="#next">Up next...</a>
        {this.props.user.admin ? (<a href="#">Admin</a>) : (<></>)}
        <div className={styles.dropdown} style={{ float: 'right' }}>
          <button className={styles.dropbtn}>{this.props.user.name}</button>
          <div className={styles.dropdownContent}>
            <Link href="/account"><a >Account</a></Link>
            <a href="#help">Help</a>
            <a onClick={logout}>Logout</a>
          </div>
        </div>
      </div>
    );
  }
}
