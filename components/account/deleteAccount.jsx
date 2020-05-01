import React from 'react';
import axios from 'axios';
import UserContext from '../userContext';
import { logout } from '../../utils/auth';
import Message from '../message';
import styles from '../account.module.css';

export default class DeleteAccount extends React.Component {
    constructor(props) {
        super(props);
        this.submitDeleteForm = this.submitDeleteForm.bind(this);
        this.state = {
            message: '',
        };
    }

    static contextType = UserContext;

    async submitDeleteForm(event) {
        event.preventDefault();

        const { user, apiUrl, token } = this.context;

        this.setState({ message: '' });
        try {
            await axios.delete(`${apiUrl}/users/${user._id}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            });
            logout();
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <form onSubmit={this.submitDeleteForm}>
                    <label>
                        Delete Account:
                        <button type='submit'>Delete</button>
                    </label>
                </form>
                <Message value={this.state.message} />
            </>
        );
    }
}
