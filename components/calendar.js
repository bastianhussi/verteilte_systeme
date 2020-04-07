import React from 'react';
import CalendarForm from './calendarForm';
import styles from './calendar.module.css';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: <Month />,
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

Date.prototype.monthDays = function () {
  const d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
  return d.getDate();
}

class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
  }

  previousMonth() {
    let previousMonth;
    if (this.state.date.getMonth() == 1) {
      previousMonth = new Date(this.state.date.getFullYear() - 1, 0, 1);
    } else {
      previousMonth = new Date(this.state.date.getFullYear(), this.state.date.getMonth() - 1, 1);
    }
    this.setState({ date: previousMonth });

  }

  nextMonth() {
    let nextMonth;
    if (this.state.date.getMonth() == 11) {
      nextMonth = new Date(this.state.date.getFullYear() + 1, 0, 1);
    } else {
      nextMonth = new Date(this.state.date.getFullYear(), this.state.date.getMonth() + 1, 1);
    }
    this.setState({ date: nextMonth });
  }

  render() {
    const days = [];
    for (let d = 1; d <= this.state.date.monthDays(); d++) {
      days.push(<MonthDay key={d} number={d} />)
    }
    return (
      <>
        <div className={styles.monthHeader}>
          <button onClick={this.previousMonth}>previous</button>
          {this.state.date.toDateString()}
          <button onClick={this.nextMonth} >next</button>
        </div>
        <div className={styles.month}>
          {days}
        </div>
      </>
    )
  }
}

class MonthDay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.monthDay}>{this.props.number}</div>
    );
  }
}

class Week extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.week}>
        <WeekDay name="Monday" />
        <WeekDay name="Tuesday" />
        <WeekDay name="Wednesday" />
        <WeekDay name="Thursday" />
        <WeekDay name="Friday" />
        <WeekDay name="Saturday" />
        <WeekDay name="Sunday" />
      </div >
    );
  }
}

class WeekDay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const hours = [];
    for (let h = 8; h < 18; h++) {
      hours.push(<Hour start={h} end={h + 1} key={h} />);
    }

    return (
      <>

        <div className={styles.weekDay}>
          <div className={styles.weekDayHeader}>
            {this.props.name}
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
        <div className={styles.hour}>
          {this.props.start}
          -
          {this.props.end}
        </div>
      </>
    );
  }
}
