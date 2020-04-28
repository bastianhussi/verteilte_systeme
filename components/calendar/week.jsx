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
                {({
                    selectedDate,
                    changeDate,
                    changeView,
                    selectedSemester,
                }) => (
                    <>
                        <div className={styles.header}>
                            <button
                                onClick={() => changeView(<MonthController />)}>
                                back to month view
                            </button>
                            <span
                                className='material-icons'
                                onClick={this.previousWeek}>
                                arrow_back
                            </span>
                            {selectedDate.toDateString()}
                            <span
                                className='material-icons'
                                onClick={this.nextWeek}>
                                arrow_forward
                            </span>
                            <button onClick={() => changeDate(new Date())}>
                                today
                            </button>
                        </div>
                        <UserContext.Consumer>
                            {({ lectures }) => (
                                <Week
                                    date={selectedDate}
                                    lectures={lectures.filter(
                                        (lecture) =>
                                            lecture.semester ===
                                            selectedSemester._id
                                    )}
                                />
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

    static contextType = CalendarContext;

    render() {
        const { date } = this.props;
        const { selectedDate } = this.context;

        const lectures = this.props.lectures.filter(
            (lecture) =>
                new Date(lecture.start).getFullYear() ===
                    selectedDate.getFullYear() &&
                new Date(lecture.start).getMonth() === selectedDate.getMonth()
        );

        function getDayLectures(day) {
            return lectures.filter(
                (lecture) => new Date(lecture.start).getDate() === day.getDate()
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
                        lectures={getDayLectures(dayDate)}
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

    render() {
        const { lectures, date } = this.props;

        function getHourLecture(hour) {
            return lectures.find(
                (lecture) =>
                    new Date(lecture.start).getHours() <= hour.getHours() &&
                    new Date(lecture.end).getHours() >= hour.getHours()
            );
        }

        function getHours() {
            const hours = [];
            for (let hour = 8; hour <= 18; hour++) {
                const hourDate = new Date(date);
                hourDate.setHours(hour);

                hours.push(
                    <Hour
                        key={hour}
                        date={hourDate}
                        lecture={getHourLecture(hourDate)}
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
        const isInSemester =
            this.props.date.getTime() >=
                new Date(this.context.selectedSemester.start).getTime() &&
            this.props.date.getTime() <=
                new Date(this.context.selectedSemester.end).getTime();

        let backgroundColor = 'white';
        if (!isInSemester) {
            backgroundColor = 'grey';
        } else if (this.props.lecture) {
            backgroundColor = 'red';
        }

        return (
            <>
                <div
                    className={styles.hour}
                    onClick={() => {
                        if (isInSemester) {
                            this.context.changeLecture(this.props.lecture);
                            this.context.changeDate(this.props.date);
                            this.context.showForm();
                        }
                    }}>
                    {this.props.date.getHours()}:00
                </div>
                <style jsx>{`
                    div {
                        height: 50px;
                        width: 150px;
                        color: #333333;
                        border-bottom: 2px solid black;
                        background-color: ${backgroundColor};
                    }

                    div:hover {
                        cursor: ${isInSemester ? 'pointer' : 'not-allowed'};
                    }
                `}</style>
            </>
        );
    }
}
