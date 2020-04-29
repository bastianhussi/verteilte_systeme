import React from 'react';
import CalendarContext from '../calendarContext';
import WeekController from './week';
import UserContext from '../userContext';
import { isToday } from '../../utils/date';
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

export default class MonthController extends React.Component {
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
                1,
                0,
                0,
                0,
                0
            );
        } else {
            previousMonth = new Date(
                this.context.selectedDate.getFullYear(),
                this.context.selectedDate.getMonth() - 1,
                1,
                0,
                0,
                0,
                0
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
                1,
                0,
                0,
                0,
                0
            );
        } else {
            nextMonth = new Date(
                this.context.selectedDate.getFullYear(),
                this.context.selectedDate.getMonth() + 1,
                1,
                0,
                0,
                0,
                0
            );
        }
        this.context.changeDate(nextMonth);
    }

    render() {
        return (
            <CalendarContext.Consumer>
                {({
                    selectedDate,
                    changeDate,
                    selectedSemester,
                    changeView,
                }) => (
                    <div className={styles.monthContainer}>
                        <div className={styles.header}>
                            <button
                                onClick={() => changeView(<WeekController />)}>
                                to week view
                            </button>
                            <span
                                className='material-icons'
                                onClick={this.previousMonth}>
                                arrow_back
                            </span>
                            {selectedDate.toDateString()}
                            <span
                                className='material-icons'
                                onClick={this.nextMonth}>
                                arrow_forward
                            </span>
                            <button onClick={() => changeDate(new Date())}>
                                today
                            </button>
                        </div>
                        <UserContext.Consumer>
                            {({ lectures }) => (
                                <Month
                                    date={selectedDate}
                                    lectures={lectures.filter(
                                        (lecture) =>
                                            lecture.semester ===
                                                selectedSemester._id &&
                                            new Date(
                                                lecture.start
                                            ).getFullYear() ===
                                                selectedDate.getFullYear() &&
                                            new Date(
                                                lecture.start
                                            ).getMonth() ===
                                                selectedDate.getMonth()
                                    )}
                                />
                            )}
                        </UserContext.Consumer>
                    </div>
                )}
            </CalendarContext.Consumer>
        );
    }
}

class Month extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { date, lectures } = this.props;

        function getHeader() {
            const header = [];
            for (let day = 1; day <= 7; day++) {
                const dayName = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    day
                ).getDayName();
                header.push(
                    <div key={dayName} className={styles.dayHeader}>
                        {dayName}
                    </div>
                );
            }
            return header;
        }

        function getDayLecture(day) {
            return lectures.find(
                (lecture) => new Date(lecture.start).getDate() === day.getDate()
            );
        }

        function getDays() {
            const days = [];
            for (let day = 1; day <= date.getMonthDays(); day++) {
                const dayDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    day
                );
                days.push(
                    <Day
                        key={day}
                        date={dayDate}
                        lecture={getDayLecture(dayDate)}
                    />
                );
            }
            return days;
        }

        return (
            <div className={styles.month}>
                {getHeader()}
                {getDays()}
            </div>
        );
    }
}

class Day extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = CalendarContext;

    render() {
        const isInSemester = this.context.selectedSemester
            ? this.props.date.getTime() >=
                  new Date(this.context.selectedSemester.start).getTime() &&
              this.props.date.getTime() <=
                  new Date(this.context.selectedSemester.end).getTime()
            : false;

        let backgroundColor = 'var(--background-color)';
        if (!isInSemester) {
            backgroundColor = 'grey';
        } else if (this.props.lecture) {
            backgroundColor = 'var(--accent-light-color)';
        }

        // highlight current day
        if (isToday(this.props.date)) backgroundColor = 'var(--accent-color)';

        return (
            <>
                <div
                    className={styles.day}
                    onClick={() => {
                        if (isInSemester) {
                            this.context.changeDate(this.props.date);
                            this.context.changeView(<WeekController />);
                        }
                    }}>
                    {this.props.date.getDate()}
                </div>
                <style jsx>{`
                    div {
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
