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
            message: '',
        };

        this.changeCourse = this.changeCourse.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
    }

    static contextType = UserContext;

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
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <UserContext.Consumer>
                {({ rooms, courses }) => (
                    <>
                        <Message value={this.state.message} />
                        <div>
                            <div>
                                <RoomForm />
                            </div>
                            <div>
                                <CourseForm />
                            </div>
                            <div>
                                rooms:
                                <ul>
                                    {rooms.map((room) => (
                                        <Room
                                            key={room._id}
                                            value={room}
                                            onChange={this.changeRoom}
                                            onDelete={this.deleteRoom}
                                        />
                                    ))}
                                </ul>
                                courses:
                                <ul>
                                    {courses.map((course) => (
                                        <Course
                                            key={course._id}
                                            value={course}
                                            onChange={this.changeCourse}
                                            onDelete={this.deleteCourse}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </>
                )}
            </UserContext.Consumer>
        );
    }
}
