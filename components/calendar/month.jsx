import React from "react";
import styles from "./month.module.css";

Date.prototype.getMonthDays = function () {
  const d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
  return d.getDate();
};

export default class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };
    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
  }

  previousMonth() {
    let previousMonth;
    if (this.state.date.getMonth() == 1) {
      previousMonth = new Date(this.state.date.getFullYear() - 1, 0, 1);
    } else {
      previousMonth = new Date(
        this.state.date.getFullYear(),
        this.state.date.getMonth() - 1,
        1
      );
    }
    this.setState({ date: previousMonth });
  }

  nextMonth() {
    let nextMonth;
    if (this.state.date.getMonth() == 11) {
      nextMonth = new Date(this.state.date.getFullYear() + 1, 0, 1);
    } else {
      nextMonth = new Date(
        this.state.date.getFullYear(),
        this.state.date.getMonth() + 1,
        1
      );
    }
    this.setState({ date: nextMonth });
  }

  render() {
    const days = [];
    for (let d = 1; d <= this.state.date.getMonthDays(); d++) {
      days.push(<Day key={d} number={d} changeView={this.props.changeView} />);
    }
    return (
      <>
        <div className={styles.monthHeader}>
          <button onClick={this.previousMonth}>previous</button>
          {this.state.date.toDateString()}
          <button onClick={this.nextMonth}>next</button>
        </div>
        <div className={styles.month}>{days}</div>
      </>
    );
  }
}

class Day extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.monthDay} onClick={this.props.changeView}>
        {this.props.number}
      </div>
    );
  }
}
