import React from 'react';
import axios from 'axios';
import styles from './email.module.css';
import AppContext from '../appContext';
import Message from '../message';

export default class Email extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            email: '',
        };

        this.changeEmail = this.changeEmail.bind(this);
        this.submitEmailForm = this.submitEmailForm.bind(this);
    }

    changeEmail(event) {
        this.setState({ email: event.target.value });
    }

    async submitEmailForm(event) {
        event.preventDefault();

        const { user, changeUser, apiUrl, token } = this.context;

        if (this.state.email === user.email) {
            this.setState({ message: 'Please choose a new email!', email: '' });
            return;
        }
        this.setState({ message: '' });
        try {
            const res = await axios.patch(
                `${apiUrl}/users/${user._id}`,
                {
                    email: this.state.email,
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            changeUser(res.data);
        } catch (err) {
            this.setState({ message: err.response.data });
        }
        this.setState({ email: '' });
    }

    static contextType = AppContext;

    render() {
        return (
            <AppContext.Consumer>
                {({ user }) => (
                    <>
                        <p>
                            Current email: <strong>{user.email}</strong>
                        </p>
                        <form onSubmit={this.submitEmailForm}>
                            <label>
                                New email:
                                <input
                                    type='email'
                                    value={this.state.email}
                                    onChange={this.changeEmail}
                                    required
                                />
                            </label>
                            <button type='submit'>Change</button>
                        </form>
                        <Message value={this.state.message} />
                    </>
                )}
            </AppContext.Consumer>
        );
    }
}
