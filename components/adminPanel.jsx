import React from 'react';
import AppContext from './appContext';
import axios from 'axios';
import Course from './adminPanel/course';
import Room from './adminPanel/room';

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            courses: [],
            loading: true,
            message: ''
        };
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

    render() {

        const rooms = this.state.rooms.map(room =>
            <Room value={room} onSubmit={() => console.log('test')} />
        );
        const courses = this.state.courses.map(course =>
            <Course value={course} onSubmit={() => console.log('test')} />
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
                {this.state.message ? (<p>{this.state.message}</p>) : (<></>)}
            </>
        );
    }
}