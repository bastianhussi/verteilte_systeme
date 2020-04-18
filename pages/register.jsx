import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import axios from 'axios';
import { noAuth } from '../utils/auth';
import styles from './login.module.css'
import Message from '../components/message';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      password: '',
      showPassword: false,
      message: ''
    };
    this.changeEmail = this.changeEmail.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeShowPassword = this.changeShowPassword.bind(this);
    this.submitRegisterForm = this.submitRegisterForm.bind(this);
  }

  /**
   * Uses the noAuth-function to check if the user is not logged in.
   * After that this function will check which protocol is beeing used and gets the url for making
   * api calls.
   * @param {object} ctx - The context.
   */
  static getInitialProps(ctx) {
    noAuth(ctx);
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = process.browser ? `${protocol}://${window.location.host}/api/register` : `${protocol}://${ctx.req.headers.host}/api/register`;
    return { apiUrl };
  }

  /**
   * This function and the other three below are beeing called 
   * whenever the value of an input field changes.
   * This way the components state will always be up to date.
   * @param {object} event - The input event.
   */
  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changeName(event) {
    this.setState({ name: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  changeShowPassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  /**
   * This function will make a (axios) post request to register the user.
   * If the request succeeds the user is promted to check his inbox.
   * @param {*} event - The form submit event.
   */
  async submitRegisterForm(event) {
    // prevent the standard behavior of the html form (refreshing the page).
    event.preventDefault();
    this.setState({ message: '' });
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

  /**
   * This Component will render a register form with an email-,
   * name- and password input field. It's also possible to show the password as
   * plain text by using the checkbox. If the user wants to login instead a link
   * to do so is also provided.
   * If an error occurres when making a post request (e.g. email address taken)
   * it will be displayed below the form.
   * The css styles beeing used are comming from './login.module.css' because the styling
   * of both the login- and register form do not differ.
   */
  render() {
    return (
      <>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Register</title>
        </Head>
        <h1 style={{ textAlign: "center" }}>Register</h1>
        <div className={styles.center}>
          <form onSubmit={this.submitRegisterForm} className={styles.loginForm}>
            <div>
              <label>
                Email:
              <br />
                <input type="email" value={this.state.email} onChange={this.changeEmail} required />
              </label>
            </div>
            <div>
              <label>
                Name:
              <br />
                <input type="text" value={this.state.name} onChange={this.changeName} required />
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
              <Link href="/login"><a>Login</a></Link>
              <button type="submit" className={styles.loginButton}>Register</button>
            </div>
          </form>
          <Message value={this.state.message} />
        </div>
      </>
    );
  }
}
