import React from 'react';
import Link from 'next/link';
import { logout } from '../utils/auth';
import styles from './navbar.module.css';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    }
  }

  render() {
    return (
      <>
        <ul className={styles.navbar}>
          <li className={styles.navbarItem}><Link href="/"><a>Overview</a></Link></li>
          <li className={styles.navbarItem}><Link href="/"><a>Classes</a></Link></li>
          <li className={styles.navbarItem}><Link href="/"><a>Up next...</a></Link></li>

          <li className={styles.navbarItem} style={{ float: 'right' }}>
            <a onMouseOver={() => this.setState({ showMenu: !this.state.showMenu })}>
              {this.props.user.name}
            </a>
          </li>
        </ul>
        {this.state.showMenu ? (<Menu />) : (<></>)}
      </>
    );
  }
}

function Menu(props) {
  return (
    <div>
      <ul className={styles.menu}>
        <li className={styles.menuItem}><Link href="/account"><a>Settings</a></Link></li>
        <li className={styles.menuItem}><a href="#" onClick={logout}>Logout</a></li>
      </ul>
    </div>
  );
}
