import React from 'react';
import CalendarContext from '../../calendarContext';
import UserContext from '../../userContext';
import MonthController from '../month/controller';
import Week from './week';
import styles from './week.module.css';

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
                                month view
                            </button>
                            <span
                                className='material-icons'
                                onClick={this.previousWeek}>
                                arrow_back
                            </span>
                            <h2>{selectedDate.toDateString()}</h2>
                            <span
                                className='material-icons'
                                onClick={this.nextWeek}>
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
