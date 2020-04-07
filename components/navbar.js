import React from 'react';
import Link from 'next/link';
import { logout } from '../utils/auth';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <ul>
          <li><Link href="/"><a>Overview</a></Link></li>
          <li><Link href="/"><a>Classes</a></Link></li>
          <li><Link href="/"><a>Up next...</a></Link></li>
          <li style={{ float: 'right' }}><a onClick={logout}>{this.props.user.email}</a></li>
        </ul>
        <style jsx>
          {`
                    ul {
                        list-style-type: none;
                        margin: 0;
                        padding: 0;
                        overflow: hidden;
                        background-color: #61dafb;
                    }

                    li {
                        float: left;
                    }

                    li:hover {
                        cursor: pointer;
                    }

                    li a {
                        display: block;
                        text-align: center;
                        padding: 14px 16px;
                        text-decoration: none;
                    }
                `}
        </style>
      </>
    );
  }
}

export default Navbar;
