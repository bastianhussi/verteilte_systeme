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
        <a href="#home">Home</a>
        <a href="#news">Up next...</a>
        <div className={styles.dropdown} style={{ float: 'right' }}>
          <button className={styles.dropbtn}>{this.props.user.name}</button>
          <div className={styles.dropdownContent}>
            <Link href="/account"><a >Account</a></Link>
            <a href="#">Help</a>
            <a href="#" onClick={logout}>Logout</a>
          </div>
        </div>
      </div>
    );
  }
}
