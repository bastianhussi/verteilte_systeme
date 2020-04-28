import React from 'react';
import UserContext from '../userContext';
import Message from '../message';
import axios from 'axios';
import styles from './createLecture.module.css';
import { getHHMMFromDate, getDateFromHHMM } from '../../utils/date';

export default class CreateLecture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            start: '08:00:00',
            end: '09:00:00',
            course: undefined,
            room: undefined,
            message: '',
        };

        this.changeTitle = this.changeTitle.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.changeStart = this.changeStart.bind(this);
        this.changeEnd = this.changeEnd.bind(this);
        this.submitLectureForm = this.submitLectureForm.bind(this);
    }

    static contextType = UserContext;

    componentDidMount() {
        const { selectedDate } = this.props.calendarContext;
        const { courses, rooms } = this.context;

        const start = new Date(selectedDate);
        const end = new Date(selectedDate);
        end.setHours(end.getHours() + 1);

        this.setState({
            start: getHHMMFromDate(start),
            end: getHHMMFromDate(end),
            course: courses[0] ? courses[0]._id : undefined,
            room: rooms[0] ? rooms[0]._id : undefined,
        });
    }

    changeTitle(event) {
        this.setState({ title: event.target.value });
    }

    changeCourse(event) {
        this.setState({ course: event.target.value });
    }

    changeRoom(event) {
        this.setState({ room: event.target.value });
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
        const { selectedSemester, showForm } = this.props.calendarContext;
        try {
            const res = await axios.post(
                `${apiUrl}/lectures`,
                {
                    title: this.state.title,
                    semester: selectedSemester._id,
                    course: this.state.course,
                    room: this.state.room,
                    start: getDateFromHHMM(
                        this.state.start,
                        this.props.calendarContext.selectedDate
                    ),
                    end: getDateFromHHMM(
                        this.state.end,
                        this.props.calendarContext.selectedDate
                    ),
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            changeLectures([...lectures, res.data]);
            showForm();
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <Message value={this.state.message} />
                <form
                    className={styles.lectureForm}
                    onSubmit={this.submitLectureForm}>
                    <label>
                        Title:
                        <br />
                        <input
                            type='text'
                            value={this.state.title}
                            onChange={this.changeTitle}
                            required
                        />
                    </label>
                    <p>
                        Semester:{' '}
                        {this.props.calendarContext.selectedSemester.name}
                    </p>
                    <label>
                        Start:
                        <br />
                        <input
                            type='time'
                            min={'08:00'}
                            max={'18:00'}
                            value={this.state.start}
                            onChange={this.changeStart}
                            required
                        />
                    </label>
                    <label>
                        End:
                        <br />
                        <input
                            type='time'
                            min={'08:00'}
                            max={'18:00'}
                            value={this.state.end}
                            onChange={this.changeEnd}
                            required
                        />
                    </label>
                    <UserContext.Consumer>
                        {({ courses, rooms }) => (
                            <>
                                <label>
                                    Course:
                                    <br />
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
                                <label>
                                    Room:
                                    <br />
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
                            </>
                        )}
                    </UserContext.Consumer>
                    <button type='submit'>Create</button>
                </form>
            </>
        );
    }
}
