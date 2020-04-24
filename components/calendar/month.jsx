import React from 'react';
import CalendarContext from '../calendarContext';
import Week from './week';
import styles from './month.module.css';

Date.prototype.getMonthDays = function () {
    const d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
};

Date.prototype.getDayName = function () {
    const weekDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    return weekDays[this.getDay()];
};

export default class Month extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMonth: new Date(),
        };
        this.previousMonth = this.previousMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
    }

    static contextType = CalendarContext;

    previousMonth() {
        let previousMonth;
        if (this.state.selectedMonth.getMonth() == 1) {
            previousMonth = new Date(
                this.state.selectedMonth.getFullYear() - 1,
                0,
                1
            );
        } else {
            previousMonth = new Date(
                this.state.selectedMonth.getFullYear(),
                this.state.selectedMonth.getMonth() - 1,
                1
            );
        }
        this.setState({ selectedMonth: previousMonth });
    }

    nextMonth() {
        let nextMonth;
        if (this.state.selectedMonth.getMonth() == 11) {
            nextMonth = new Date(
                this.state.selectedMonth.getFullYear() + 1,
                0,
                1
            );
        } else {
            nextMonth = new Date(
                this.state.selectedMonth.getFullYear(),
                this.state.selectedMonth.getMonth() + 1,
                1
            );
        }
        this.setState({ selectedMonth: nextMonth });
    }

    render() {
        const header = [];
        for (let day = 1; day <= 7; day++) {
            const dayName = new Date(this.state.selectedMonth.getFullYear(), this.state.selectedMonth.getMonth(), day).getDayName(); 
            header.push(<div key={dayName}>{dayName}</div>)
        }

        const days = [];
        for (let day = 1; day <= this.state.selectedMonth.getMonthDays(); day++) {
            days.push(
                <Day
                    key={day}
                    date={
                        new Date(
                            this.state.selectedMonth.getFullYear(),
                            this.state.selectedMonth.getMonth(),
                            day
                        )
                    }
                />
            );
        }

        return (
            <>
                <div className={styles.monthHeader}>
                    <button onClick={this.previousMonth}>previous</button>
                    {this.state.selectedMonth.toDateString()}
                    <button onClick={this.nextMonth}>next</button>
                </div>
                <div className={styles.month}>
                    {header}
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

    static contextType = CalendarContext;

    render() {
        return (
            <div
                className={styles.monthDay}
                onClick={() => {
                    this.context.changeDate(this.props.date);
                    this.context.changeView(<Week />);
                }}>
                {this.props.date.getDate()}
            </div>
        );
    }
}
