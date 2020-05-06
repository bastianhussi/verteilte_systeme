import React from 'react';
import Day from './day';
import styles from './week.module.css';

export default class Week extends React.Component {
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
