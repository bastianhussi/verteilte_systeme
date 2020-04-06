import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import { login, noAuth } from '../utils/auth';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
    };
    this.submitForm = this.submitForm.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  static getInitialProps(ctx) {
    noAuth(ctx);
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = process.browser ? `${protocol}://${window.location.host}/api/users` : `${protocol}://${ctx.req.headers.host}/api/users`;
    return { apiUrl };
  }

  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  async submitForm(event) {
    this.setState({ error: '' });
    event.preventDefault();
    try {
      const res = await axios.post(this.props.apiUrl, {
        email: this.state.email,
        password: this.state.password,
      }, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
      const { token } = res.data;
      login(token);
    } catch (err) {
      this.setState({ password: '', error: err.response.data });
    }
  }

  render() {
    return (
      <>
        <Head />
        <div>
          <form onSubmit={this.submitForm}>
            <label>
              Email:
              <br />
              <input type="email" value={this.state.email} onChange={this.changeEmail} required autoComplete="on" />
            </label>
            <br />
            <label>
              Password:
              <br />
              <input type="password" value={this.state.password} onChange={this.changePassword} required />
            </label>
            <br />
            <button type="submit">Register</button>
          </form>
          {this.state.error.length > 0 ? <p>{this.state.error}</p> : <></>}
          <Link href="/login"><a>Login</a></Link>
        </div>
      </>

    );
  }
}

export default Register;
