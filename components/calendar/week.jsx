import React from 'react';
import CalendarContext from '../calendarContext';
import UserContext from '../userContext';
import MonthController from './month';
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

export default class WeekController extends React.Component {
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
        return (
            <CalendarContext.Consumer>
                {({ selectedDate, changeDate, changeView }) => (
                    <>
                        <div className={styles.header}>
                            <button
                                onClick={() => changeView(<MonthController />)}>
                                back to month view
                            </button>
                            <span
                                class='material-icons'
                                onClick={this.previousWeek}>
                                arrow_back
                            </span>
                            {selectedDate.toDateString()}
                            <span
                                class='material-icons'
                                onClick={this.nextWeek}>
                                arrow_forward
                            </span>
                            <button onClick={() => changeDate(new Date())}>
                                today
                            </button>
                        </div>
                        <UserContext.Consumer>
                            {({ lectures }) => (
                                <Week date={selectedDate} lectures={lectures} />
                            )}
                        </UserContext.Consumer>
                    </>
                )}
            </CalendarContext.Consumer>
        );
    }
}

class Week extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { date } = this.props;
        /*let lectures;
        if (this.props.lectures) {
            lectures = this.props.lectures.filter(
                (lecture) =>
                    lecture.start.getMonth() ===
                        this.context.selectedDate.getMonth() &&
                    lecture.start.getFullYear() ===
                        this.context.selectedDate.getFullYear()
            );
        } else {
            lectures = [];
        } */
        const lectures = [];

        function getLectures(day) {
            return lectures.filter(
                ({ start }) => start.getDate() === day.getDate()
            );
        }

        function getDays() {
            const days = [];
            for (let day = 0; day < 7; day++) {
                const dayDate = new Date(date);
                dayDate.setDate(dayDate.getDate() + day - dayDate.getDay());

                days.push(
                    <Day
                        key={day}
                        date={dayDate}
                        lectures={getLectures(dayDate)}
                    />
                );
            }
            return days;
        }

        return <div className={styles.week}>{getDays()}</div>;
    }
}

class Day extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = CalendarContext;

    render() {
        const { lectures } = this.props;

        const { date } = this.props;

        function getLecture(hour) {
            return lectures.find(
                (lecture) =>
                    lecture.start.getHours() <= hour &&
                    lecture.end.getHours() >= hour
            );
        }

        function getHours() {
            const hours = [];
            for (let hour = 8; hour < 18; hour++) {
                const hourDate = new Date(date);
                hourDate.setHours(hour);

                hours.push(
                    <Hour
                        key={hour}
                        date={hourDate}
                        lecture={getLecture(hourDate)}
                    />
                );
            }
            return hours;
        }

        return (
            <>
                <div className={styles.day}>
                    <div className={styles.dayHeader}>
                        {`${this.props.date.getDate()}. ${this.props.date.getDayName()}`}
                    </div>
                    {getHours()}
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
                        this.context.showForm(this.props.lecture);
                    }}>
                    <div className={this.props.lecture ? styles.lecture : ''}>
                        {this.props.date.getHours()}
                    </div>
                </div>
            </>
        );
    }
}
