import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import { login, noAuth } from '../utils/auth';
import Message from '../components/message';
import styles from './login.module.css';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      message: '',
    };
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeShowPassword = this.changeShowPassword.bind(this);
    this.submitLoginForm = this.submitLoginForm.bind(this);
  }

  /**
   * Uses the noAuth-function to check if the user is not logged in.
   * After that this function will check which protocol is beeing used and gets the url for making
   * api calls.
   * @param {*} ctx - The context
   */
  static getInitialProps(ctx) {
    noAuth(ctx);
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = process.browser ? `${protocol}://${window.location.host}/api/login` : `${protocol}://${ctx.req.headers.host}/api/login`;
    return { apiUrl };
  }

  /**
   * This function and the other two below are beeing called 
   * whenever the value of an input field changes.
   * This way the components state will always be up to date.
   * @param {*} event - The input event.
   */
  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  changeShowPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  /**
   * This function will make a (axios) post request in attempt to log the user in.
   * If the request succeeds the user will be redirected to "/" by calling the login-function.
   * In case of an error the error will be displayed below the form.
   * @param {*} event - The form submit event.
   */
  async submitLoginForm(event) {
    // prevent the standard behavior of the html form (refreshing the page).
    event.preventDefault();
    this.setState({ message: '' });
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
      this.setState({ password: '', message: err.response.data });
    }
  }

  /**
   * This component will render a form with a email- and password input field.
   * It's also possible to show the password as
   * plain text by using the checkbox. If the user wants to register instead a link
   * to do so is also provided.
   * If an error occurres when making a post request (e.g. wrong password)
   * it will be displayed below the form.
   */
  render() {
    return (
      <>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Login</title>
        </Head>
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <div className={styles.center}>
          <form onSubmit={this.submitLoginForm} className={styles.loginForm}>
            <div>
              <label>
                Email:
              <br />
                <input type="email" value={this.state.email} onChange={this.changeEmail} required />
              </label>
            </div>
            <div>
              <label>
                Password:
              <br />
                <input type={this.state.showPassword ? "text" : "password"} value={this.state.password} onChange={this.changePassword} required />
              </label>
              <br />
              <label>
                <input type="checkbox" defaultChecked={this.state.showPassword} onClick={this.changeShowPassword} />
                Show password
              </label>
            </div>
            <div>
              <Link href="/register" ><a>Register</a></Link>
              <button type="submit" className={styles.loginButton}>Sign in</button>
            </div>
          </form>
          <Message value={this.state.message} />
        </div>
      </>
    );
  }
}
