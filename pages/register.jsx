import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import { noAuth } from '../utils/auth';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      password: '',
      viewPassword: false,
      message: ''
    };
    this.changeEmail = this.changeEmail.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.submitRegisterForm = this.submitRegisterForm.bind(this);
  }

  static getInitialProps(ctx) {
    noAuth(ctx);
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = process.browser ? `${protocol}://${window.location.host}/api/register` : `${protocol}://${ctx.req.headers.host}/api/register`;
    return { apiUrl };
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
  async submitRegisterForm(event) {
    this.setState({ message: '' });
    event.preventDefault();
    try {
      await axios.post(this.props.apiUrl, {
        email: this.state.email,
        name: this.state.name,
        password: this.state.password
      }, {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
      this.setState({ email: '', name: '', password: '', message: 'please check your inbox' })
    } catch (err) {
      this.setState({ password: '', message: err.response.data });
    }
  }

  render() {
    return (
      <>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Register</title>
        </Head>
        <div>
          <form onSubmit={this.submitRegisterForm}>
            <label>
              Email:
              <br />
              <input type="email" value={this.state.email} onChange={this.changeEmail} required autoComplete="on" />
            </label>
            <br />
            <label>
              Name:
              <br />
              <input type="text" value={this.state.name} onChange={this.changeName} required autoComplete="on" />
            </label>
            <br />
            <label>
              Password:
              <br />
              <input type={this.state.viewPassword ? "text" : "password"} value={this.state.password} onChange={this.changePassword} required />
              <a onClick={() => this.setState({ viewPassword: !this.state.viewPassword })}>{this.state.viewPassword ? 'Hide' : 'Show'}</a>
            </label>
            <br />
            <button type="submit">Register</button>
          </form>
          {this.state.message ? <p>{this.state.message}</p> : <></>}
          <Link href="/login"><a>Login</a></Link>
        </div>
      </>
    );
  }
}
