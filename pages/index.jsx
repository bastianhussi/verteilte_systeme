import React from 'react';
import Head from 'next/head';
import { auth } from '../utils/auth';
import Calendar from '../components/calendar';
import Navbar from '../components/navbar';
import AppContext from '../components/appContext';

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      currentView: <Calendar />,
    };

    this.changeView = this.changeView.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  changeView(newView) {
    this.setState({ currentView: newView });
  }

  changeUser(newUser) {
    this.setState({ user: newUser });
  }

  static async getInitialProps(ctx) {
    try {
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const apiUrl = process.browser ? `${protocol}://${window.location.host}/api` : `${protocol}://${ctx.req.headers.host}/api`;
      const { user, token } = await auth(ctx, apiUrl);
      return { user, token, apiUrl };
    } catch (err) {

    }
  }

  static contextType = AppContext;

  render() {
    const { token, apiUrl } = this.props;
    const { user } = this.state;
    return (
      <>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Overview</title>
        </Head>
        <AppContext.Provider value={{ user, token, apiUrl, changeUser: this.changeUser }} >
          <Navbar changeView={this.changeView} />
          <div>
            {this.state.currentView}
          </div>
        </AppContext.Provider>
      </>
    );
  }
}
