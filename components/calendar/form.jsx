import React from 'react';
import AppContext from '../appContext';
import Message from '../message';
import axios from 'axios';
import styles from './form.module.css';

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            rooms: [],
            title: '',
            selectedRoom: undefined,
            selectedCourse: undefined,
            start: undefined,
            end: undefined,
            message: '',
        };

        this.changeTitle = this.changeTitle.bind(this);
        this.changeSelectedRoom = this.changeSelectedRoom.bind(this);
        this.changeSelectedCourse = this.changeSelectedCourse.bind(this);
        this.changeStart = this.changeStart.bind(this);
        this.changeEnd = this.changeEnd.bind(this);
        this.submitLectureForm = this.submitLectureForm.bind(this);
    }

    static contextType = AppContext;

    componentDidMount() {
        const { apiUrl, token } = this.context;

        axios
            .get(`${apiUrl}/rooms`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                const date = this.props.date;
                const startTime = date.toTimeString().split(' ')[0];
                // end time will be in one hour
                date.setHours(date.getHours() + 1);
                const endTime = date.toTimeString().split(' ')[0];

                const rooms = res.data;
                this.setState({
                    rooms: rooms,
                    selectedRoom: rooms[0] ? rooms[0]._id : undefined,
                    selectedCourse: this.context.user.courses[0]
                        ? this.context.user.courses[0]._id
                        : undefined,
                    start: startTime,
                    end: endTime,
                });
            })
            .catch((err) => {
                this.setState({ message: err.response.data });
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    changeTitle(event) {
        this.setState({ title: event.target.value });
    }

    changeSelectedRoom(event) {
        this.setState({ selectedRoom: event.target.value });
    }

    changeSelectedCourse(event) {
        this.setState({ selectedCourse: event.target.value });
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
        const { apiUrl, token } = this.context;
        const date = this.props.date;

        /**
         * Parses a time string into a javascript date object.
         * The day, month and year will be the same as the day selected by the user.
         * @param {string} time - A time string (hh:mm:ss)
         */
        function getDateFromTimeString(time) {
            const [hours, minutes, seconds] = time.split(':');
            // date has to be declared above, because this function cannot
            // access the 'this' keyword
            const parsedDate = new Date(date);
            parsedDate.setHours(hours);
            parsedDate.setMinutes(minutes);
            parsedDate.setSeconds(seconds);
            return parsedDate;
        }

        try {
            await axios.post(
                `${apiUrl}/lectures`,
                {
                    title: this.state.title,
                    course: this.state.selectedCourse,
                    room: this.state.selectedRoom,
                    start: getDateFromTimeString(this.state.start),
                    end: getDateFromTimeString(this.state.end),
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            this.props.onClose();
        } catch (err) {
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
                    {this.state.loading ? (
                        <p>fetching data</p>
                    ) : (
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
                                    min={'08:00:00'}
                                    max={'18:00:00'}
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
                                    min={'08:00:00'}
                                    max={'18:00:00'}
                                    value={this.state.end}
                                    onChange={this.changeEnd}
                                    required
                                />
                            </label>
                            <label>
                                Room:
                                <br />
                                <select
                                    value={this.state.selectedRoom}
                                    onChange={this.changeSelectedRoom}
                                    required>
                                    {this.state.rooms.map((room) => (
                                        <option key={room._id} value={room._id}>
                                            {room.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Course:
                                <br />
                                <select
                                    value={this.state.selectedCourse}
                                    onChange={this.changeSelectedCourse}
                                    required>
                                    {this.context.user.courses.map((course) => (
                                        <option
                                            key={course._id}
                                            value={course._id}>
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button type='submit'>Create</button>
                        </form>
                    )}
                </div>
            </div>
        );
    }
}
