import CourseForm from './adminPanel/courseForm';
import RoomForm from './adminPanel/roomForm';
import React from 'react';
import UserContext from './userContext';
import axios from 'axios';
import Course from './adminPanel/course';
import Room from './adminPanel/room';
import Message from './message';

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            courses: [],
            loading: true,
            message: '',
        };

        this.createCourse = this.createCourse.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
    }

    static contextType = UserContext;

    componentDidMount() {
        const { apiUrl, token } = this.context;

        Promise.all([
            axios.get(`${apiUrl}/rooms`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            }),
            axios.get(`${apiUrl}/courses`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            }),
        ])
            .then((res) => {
                this.setState({
                    rooms: res[0].data,
                    courses: res[1].data,
                });
            })
            .catch((err) => {
                if (err.response.status !== 404) {
                    this.setState({ message: err.response.data });
                } else {
                    this.setState({ message: 'No data found!' });
                }
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    createCourse(course) {
        const updatedCourses = this.state.courses;
        updatedCourses.push(course);
        this.setState({ courses: updatedCourses });
    }

    async changeCourse(id, name) {
        const { apiUrl, token } = this.context;

        this.setState({ message: '' });
        try {
            const res = await axios.patch(
                `${apiUrl}/courses/${id}`,
                {
                    name,
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const courseIndex = this.state.courses.findIndex(
                (course) => course._id === id
            );
            const updatedCourses = this.state.courses;
            updatedCourses[courseIndex] = res.data;
            this.setState({ courses: updatedCourses });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    async deleteCourse(id) {
        const { apiUrl, token } = this.context;

        this.setState({ message: '' });
        try {
            await axios.delete(`${apiUrl}/courses/${id}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            });
            const courseId = this.state.courses.findIndex(
                (course) => course._id === id
            );
            const newCourses = this.state.courses;
            delete newCourses[courseId];
            this.setState({ courses: newCourses });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    createRoom(room) {
        const updatedRooms = this.state.rooms;
        updatedRooms.push(room);
        this.setState({ rooms: updatedRooms });
    }

    async changeRoom(id, name) {
        const { apiUrl, token } = this.context;

        this.setState({ message: '' });
        try {
            const res = await axios.patch(
                `${apiUrl}/rooms/${id}`,
                {
                    name,
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const roomIndex = this.state.rooms.findIndex(
                (room) => room._id === id
            );
            const updatedRooms = this.state.rooms;
            updatedRooms[roomIndex] = res.data;
            this.setState({ rooms: updatedRooms });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    async deleteRoom(id) {
        const { apiUrl, token } = this.context;

        this.setState({ message: '' });
        try {
            await axios.delete(`${apiUrl}/rooms/${id}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            });
            const roomId = this.state.rooms.findIndex(
                (room) => room._id === id
            );
            const newRooms = this.state.rooms;
            delete newRooms[roomId];
            this.setState({ rooms: newRooms });
        } catch (err) {
            console.log(err);

            this.setState({ message: err.response.data });
        }
    }

    render() {
        const rooms = this.state.rooms.map((room) => (
            <Room
                key={room._id}
                value={room}
                onChange={this.changeRoom}
                onDelete={this.deleteRoom}
            />
        ));

        const courses = this.state.courses.map((course) => (
            <Course
                key={course._id}
                value={course}
                onChange={this.changeCourse}
                onDelete={this.deleteCourse}
            />
        ));

        return (
            <>
                {this.state.loading ? (
                    <p>Fetching data...</p>
                ) : (
                    <div>
                        <div>
                            <RoomForm onSubmit={this.createRoom} />
                        </div>
                        <div>
                            <CourseForm onSubmit={this.createCourse} />
                        </div>
                        <div>
                            rooms:
                            <ul>{rooms}</ul>
                            courses:
                            <ul>{courses}</ul>
                        </div>
                    </div>
                )}
                <Message value={this.state.message} />
            </>
        );
    }
}
