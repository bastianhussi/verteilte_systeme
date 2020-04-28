import React from 'react';
import UserContext from './userContext';

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
            <>
                <div>
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
                </div>
                <UserContext.Consumer>
                    {({ lectures, rooms, courses, semesters }) =>
                        lectures
                            .filter(
                                (lecture) =>
                                    new Date(lecture.start).getTime() <
                                    new Date().getTime()
                            )
                            .sort(
                                (a, b) =>
                                    new Date(a.start).getTime() >
                                    new Date(b.start).getTime()
                            )
                            .slice(0, this.state.showEntries)
                            .map((lecture) => (
                                <>
                                    <div key={lecture._id}>
                                        <p>Title: {lecture.title}</p>
                                        <p>
                                            Date:{' '}
                                            {new Date(
                                                lecture.start
                                            ).toDateString()}
                                        </p>
                                        <p>
                                            {getTimeStringFromDate(
                                                new Date(lecture.start)
                                            )}{' '}
                                            -{' '}
                                            {getTimeStringFromDate(
                                                new Date(lecture.end)
                                            )}
                                        </p>
                                        <p>
                                            Room:
                                            {
                                                rooms.find(
                                                    (room) =>
                                                        room._id ===
                                                        lecture.room
                                                ).name
                                            }
                                        </p>
                                        <p>
                                            Course:
                                            {
                                                courses.find(
                                                    (course) =>
                                                        course._id ===
                                                        lecture.course
                                                ).name
                                            }
                                        </p>
                                        <p>
                                            Semester:
                                            {
                                                semesters.find(
                                                    (semester) =>
                                                        semester._id ===
                                                        lecture.semester
                                                ).name
                                            }
                                        </p>
                                    </div>
                                    <style jsx>{`
                                        div {
                                            border: solid 2px black;
                                            margin-bottom: 2rem;
                                        }
                                    `}</style>
                                </>
                            ))
                    }
                </UserContext.Consumer>
            </>
        );
    }
}
