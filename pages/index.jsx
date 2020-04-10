import React from 'react';
import Head from 'next/head';
import { auth } from '../utils/auth';
import Calendar from '../components/calendar';
import Navbar from '../components/navbar';

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps(ctx) {
    // destructuring the properties user and token immediately would cause an TypeError, if authentication fails.
    const res = await auth(ctx);
    const { user } = res;
    return { user };
  }

  render() {
    return (
      <>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Overview</title>
        </Head>
        <Navbar user={this.props.user} />
      </>
    );
  }
}
