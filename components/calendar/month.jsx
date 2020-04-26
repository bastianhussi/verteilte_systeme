import React from 'react';
import CalendarContext from '../calendarContext';
import Week from './week';
import styles from './month.module.css';

Date.prototype.getMonthDays = function () {
    const date = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return date.getDate();
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
        this.previousMonth = this.previousMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
    }

    static contextType = CalendarContext;

    previousMonth() {
        let previousMonth;
        if (this.context.selectedDate.getMonth() == 1) {
            previousMonth = new Date(
                this.context.selectedDate.getFullYear() - 1,
                0,
                1
            );
        } else {
            previousMonth = new Date(
                this.context.selectedDate.getFullYear(),
                this.context.selectedDate.getMonth() - 1,
                1
            );
        }
        this.context.changeDate(previousMonth);
    }

    nextMonth() {
        let nextMonth;
        if (this.context.selectedDate.getMonth() == 11) {
            nextMonth = new Date(
                this.context.selectedDate.getFullYear() + 1,
                0,
                1
            );
        } else {
            nextMonth = new Date(
                this.context.selectedDate.getFullYear(),
                this.context.selectedDate.getMonth() + 1,
                1
            );
        }
        this.context.changeDate(nextMonth);
    }

    render() {
        const selectedDate = this.context.selectedDate;

        const header = [];
        for (let day = 1; day <= 7; day++) {
            const dayName = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                day
            ).getDayName();
            header.push(<div key={dayName}>{dayName}</div>);
        }

        const days = [];
        for (let day = 1; day <= selectedDate.getMonthDays(); day++) {
            days.push(
                <Day
                    key={day}
                    date={
                        new Date(
                            selectedDate.getFullYear(),
                            selectedDate.getMonth(),
                            day
                        )
                    }
                />
            );
        }

        return (
            <CalendarContext.Consumer>
                {() => (
                    <>
                        <div className={styles.header}>
                            <span
                                class='material-icons'
                                onClick={this.previousMonth}>
                                arrow_back
                            </span>

                            {selectedDate.toDateString()}
                            <span
                                class='material-icons'
                                onClick={this.nextMonth}>
                                arrow_forward
                            </span>
                            <button
                                onClick={() =>
                                    this.context.changeDate(new Date())
                                }>
                                today
                            </button>
                        </div>
                        <div className={styles.month}>
                            {header}
                            {days}
                        </div>
                    </>
                )}
            </CalendarContext.Consumer>
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
                className={styles.day}
                onClick={() => {
                    this.context.changeDate(this.props.date);
                    this.context.changeView(<Week />);
                }}>
                {this.props.date.getDate()}
            </div>
        );
    }
}
