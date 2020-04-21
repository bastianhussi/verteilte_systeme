import React from 'react';
import Month from './calendar/month';
import Week from './calendar/week';

const CalendarContext = React.createContext({ selectedDate: new Date() });

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: <Month changeView={this.changeView} />,
    };
    this.changeView = this.changeView.bind(this);
  }

  changeView() {
    this.state.current = this.state.current instanceof Month ? <Week changeView={this.changeView} /> : <Month changeView={this.changeView} />;
  }

  render() {
    return (
      <>
        {this.state.current}
      </>
    );
  }
}
