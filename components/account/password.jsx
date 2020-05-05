import React from 'react';
import axios from 'axios';
import UserContext from '../userContext';
import Message from '../message';
import styles from '../account.module.css';

export default class Password extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            oldPassword: '',
            newPassword: '',
            showPassword: false,
        };

        this.changeOldPassword = this.changeOldPassword.bind(this);
        this.changeNewPassword = this.changeNewPassword.bind(this);
        this.changeShowPassword = this.changeShowPassword.bind(this);
        this.submitPasswordForm = this.submitPasswordForm.bind(this);
    }

    changeOldPassword(event) {
        this.setState({ oldPassword: event.target.value });
    }

    changeNewPassword(event) {
        this.setState({ newPassword: event.target.value });
    }

    changeShowPassword() {
        this.setState({ showPassword: !this.state.showPassword });
    }

    async submitPasswordForm(event) {
        event.preventDefault();

        const { user, changeUser, apiUrl, token } = this.context;
        this.setState({ message: '' });
        try {
            const res = await axios.patch(
                `${apiUrl}/users/${user._id}`,
                {
                    newPassword: this.state.newPassword,
                    oldPassword: this.state.oldPassword,
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
            <div className={styles.item}>
                <form
                    onSubmit={this.submitPasswordForm}
                    className={styles.editForm}>
                    <div>
                        <label>
                            Old password:
                            <input
                                type={
                                    this.state.showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                value={this.state.oldPassword}
                                onChange={this.changeOldPassword}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            New password:
                            <input
                                type={
                                    this.state.showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                value={this.state.newPassword}
                                onChange={this.changeNewPassword}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type='checkbox'
                                defaultChecked={this.state.showPassword}
                                onClick={this.changeShowPassword}
                            />
                            Show password
                        </label>
                    </div>
                    <div>
                        <button type='reset'>Cancel</button>
                        <button type='submit' className={styles.saveButton}>
                            Save
                        </button>
                    </div>
                </form>
                <Message value={this.state.message} />
            </div>
        );
    }
}
