import React from 'react';
import axios from 'axios';
import UserContext from '../userContext';
import Message from '../message';
import {
    getDateFromHHMM,
    getDateFromYYYMMDD,
    getHHMMFromDate,
    getYYYYMMDDFromDate,
} from '../../utils/date';
import styles from './lectureForm.module.css';

export default class EditLecture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.calendarContext.selectedLecture.title,
            course: this.props.calendarContext.selectedLecture.course,
            room: this.props.calendarContext.selectedLecture.room,
            date: getYYYYMMDDFromDate(
                new Date(this.props.calendarContext.selectedLecture.start)
            ),
            start: getHHMMFromDate(
                new Date(this.props.calendarContext.selectedLecture.start)
            ),
            end: getHHMMFromDate(
                new Date(this.props.calendarContext.selectedLecture.end)
            ),
            message: '',
        };

        this.changeTitle = this.changeTitle.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.changeStart = this.changeStart.bind(this);
        this.changeEnd = this.changeEnd.bind(this);
        this.submitLectureForm = this.submitLectureForm.bind(this);
        this.deleteLecutre = this.deleteLecutre.bind(this);
    }

    static contextType = UserContext;

    changeTitle(event) {
        this.setState({ title: event.target.value });
    }

    changeCourse(event) {
        this.setState({ course: event.target.value });
    }

    changeRoom(event) {
        this.setState({ room: event.target.value });
    }

    changeDate(event) {
        this.setState({ date: event.target.value });
    }

    changeStart(event) {
        this.setState({ start: event.target.value });
    }

    changeEnd(event) {
        this.setState({ end: event.target.value });
    }

    async submitLectureForm(event) {
        event.preventDefault();
        this.setState({ message: '' });
        const { apiUrl, token, lectures, changeLectures } = this.context;
        const { selectedLecture, showForm } = this.props.calendarContext;

        try {
            const start = getDateFromHHMM(
                this.state.start,
                getDateFromYYYMMDD(this.state.date)
            );
            const end = getDateFromHHMM(
                this.state.end,
                getDateFromYYYMMDD(this.state.date)
            );

            const res = await axios.patch(
                `${apiUrl}/lectures/${selectedLecture._id}`,
                {
                    title: this.state.title,
                    course: this.state.course,
                    room: this.state.room,
                    start,
                    end,
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const modifiedLectures = lectures;
            const index = modifiedLectures.findIndex(
                (lecture) => lecture._id === selectedLecture._id
            );
            modifiedLectures[index] = res.data;
            changeLectures(modifiedLectures);

            showForm();
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    async deleteLecutre() {
        this.setState({ message: '' });
        const { apiUrl, token, lectures, changeLectures } = this.context;
        const { selectedLecture, showForm } = this.props.calendarContext;

        try {
            await axios.delete(`${apiUrl}/lectures/${selectedLecture._id}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            });
            const modifiedLectures = lectures.filter(
                (lecture) => lecture._id !== selectedLecture._id
            );
            changeLectures(modifiedLectures);
            showForm();
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <form
                    onSubmit={this.submitLectureForm}
                    className={styles.lectureForm}>
                    <Message value={this.state.message} />
                    <div>
                        <label>
                            Title:
                            <input
                                type='text'
                                value={this.state.title}
                                onChange={this.changeTitle}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <p>
                            Semester:{' '}
                            {this.props.calendarContext.selectedSemester.name}
                        </p>
                    </div>
                    <div>
                        <label>
                            Date:
                            <input
                                type='date'
                                value={this.state.date}
                                onChange={this.changeDate}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Start:
                            <input
                                type='time'
                                min={'08:00'}
                                max={'18:00'}
                                value={this.state.start}
                                onChange={this.changeStart}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            End:
                            <input
                                type='time'
                                min={'08:00'}
                                max={'18:00'}
                                value={this.state.end}
                                onChange={this.changeEnd}
                                required
                            />
                        </label>
                    </div>
                    <UserContext.Consumer>
                        {({ courses, rooms }) => (
                            <>
                                <div>
                                    <label>
                                        Course:
                                        <select
                                            value={this.state.course}
                                            onChange={this.changeCourse}
                                            required>
                                            {courses.map((course) => (
                                                <option
                                                    key={course._id}
                                                    value={course._id}>
                                                    {course.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        Room:
                                        <select
                                            value={this.state.room}
                                            onChange={this.changeRoom}
                                            required>
                                            {rooms.map((room) => (
                                                <option
                                                    key={room._id}
                                                    value={room._id}>
                                                    {room.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            </>
                        )}
                    </UserContext.Consumer>
                    <div>
                        <button type='submit'>Save</button>
                        <span
                            className={`material-icons ${styles.deleteIcon}`}
                            onClick={this.deleteLecutre}>
                            delete
                        </span>
                    </div>
                </form>
            </>
        );
    }
}
