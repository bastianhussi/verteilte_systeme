import React from 'react';
import CalendarContext from '../calendarContext';
import Month from './month';
import styles from './week.module.css';

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

export default class Week extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = CalendarContext;

    render() {
        // Returns an array of dates that are days in the same week as the given date.
        const days = [];
        for (let d = 0; d < 7; d++) {
            const dayDate = new Date(this.context.selectedDate);
            dayDate.setDate(dayDate.getDate() + d - dayDate.getDay());
            days.push(<Day key={d} date={dayDate} />);
        }

        return (
            <>
                <div>
                    <button onClick={() => this.context.changeView(<Month />)}>
                        back to month view
                    </button>
                </div>
                <div className={styles.week}>{days}</div>
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
        const hours = [];
        for (let h = 8; h < 18; h++) {
            hours.push(<Hour start={h} end={h + 1} key={h} />);
        }

        return (
            <>
                <div className={styles.day}>
                    <div className={styles.dayHeader}>
                        {`${this.props.date.getDate()}. ${this.props.date.getDayName()}`}
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
                    {this.props.start}-{this.props.end}
                </div>
            </>
        );
    }
}
