import React from 'react';
import UserContext from '../userContext';
import axios from 'axios';
import Message from '../message';

export default class CourseForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            message: '',
        };

        this.changeName = this.changeName.bind(this);
        this.createCourse = this.createCourse.bind(this);
    }

    static contextType = UserContext;

    changeName(event) {
        this.setState({ name: event.target.value });
    }

    async createCourse(event) {
        event.preventDefault();
        this.setState({ message: '' });
        const { token, apiUrl, courses, changeCourses } = this.context;
        try {
            const res = await axios.post(
                `${apiUrl}/courses`,
                {
                    name: this.state.name,
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            changeCourses([...courses, res.data]);
            this.setState({ course: '' });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <div>
                <Message value={this.state.message} />
                <form onSubmit={this.createCourse}>
                    <label>
                        Course:
                        <br />
                        <input
                            type='text'
                            value={this.state.name}
                            onChange={this.changeName}
                            required
                        />
                    </label>
                    <button type='submit'>Create</button>
                </form>
            </div>
        );
    }
}
