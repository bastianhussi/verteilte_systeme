import React from 'react';
import { logout } from '../utils/auth';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        return (
            <>
                <button onClick={logout}>Logout</button>
            </>
        );
    }
}

export default Navbar;