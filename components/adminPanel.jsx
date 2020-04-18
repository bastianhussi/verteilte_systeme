import React from 'react';
import AppContext from './appContext';
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
            message: ''
        };

        this.changeCourse = this.changeCourse.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
    }

    static contextType = AppContext;

    componentDidMount() {
        const { apiUrl, token } = this.context;

        Promise.all([
            axios.get(`${apiUrl}/rooms`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
            }),
            axios.get(`${apiUrl}/courses`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
            })
        ]).then(res => {
            this.setState({
                rooms: res[0].data,
                courses: res[1].data,
            });
        }).catch(err => {
            this.setState({ message: err.response.data });
        }).finally(() => {
            this.setState({ loading: false });
        });
    }

    async changeCourse(id, name) {
        const { apiUrl, token } = this.context;

        this.setState({ message: '' });
        try {
            const res = await axios.patch(`${apiUrl}/courses/${id}`, {
                name
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
            });
            const courseIndex = this.state.courses.indexOf(course => course._id === id);
            const newCourses = this.state.courses;
            newCourses[courseIndex] = res.data;
            this.setState({ courses: newCourses });
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
                    'Authorization': `Bearer ${token}`
                },
            });
            const courseId = this.state.courses.findIndex(course => course._id === id);
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
            const res = await axios.patch(`${apiUrl}/rooms/${id}`, {
                name
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
            });
            const roomIndex = this.state.rooms.indexOf(room => room._id === id);
            const newRooms = this.state.rooms;
            newRooms[roomIndex] = res.data;
            this.setState({ rooms: newRooms });
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
                    'Authorization': `Bearer ${token}`
                },
            });
            const roomId = this.state.rooms.findIndex(room => room._id === id);
            const newRooms = this.state.rooms;
            delete newRooms[roomId];
            this.setState({ rooms: newRooms });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {

        const rooms = this.state.rooms.map(room =>
            <Room key={room._id} value={room} onChange={this.changeRoom} onDelete={this.deleteRoom} />
        );
        const courses = this.state.courses.map(course =>
            <Course key={course._id} value={course} onChange={this.changeCourse} onDelete={this.deleteCourse} />
        );

        return (
            <>
                {this.state.loading ? (<p>Fetching data...</p>) : (
                    <div>
                        rooms:
                        <ul>
                            {rooms}
                        </ul>
                        courses:
                        <ul>
                            {courses}
                        </ul>
                    </div>
                )}
                <Message value={this.state.message} />
            </>
        );
    }
}