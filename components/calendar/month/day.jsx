import React from 'react';
import CalendarContext from '../../calendarContext';
import WeekController from '../week/controller';
import { isToday } from '../../../utils/date';
import styles from './month.module.css';

export default class Day extends React.Component {
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

        let backgroundColor = isInSemester
            ? isToday(this.props.date)
                ? 'var(--yellow)'
                : 'var(--background-color)'
            : 'grey';

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
                    {this.props.lecture ? (
                        <span
                            className={`material-icons ${styles.lectureIcon}`}>
                            event
                        </span>
                    ) : (
                        <></>
                    )}
                </div>
                <style jsx>{`
                    div {
                        background-color: ${backgroundColor};
                    }

                    div:hover {
                        cursor: ${isInSemester ? 'pointer' : 'not-allowed'};
                        ${isInSemester ? 'background-color: var(--pink)' : ''}
                    }
                `}</style>
            </>
        );
    }
}
