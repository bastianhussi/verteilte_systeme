import React from 'react';
import CalendarForm from './calendarForm';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formVisible: false
    };

    this.toggleFormVisibility = this.toggleFormVisibility.bind(this);
  }

  toggleFormVisibility() {
    this.setState({ formVisible: !this.state.formVisible });
  }

  render() {
    const days = [];
    for (let d = 0; d < 7; d++) {
      days.push(<Day dayNumber={d + 1} key={d} />);
    }
    return (
      <>
        {this.state.formVisible ? <CalendarForm onClose={this.toggleFormVisibility} /> : <></>}
        <div className="week" onClick={this.toggleFormVisibility}>{days}</div>
        <style jsx>
          {`
                    .week {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        justify-content: center;
                        align-items: flex-start;
                    }
                `}
        </style>
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
    for (let h = 0; h < 24; h++) {
      hours.push(<Hour start={h} end={h + 1} key={h} onClick={this.props.onClick} />);
    }
    return (
      <>

        <div className="day">
          <div className="day-header">
            Day
            {this.props.dayNumber}
          </div>
          {hours}
        </div>
        <style jsx>
          {`
                    .day {
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: flex-start;
                        align-items: center;
                    }
                    .day:nth-child(odd) {
                        background-color: #20232a;
                    }
                    .day:nth-child(even) {
                        background-color: #282c34;
                    }
                    .day-header {
                        background-color: #61dafb;
                        width: 100%;
                        height: 50px;
                        position: sticky;
                        top: 0;
                    }
                `}
        </style>
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
          -
          {this.props.end}
        </div>
        <style jsx>
          {`
                    .hour {
                        height: 50px;
                        width: 150px;
                        color: white;
                        border: white solid 2px;
                    }
                    .hour:hover {
                        cursor: pointer;
                    }
                `}
        </style>
      </>
    );
  }
}

export default Calendar;
