import React from 'react';
import { auth } from '../utils/auth';
import Head from 'next/head';
import Navbar from '../components/navbar';
import axios from 'axios';

export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
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

    /**
     * 
     * @param {*} ctx 
     */
    static async getInitialProps(ctx) {
        // destructuring the properties user and token immediately would cause an TypeError, if authentication fails.
        const res = await auth(ctx);
        const { user, token } = res;
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const apiUrl = process.browser ? `${protocol}://${window.location.host}/api/users/${user._id}` : `${protocol}://${ctx.req.headers.host}/api/users/${user._id}`;
        return { user, token, apiUrl };
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
        if (this.state.email === this.state.user.email) {
            this.setState({ message: 'choosen email is the same as current email!', email: '' });
            return;
        }
        this.setState({ message: '' });
        try {
            const res = await axios.patch(this.props.apiUrl, {
                email: this.state.email,
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${this.props.token}`
                },
            });
            this.setState({ user: res });
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
        if (this.state.name === this.state.user.name) {
            this.setState({ message: 'choosen name is the same as current name!', name: '' });
            return;
        }
        this.setState({ message: '' });
        try {
            const res = await axios.patch(this.props.apiUrl, {
                name: this.state.name,
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${this.props.token}`
                },
            });
            this.setState({ user: res.data });
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
        if (this.state.password === this.state.user.password) {
            this.setState({ message: 'choosen password is the same as current password!', password: '' });
            return;
        }
        this.setState({ message: '' });
        try {
            const res = await axios.patch(this.props.apiUrl, {
                password: this.state.password,
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${this.props.token}`
                },
            });
            this.setState({ user: res });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
        this.setState({ password: '' });
    }

    render() {
        return (
            <>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Account - {this.state.user.name}</title>
                </Head>
                <Navbar user={this.state.user} />
                <div>{this.state.message ? (<p>{this.state.message}</p>) : (<></>)}</div>
                <div>
                    <p>Id: {this.state.user._id}</p>
                    <p>Email: {this.state.user.email}</p>
                    <p>Name: {this.state.user.name}</p>
                    <p>Password: {this.state.user.password}</p>
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
        );
    }
}
