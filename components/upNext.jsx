import React from 'react';
import UserContext from './userContext';
import styles from './upNext.module.css';

function getTimeStringFromDate(date) {
    const [hours, minutes] = date.toTimeString().split(' ')[0].split(':');
    return `${hours}:${minutes}`;
}

export default class UpNext extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEntries: '10',
        };

        this.changeShowEntries = this.changeShowEntries.bind(this);
    }

    changeShowEntries(event) {
        this.setState({ showEntries: event.target.value });
    }

    render() {
        return (
            <div className={styles.container}>
                <label>
                    Show entries:
                    <select
                        value={this.state.showEntries}
                        onChange={this.changeShowEntries}>
                        <option value='5'>5</option>
                        <option value='10'>10</option>
                        <option value='25'>25</option>
                        <option value='50'>50</option>
                    </select>
                </label>
                <UserContext.Consumer>
                    {({ lectures, rooms, courses, semesters }) =>
                        lectures.filter(
                            (lecture) =>
                                new Date(lecture.start).getTime() >
                                new Date().getTime()
                        ).length === 0 ? (
                            <div className={styles.lecture}>
                                {' '}
                                <h1>Nothing to do</h1>
                            </div>
                        ) : (
                            lectures
                                .filter(
                                    (lecture) =>
                                        new Date(lecture.start).getTime() >
                                        new Date().getTime()
                                )
                                .sort(
                                    (a, b) =>
                                        new Date(a.start).getTime() >
                                        new Date(b.start).getTime()
                                )
                                .slice(0, this.state.showEntries)
                                .map((lecture) => (
                                    <div
                                        key={lecture._id}
                                        className={styles.lecture}>
                                        <h1>{lecture.title}</h1>
                                        <span>Date:</span>
                                        <span>
                                            {new Date(
                                                lecture.start
                                            ).toDateString()}
                                        </span>
                                        <span>Time:</span>
                                        <span>
                                            {getTimeStringFromDate(
                                                new Date(lecture.start)
                                            )}{' '}
                                            -{' '}
                                            {getTimeStringFromDate(
                                                new Date(lecture.end)
                                            )}
                                        </span>
                                        <span>Course:</span>
                                        <span>
                                            {
                                                courses.find(
                                                    (course) =>
                                                        course._id ===
                                                        lecture.course
                                                ).name
                                            }
                                        </span>
                                        <span>Room:</span>
                                        <span>
                                            {
                                                rooms.find(
                                                    (room) =>
                                                        room._id ===
                                                        lecture.room
                                                ).name
                                            }
                                        </span>
                                        <span>Semester:</span>
                                        <span>
                                            {
                                                semesters.find(
                                                    (semester) =>
                                                        semester._id ===
                                                        lecture.semester
                                                ).name
                                            }
                                        </span>
                                    </div>
                                ))
                        )
                    }
                </UserContext.Consumer>
            </div>
        );
    }
}
