import React from 'react';
import CalendarForm from './calendarForm';
import './calendar.style.css';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: <Week date={new Date()} />,
    };
  }

  static getInitialProps() {

  }

  render() {
    return (
      <>
        {this.state.view}
      </>
    );
  }
}

class Month extends React.Component {
  constructor(props) {
    super(props);
  }
}

class Week extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const currentDay = this.props.date.getDay();

    const days = [];

    // starting at monday and goining till saturday
    for (let d = 1; d <= 6; d++) {
      let name;
      let date;
      if (d < currentDay) {
        date = new Date().setDate(this.props.date.getDate() - d);
      } else {
        date = new Date().setDate(this.props.date.getDate() + d);
      }
      switch (d) {
        case 1:
          name = 'Monday';
          break;
        case 2:
          name = 'Tuesday';
          break;
        case 3:
          name = 'Wednesday';
          break;
        case 4:
          name = 'Thursday';
          break;
        case 5:
          name = 'Friday';
          break;
        case 5:
          name = 'Saturday';
          break;
        default:
          // Sunday not covered
          break;
      }
      days.push(<Day key={d} name={name} date={date} active={d === currentDay} />);
    }
    return (
      <>
        <div className="week">
          {days}
        </div>
      </>
    );
  }
}

class Day extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const hours = [];
    for (let h = 8; h < 18; h++) {
      hours.push(<Hour start={h} end={h + 1} key={h} onClick={this.props.onClick} />);
    }
    return (
      <>

        <div className="day" className={this.props.active ? 'active' : ''}>
          <div className="day-header">
            {this.props.name}
            <br />
            {new Date(this.props.date).getDate()}
          </div>
          {hours}
        </div>
      </>
    );
  }
}

class Hour extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="hour" onClick={this.props.onClick}>
          {this.props.start}
          <br />
          -
          <br />
          {this.props.end}
        </div>
      </>
    );
  }
}
