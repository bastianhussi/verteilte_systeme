import React from 'react';
import Month from './calendar/month';
import Week from './calendar/week';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: <Month />,
    };
  }

  render() {
    return (
      <>
        {this.state.current}
      </>
    );
  }
}
