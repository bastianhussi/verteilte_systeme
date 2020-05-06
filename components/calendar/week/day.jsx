import React from 'react';
import Hour from './hour';
import { getDayName } from '../../../utils/date';
import styles from './week.module.css';

export default class Day extends React.Component {
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
                    {`${this.props.date.getDate()}. ${getDayName(
                        this.props.date
                    )}`}
                </div>
                {getHours()}
            </div>
        );
    }
}
