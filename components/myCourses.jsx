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

        this.changeSelectedCourse = this.changeSelectedCourse.bind(this);
        this.submitAddCourseForm = this.submitAddCourseForm.bind(this);
        this.submitDeleteCourseForm = this.submitDeleteCourseForm.bind(this);
    }

    static contextType = UserContext;

    componentDidMount() {
        const { courses } = this.context;
        this.setState({
            selectedCourse: courses[0] ? courses[0]._id : undefined,
        });
    }

    changeSelectedCourse(event) {
        this.setState({ selectedCourse: event.target.value });
    }

    async submitAddCourseForm(event) {
        event.preventDefault();
        this.setState({ message: '' });

        const {
            apiUrl,
            token,
            user,
            courses,
            changeUser,
            changeCourses,
        } = this.context;

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

            // TODO: improve performance
            const modifiedCourses = courses.filter(
                (course) => course._id === this.state.selectedCourse
            );

            changeUser(
                Object.assign(user, {
                    courses: [...user.courses, newCourse],
                })
            );
            changeCourses(modifiedCourses);

            this.setState({
                selectedCourse: modifiedCourses[0]
                    ? modifiedCourses[0]._id
                    : undefined,
            });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    async submitDeleteCourseForm(deletedCourse) {
        this.setState({ message: '' });

        const {
            apiUrl,
            token,
            user,
            changeUser,
            courses,
            changeCourses,
        } = this.context;

        const modifiedUserCourses = user.courses.filter(
            (course) => course === deletedCourse._id
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
            changeCourses([...courses, deletedCourse]);

            this.setState({ selectedCourse: this.context.courses[0]._id });
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
                                        {courses.map(({ _id, name }) => (
                                            <option value={_id} key={_id}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <button type='submit'>Submit</button>
                            </form>
                            <div>
                                <ul>
                                    {user.courses.map((course) => (
                                        <li key={course._id}>
                                            {course.name}
                                            <span
                                                className='material-icons'
                                                onClick={() =>
                                                    this.submitDeleteCourseForm(
                                                        course
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
