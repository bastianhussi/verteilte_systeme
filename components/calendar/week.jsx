import React from 'react';
import CalendarContext from '../calendarContext';
import UserContext from '../userContext';
import MonthController from './month';
import { isToday } from '../../utils/date';
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
                    <div>
                        <div className={styles.header}>
                            <button
                                onClick={() => changeView(<MonthController />)}>
                                change view
                            </button>
                            <span
                                className='material-icons'
                                onClick={this.previousWeek}>
                                arrow_back
                            </span>
                            <h2>{selectedDate.toLocaleDateString()}</h2>
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
                                    lectures={
                                        selectedSemester
                                            ? lectures.filter(
                                                  (lecture) =>
                                                      lecture.semester ===
                                                      selectedSemester._id
                                              )
                                            : []
                                    }
                                />
                            )}
                        </UserContext.Consumer>
                    </div>
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
        const { date, lectures } = this.props;

        function getDayLectures(day) {
            return lectures.filter(
                (lecture) =>
                    new Date(lecture.start).getFullYear() ===
                        day.getFullYear() &&
                    new Date(lecture.start).getMonth() === day.getMonth() &&
                    new Date(lecture.start).getDate() === day.getDate()
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

        function getHourLectures(hour) {
            return lectures.filter((lecture) => {
                const lectureStart = new Date(lecture.start);
                const lectureEnd = new Date(lecture.end);

                return (
                    lectureStart.getHours() <= hour.getHours() &&
                    lectureEnd.getHours() >= hour.getHours()
                );
            });
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
                        lectures={getHourLectures(hourDate)}
                    />
                );
            }
            return hours;
        }

        return (
            <div>
                <div className={styles.dayHeader}>
                    {`${this.props.date.getDate()}. ${this.props.date.getDayName()}`}
                </div>
                {getHours()}
            </div>
        );
    }
}

class Hour extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = CalendarContext;

    render() {
        const { date, lectures } = this.props;
        const {
            selectedSemester,
            changeLecture,
            changeDate,
            showForm,
        } = this.context;

        const isInSemester = selectedSemester
            ? date.getTime() >= new Date(selectedSemester.start).getTime() &&
              date.getTime() <= new Date(selectedSemester.end).getTime()
            : false;

        return (
            <div className={styles.hour}>
                <>
                    {lectures.map((lecture) => (
                        <Lecture
                            key={lecture._id}
                            date={date}
                            lecture={lecture}
                        />
                    ))}
                </>
                <div
                    onClick={() => {
                        if (isInSemester) {
                            changeDate(
                                new Date(
                                    date.getFullYear(),
                                    date.getMonth(),
                                    date.getDate(),
                                    date.getHours(),
                                    0,
                                    0,
                                    0
                                )
                            );
                            changeLecture(undefined);
                            showForm();
                        }
                    }}>
                    {`${date.getHours()}:00`}
                    <style jsx>{`
                        div {
                            background-color: ${isInSemester
                                ? isToday(date)
                                    ? 'var(--yellow)'
                                    : 'var(--background-color)'
                                : 'grey'};
                            height: 100%;
                        }

                        div:hover {
                            cursor: ${isInSemester ? 'pointer' : 'not-allowed'};
                            ${isInSemester ? 'background-color: var(--yellow)' : ''}
                        }
                    `}</style>
                </div>
            </div>
        );
    }
}

class Lecture extends React.Component {
    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.getPercent = this.getPercent.bind(this);
    }

    static contextType = CalendarContext;

    getTitle() {
        const { date, lecture } = this.props;
        const lectureStart = new Date(lecture.start);

        return lectureStart.getHours() === date.getHours() ? lecture.title : undefined;
    }

    getPercent() {
        const { date, lecture } = this.props;
        const lectureStart = new Date(lecture.start);
        const lectureEnd = new Date(lecture.end);

        if (lectureStart.getHours() === date.getHours()) {
            return 100 - (100 / 60) * lectureStart.getMinutes();
        } else if (lectureEnd.getHours() === date.getHours()) {
            return (100 / 60) * lectureEnd.getMinutes();
        } else {
            return 100;
        }
    }

    render() {
        const { date, lecture } = this.props;
        const { changeDate, changeLecture, showForm } = this.context;

        return (
            <UserContext.Consumer>
                {({ courses }) => (
                    <>
                        <div
                            onClick={() => {
                                changeDate(date);
                                changeLecture(lecture);
                                showForm();
                            }}>{this.getTitle()}</div>
                        <style jsx>{`
                            div {
                                position: absolute;
                                ${
                                    new Date(lecture.start).getHours() ===
                                    date.getHours()
                                        ? 'bottom: 0;'
                                        : 'top: 0;'
                                }
                                height: ${this.getPercent()}%;
                                width: 100%;
                                background-color: ${
                                    courses.find(
                                        (course) =>
                                            course._id === lecture.course
                                    ).color
                                };
                            }

                            div:hover {
                                cursor: pointer;
                            }
                        `}</style>
                    </>
                )}
            </UserContext.Consumer>
        );
    }
}
