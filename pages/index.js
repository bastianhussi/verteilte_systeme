import React from 'react';
import Head from 'next/head';
import { auth, logout } from '../utils/auth';
import Calendar from '../components/calendar';

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps(ctx) {
    const token = await auth(ctx);

    return { token };
  }

  render() {
    return (
      <>
        <Head />
        <Calendar />
        <button onClick={logout}>Logout</button>
      </>
    );
  }
}

export default Index;
