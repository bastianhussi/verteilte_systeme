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

        this.nextWeek = this.nextWeek.bind(this);
        this.previousWeek = this.previousWeek.bind(this);
    }

    static contextType = CalendarContext;

    nextWeek() {
        const newDate = this.context.selectedDate;
        newDate.setDate(newDate.getDate() + 7);
        this.context.changeDate(newDate);
    }

    previousWeek() {
        const newDate = this.context.selectedDate;
        newDate.setDate(newDate.getDate() - 7);
        this.context.changeDate(newDate);
    }

    render() {
        // Returns an array of dates that are days in the same week as the given date.
        const days = [];

        // we only need the lectures within the same month
        const lectures = this.context.lectures.filter(
            (lecture) =>
                lecture.start.getMonth() ===
                this.context.selectedDate.getMonth() &&
                lecture.start.getFullYear() ===
                this.context.selectedDate.getFullYear()
        );

        for (let day = 0; day < 7; day++) {
            const dayDate = new Date(this.context.selectedDate);
            dayDate.setDate(dayDate.getDate() + day - dayDate.getDay());

            // find the lectures that take place on that day.
            const dayLectures = lectures.filter(
                ({ start }) => start.getDate() === dayDate.getDate()
            );

            days.push(<Day key={day} date={dayDate} lectures={dayLectures} />);
        }

        return (
            <CalendarContext.Consumer>
                {({ lectures }) => (
                    <>
                        <div className={styles.header}>
                            <button
                                onClick={() =>
                                    this.context.changeView(<Month />)
                                }>
                                back to month view
                            </button>
                            <span
                                class='material-icons'
                                onClick={this.previousWeek}>
                                arrow_back
                            </span>

                            {this.context.selectedDate.toDateString()}
                            <span
                                class='material-icons'
                                onClick={this.nextWeek}>
                                arrow_forward
                            </span>
                            <button
                                onClick={() =>
                                    this.context.changeDate(new Date())
                                }>
                                today
                            </button>
                        </div>
                        <div className={styles.week}>{days}</div>
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
        const hours = [];
        for (let hour = 8; hour < 18; hour++) {
            const hourDate = new Date(this.props.date);
            hourDate.setHours(hour);

            const hourLecture = this.props.lectures.find(
                (lecture) =>
                    lecture.start.getHours() <= hour &&
                    lecture.end.getHours() >= hour
            );

            hours.push(
                <Hour key={hour} date={hourDate} lecture={hourLecture} />
            );
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

    static contextType = CalendarContext;

    render() {
        return (
            <>
                <div
                    className={styles.hour}
                    onClick={() => {
                        this.context.changeDate(this.props.date);
                        this.context.showForm();
                    }}>
                    <div className={this.props.lecture ? styles.lecture : ''}>
                        {this.props.date.getHours()}
                    </div>
                </div>
            </>
        );
    }
}
