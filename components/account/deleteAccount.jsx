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

        if (!confirm('Are you sure?\nAll your data will be lost.')) {
            return;
        }

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
            <div className={styles.item}>
                <form
                    onSubmit={this.submitDeleteForm}
                    className={styles.editForm}>
                    <div>
                        <h2>Permanently delete account?</h2>
                    </div>
                    <button type='submit' className={styles.deleteButton}>
                        Delete
                    </button>
                </form>
                <Message value={this.state.message} />
            </div>
        );
    }
}
