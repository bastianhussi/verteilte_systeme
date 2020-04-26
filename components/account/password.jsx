import React from 'react';
import axios from 'axios';
import UserContext from '../userContext';
import Message from '../message';
import styles from './email.module.css';

export default class Password extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            password: '',
            showPassword: false,
        };

        this.changePassword = this.changePassword.bind(this);
        this.changeShowPassword = this.changeShowPassword.bind(this);
        this.submitPasswordForm = this.submitPasswordForm.bind(this);
    }

    changePassword(event) {
        this.setState({ password: event.target.value });
    }

    changeShowPassword() {
        this.setState({ showPassword: !this.state.showPassword });
    }

    async submitPasswordForm(event) {
        event.preventDefault();

        const { user, changeUser, apiUrl, token } = this.context;

        if (this.state.password === user.password) {
            this.setState({
                message: 'Please choose a new password',
                password: '',
            });
            return;
        }
        this.setState({ message: '' });
        try {
            const res = await axios.patch(
                `${apiUrl}/users/${user._id}`,
                {
                    password: this.state.password,
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
        this.setState({ password: '' });
    }

    static contextType = UserContext;

    render() {
        return (
            <>
                <form onSubmit={this.submitPasswordForm}>
                    <label>
                        New password:
                        <input
                            type={this.state.showPassword ? 'text' : 'password'}
                            value={this.state.password}
                            onChange={this.changePassword}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        <input
                            type='checkbox'
                            defaultChecked={this.state.showPassword}
                            onClick={this.changeShowPassword}
                        />
                        Show password
                    </label>
                    <button type='submit'>Change</button>
                </form>
                <Message value={this.state.message} />
            </>
        );
    }
}
