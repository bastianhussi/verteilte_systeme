import React from 'react';
import axios from 'axios';
import UserContext from '../userContext';
import Message from '../message';

export default class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.value.name,
            showEditing: false,
            message: '',
        };

        this.changeName = this.changeName.bind(this);
        this.changeShowEditing = this.changeShowEditing.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
    }

    static contextType = UserContext;

    changeName(event) {
        this.setState({ name: event.target.value });
    }

    changeShowEditing() {
        this.setState({ showEditing: !this.state.showEditing });
    }

    async changeCourse(event) {
        event.preventDefault();
        const { apiUrl, token, courses, changeCourses } = this.context;
        const { value } = this.props;

        try {
            const res = await axios.patch(
                `${apiUrl}/courses/${value._id}`,
                { name: this.state.name },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const modifiedCourses = courses;
            const index = modifiedCourses.findIndex(
                (course) => course._id === value._id
            );
            modifiedCourses[index] = res.data;
            changeCourses(modifiedCourses);
            this.setState({ showEditing: false });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    async deleteCourse() {
        const { apiUrl, token, courses, changeCourses } = this.context;
        try {
            await axios.delete(`${apiUrl}/courses/${this.props.value._id}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            });

            const modifiedCourses = courses.filter(
                (course) => course._id !== this.props.value._id
            );
            changeCourses(modifiedCourses);
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <Message value={this.state.message} />
                {this.state.showEditing ? (
                    <form onSubmit={this.changeCourse}>
                        <input
                            type='text'
                            value={this.state.name}
                            onChange={this.changeName}
                            required
                        />
                        <br />
                        <button type='submit'>Save</button>
                        <button
                            onClick={() =>
                                this.setState({ showEditing: false })
                            }>
                            cancel
                        </button>
                    </form>
                ) : (
                    <div>
                        <span>{this.state.name}</span>
                        <span
                            className='material-icons'
                            onClick={this.changeShowEditing}>
                            edit
                        </span>
                        <span
                            className='material-icons'
                            onClick={this.deleteCourse}>
                            delete
                        </span>
                    </div>
                )}
            </>
        );
    }
}
