import React, { useContext } from 'react';
import UserContext from '../userContext';
import CalendarContext from '../calendarContext';
import Message from '../message';
import axios from 'axios';
import styles from './form.module.css';

export default class Form extends React.Component {
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
        this.changeStart = this.changeStart.bind(this);
        this.changeEnd = this.changeEnd.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.getDateFromTimeString = this.getDateFromTimeString.bind(this);
        this.getTimeStringFromDate = this.getTimeStringFromDate.bind(this);
        this.submitLectureForm = this.submitLectureForm.bind(this);
    }

    static contextType = UserContext;

    componentDidMount() {
        const { date } = this.props;
        const { courses, rooms } = this.context;
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(end.getHours() + 1);
        this.setState({
            start: this.getTimeStringFromDate(start),
            end: this.getTimeStringFromDate(end),
            course: courses[0] ? courses[0]._id : undefined,
            room: rooms[0] ? rooms[0]._id : undefined,
        });
    }

    changeTitle(event) {
        this.setState({ title: event.target.value });
    }

    changeRoom(event) {
        this.setState({ selectedRoom: event.target.value });
    }

    changeCourse(event) {
        this.setState({ selectedCourse: event.target.value });
    }

    changeStart(event) {
        this.setState({ start: event.target.value });
    }

    changeEnd(event) {
        this.setState({ end: event.target.value });
    }

    getDateFromTimeString(time) {
        const [hours, minutes] = time.split(':');
        const parsedDate = new Date(this.props.date);
        parsedDate.setHours(hours);
        parsedDate.setMinutes(minutes);
        parsedDate.setSeconds(0);
        parsedDate.setMilliseconds(0);
        return parsedDate;
    }

    getTimeStringFromDate(date) {
        const [hours, minutes] = date.toTimeString().split(' ')[0].split(':');
        return `${hours}:${minutes}`;
    }

    async submitLectureForm(event) {
        event.preventDefault();
        this.setState({ message: '' });
        const { apiUrl, token, lectures, changeLectures } = this.context;

        try {
            const res = await axios.post(
                `${apiUrl}/lectures`,
                {
                    title: this.state.title,
                    course: this.state.course,
                    room: this.state.room,
                    start: this.getDateFromTimeString(this.state.start),
                    end: this.getDateFromTimeString(this.state.end),
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            changeLectures([...lectures, res.data]);
            this.props.onClose();
        } catch (err) {
            console.log(err);
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <div className={styles.lightbox}>
                <span
                    className={`material-icons ${styles.closeButton}`}
                    onClick={this.props.onClose}>
                    close
                </span>
                <div>
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
                        <button onClick={this.props.onClose}>Cancel</button>
                    </form>
                </div>
            </div>
        );
    }
}
