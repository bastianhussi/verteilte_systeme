import React from 'react';
import UserContext from './userContext';
import CalendarContext from './calendarContext';
import { getHHMMFromDate } from '../utils/date';
import styles from './upNext.module.css';

/**
 * This component displays the next X lectures.
 * The number of lectures to show can be set by the user.
 */
export default class UpNext extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEntries: '10',
        };

        this.changeShowEntries = this.changeShowEntries.bind(this);
    }

    static contextType = CalendarContext;

    changeShowEntries(event) {
        this.setState({ showEntries: event.target.value });
    }

    /**
     * Rendering a select element with all the lecutes below.
     * To get all the lectures the UserContext is beeing consumed.
     */
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
                            // Display in case that now lecutes exist.
                            <div className={styles.lecture}>
                                {' '}
                                <h1>Nothing to do</h1>
                            </div>
                        ) : (
                            // filter out lectures in the past, sort the array and slice it to
                            // fit the selected number of entries.
                            // After that for each remaining item of the array a div is beeing created.
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
                                            {getHHMMFromDate(
                                                new Date(lecture.start)
                                            )}{' '}
                                            -{' '}
                                            {getHHMMFromDate(
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
