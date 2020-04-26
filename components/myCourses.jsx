import React from 'react';
import UserContext from './userContext';
import axios from 'axios';
import Message from './message';

export default class MyCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCourse: undefined,
            message: '',
        };

        this.getAvailableCourses = this.getAvailableCourses.bind(this);
        this.changeSelectedCourse = this.changeSelectedCourse.bind(this);
        this.submitAddCourseForm = this.submitAddCourseForm.bind(this);
        this.submitDeleteCourseForm = this.submitDeleteCourseForm.bind(this);
    }

    static contextType = UserContext;

    componentDidMount() {
        const availableCourses = this.getAvailableCourses();
        this.setState({
            selectedCourse: availableCourses[0]
                ? availableCourses[0]._id
                : undefined,
        });
    }

    getAvailableCourses() {
        const { courses, user } = this.context;
        return courses.filter(
            (course) =>
                !user.courses.find(
                    (userCourse) => userCourse._id === course._id
                )
        );
    }

    changeSelectedCourse(event) {
        this.setState({ selectedCourse: event.target.value });
    }

    async submitAddCourseForm(event) {
        event.preventDefault();
        this.setState({ message: '' });

        const { apiUrl, token, user, courses, changeUser } = this.context;

        try {
            await axios.patch(
                `${apiUrl}/users/${user._id}`,
                {
                    courses: [
                        ...user.courses.map((course) => (course = course._id)),
                        this.state.selectedCourse,
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newCourse = courses.find(
                (course) => course._id === this.state.selectedCourse
            );

            changeUser(
                Object.assign(user, {
                    courses: [...user.courses, newCourse],
                })
            );

            const availableCourses = this.getAvailableCourses();
            this.setState({
                selectedCourse: availableCourses[0]
                    ? availableCourses[0]._id
                    : undefined,
            });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    async submitDeleteCourseForm(id) {
        this.setState({ message: '' });

        const { apiUrl, token, user, changeUser, courses } = this.context;

        const modifiedUserCourses = user.courses.filter(
            (course) => course === id
        );

        try {
            await axios.patch(
                `${apiUrl}/users/${user._id}`,
                {
                    courses: modifiedUserCourses.map(
                        (course) => (course = course._id)
                    ),
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            changeUser(Object.assign(user, { courses: modifiedUserCourses }));

            const availableCourses = this.getAvailableCourses();
            this.setState({ selectedCourse: availableCourses[0]._id });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <Message value={this.state.message} />
                <UserContext.Consumer>
                    {({ user, courses }) => (
                        <div>
                            <form onSubmit={this.submitAddCourseForm}>
                                <label>
                                    Add a new course to your list:
                                    <select
                                        value={this.state.selectedCourse}
                                        onChange={this.changeSelectedCourse}>
                                        {this.getAvailableCourses().map(
                                            ({ _id, name }) => (
                                                <option value={_id} key={_id}>
                                                    {name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </label>
                                <button type='submit'>Submit</button>
                            </form>
                            <div>
                                <ul>
                                    {user.courses.map(({ _id, name }) => (
                                        <li key={_id}>
                                            {name}
                                            <span
                                                className='material-icons'
                                                onClick={() =>
                                                    this.submitDeleteCourseForm(
                                                        _id
                                                    )
                                                }>
                                                delete
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </UserContext.Consumer>
            </>
        );
    }
}
