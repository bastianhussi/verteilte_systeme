import React from 'react';
import Head from 'next/head';
import { auth } from '../utils/auth';
import Calendar from '../components/calendar';
import Navbar from '../components/navbar';

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps(ctx) {
    const user = await auth(ctx);
    // fetch user data
    return { user };
  }

  render() {
    return (
      <>
        <Head />
        <Navbar user={this.props.user} />
        <Calendar />
      </>
    );
  }
}

export default Index;
