import React from 'react';
import { getMonthDays, getDayName } from '../../../utils/date';
import Day from './day';
import styles from './month.module.css';

export default class Month extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { date, lectures } = this.props;

        function getHeader() {
            const header = [];
            for (let day = 1; day <= 7; day++) {
                const dayName = getDayName(
                    new Date(date.getFullYear(), date.getMonth(), day)
                );
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
            for (let day = 1; day <= getMonthDays(date); day++) {
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
