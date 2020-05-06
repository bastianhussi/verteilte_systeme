import React from 'react';
import CalendarContext from '../../calendarContext';
import { isToday, isSameDay } from '../../../utils/date';
import Lecture from './lecture';
import styles from './week.module.css';

export default class Hour extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = CalendarContext;

    render() {
        const { date, lectures } = this.props;
        const {
            selectedDate,
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
                                    : isSameDay(date, selectedDate)
                                    ? 'var(--pink)'
                                    : 'var(--background-color)'
                                : 'grey'};
                            height: 100%;
                            font-size: small;
                        }

                        div:hover {
                            cursor: ${isInSemester ? 'pointer' : 'not-allowed'};
                            ${isInSemester
                                ? 'background-color: var(--pink)'
                                : ''}
                        }
                    `}</style>
                </div>
            </div>
        );
    }
}
