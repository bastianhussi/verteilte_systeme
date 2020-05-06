import React from 'react';
import CalendarContext from '../../calendarContext';
import UserContext from '../../userContext';
import WeekController from '../week/controller';
import Month from './month';
import styles from './month.module.css';

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
                    <div>
                        <div className={styles.header}>
                            <button
                                onClick={() => changeView(<WeekController />)}>
                                week view
                            </button>
                            <span
                                className='material-icons'
                                onClick={this.previousMonth}>
                                arrow_back
                            </span>
                            <h2>{selectedDate.toDateString()}</h2>
                            <span
                                className='material-icons'
                                onClick={this.nextMonth}>
                                arrow_forward
                            </span>
                            <button
                                onClick={() => changeDate(new Date())}
                                className={styles.todayButton}>
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
