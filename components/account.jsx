import React from 'react';
import axios from 'axios';
import AppContext from './appContext';

export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
            message: '',
        };

        this.changeEmail = this.changeEmail.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.submitEmailForm = this.submitEmailForm.bind(this);
        this.submitNameForm = this.submitNameForm.bind(this);
        this.submitPasswordForm = this.submitPasswordForm.bind(this);
    }

    componentDidMount() {
        this.setState({ user: this.context.user });
    }

    changeEmail(event) {
        this.setState({ email: event.target.value });
    }

    changeName(event) {
        this.setState({ name: event.target.value });
    }

    changePassword(event) {
        this.setState({ password: event.target.value });
    }

    /**
     * 
     * @param {*} event 
     */
    async submitEmailForm(event) {
        event.preventDefault();

        const { user, changeUser, apiUrl, token } = this.context;

        if (this.state.email === user.email) {
            this.setState({ message: 'choosen email is the same as current email!', email: '' });
            return;
        }
        this.setState({ message: '' });
        try {
            const res = await axios.patch(`${apiUrl}/users/${user._id}`, {
                email: this.state.email,
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
            });
            changeUser(res.data);
        } catch (err) {
            this.setState({ message: err.response.data });
        }
        this.setState({ email: '' });
    }

    /**
     * 
     * @param {*} event 
     */
    async submitNameForm(event) {
        event.preventDefault();

        const { user, changeUser, apiUrl, token } = this.context;

        if (this.state.name === user.name) {
            this.setState({ message: 'choosen name is the same as current name!', name: '' });
            return;
        }
        this.setState({ message: '' });
        try {
            const res = await axios.patch(`${apiUrl}/users/${user._id}`, {
                name: this.state.name,
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
            });
            changeUser(res.data);
        } catch (err) {
            this.setState({ message: err.response.data });
        }
        this.setState({ name: '' });
    }

    /**
     * 
     * @param {*} event 
     */
    async submitPasswordForm(event) {
        event.preventDefault();

        const { user, changeUser, apiUrl, token } = this.context;

        if (this.state.password === user.password) {
            this.setState({ message: 'choosen password is the same as current password!', password: '' });
            return;
        }
        this.setState({ message: '' });
        try {
            const res = await axios.patch(`${apiUrl}/users/${user._id}`, {
                password: this.state.password,
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
            });
            changeUser(res.data);
        } catch (err) {
            this.setState({ message: err.response.data });
        }
        this.setState({ password: '' });
    }

    render() {
        return (
            <AppContext.Consumer>{
                ({ user }) => (
                    <>
                        <div>{this.state.message ? (<p>{this.state.message}</p>) : (<></>)}</div>
                        <div>
                            <p>Id: {user._id}</p>
                            <p>Email: {user.email}</p>
                            <p>Name: {user.name}</p>
                            <p>Password: {user.password}</p>
                        </div>
                        <div>
                            <form onSubmit={this.submitEmailForm}>
                                <label>
                                    Email
                            <br />
                                    <input type="email" value={this.state.email} onChange={this.changeEmail} required />
                                </label>
                                <button type="submit">Change email</button>
                            </form>
                        </div>
                        <div>
                            <form onSubmit={this.submitNameForm}>
                                <label>
                                    Name
                            <br />
                                    <input type="text" value={this.state.name} onChange={this.changeName} required />
                                </label>
                                <button type="submit">Change name</button>
                            </form>
                        </div>
                        <div>
                            <form onSubmit={this.submitPasswordForm}>
                                <label>
                                    Password
                            <br />
                                    <input type="password" value={this.state.password} onChange={this.changePassword} required />
                                </label>
                                <button type="submit">Change password</button>
                            </form>
                        </div>
                    </>
                )
            }</AppContext.Consumer>
        );
    }
}

Account.contextType = AppContext;
