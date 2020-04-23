import React from 'react';
import AppContext from './appContext';
import axios from 'axios';
import Message from './message';

export default class MyCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            selectedCourse: '',
            courses: [],
            message: '',
        };

        this.changeSelectedCourse = this.changeSelectedCourse.bind(this);
        this.submitCourseForm = this.submitCourseForm.bind(this);
    }

    static contextType = AppContext;

    /**
     * Fetches courses from the api. Unfortunately this method has to be used,
     * because this is just a component and so cannot make use of getInitialProps.
     */
    componentDidMount() {
        const { user, apiUrl, token } = this.context;
        axios
            .get(`${apiUrl}/courses`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                // filters courses out that the user already selected.
                const courses = res.data.filter((course) => {
                    const result = user.courses.find(
                        (userCourse) => userCourse._id === course._id
                    );
                    return result ? false : true;
                });
                this.setState({
                    selectedCourse: courses.length > 0 ? courses[0]._id : '',
                    courses,
                });
            })
            .catch((err) => {
                if (err.response.status !== 404) {
                    this.setState({
                        message: err.response.data,
                    });
                }
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    changeSelectedCourse(event) {
        this.setState({ selectedCourse: event.target.value });
    }

    async submitCourseForm(event) {
        event.preventDefault();
        this.setState({ message: '' });

        const selectedCourse = this.state.courses.find(
            (course) => course._id === this.state.selectedCourse
        );
        const { apiUrl, token, user, changeUser } = this.context;
        try {
            const res = await axios.patch(
                `${apiUrl}/users/${user._id}`,
                {
                    courses: [...user.courses, selectedCourse],
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // remove this course from the list of courses
            const modifiedCourses = this.state.courses.filter(
                (course) => course._id !== this.state.selectedCourse
            );
            this.setState({
                selectedCourse:
                    modifiedCourses.length > 0 ? modifiedCourses[0]._id : '',
                courses: modifiedCourses,
            });

            // update the user
            changeUser(res.data);
        } catch (err) {
            console.log(err);
            this.setState({ message: err.response.data });
        }
    }

    async deleteCourse(id) {
        const { user, token, apiUrl, changeUser } = this.context;
        const deletedCourse = user.courses.find((course) => course._id === id);
        const modifiedCourses = user.courses.filter(
            (course) => course._id !== id
        );
        try {
            const res = await axios.patch(
                `${apiUrl}/users/${user._id}`,
                {
                    courses: modifiedCourses,
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            this.setState({
                courses: [...this.state.courses, deletedCourse],
            });
            this.setState({
                selectedCourse: this.state.courses[0]._id,
            });
            changeUser(res.data);
        } catch (err) {
            console.log(err);
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <Message value={this.state.message} />
                {this.state.loading ? (
                    <p>Fetching Data</p>
                ) : (
                    <AppContext.Consumer>
                        {({ user }) => (
                            <div>
                                <form onSubmit={this.submitCourseForm}>
                                    <label>
                                        Add a new course to your list:
                                        <select
                                            value={this.state.selectedCourse}
                                            onChange={
                                                this.changeSelectedCourse
                                            }>
                                            {this.state.courses.map(
                                                (course) => (
                                                    <option
                                                        value={course._id}
                                                        key={course._id}>
                                                        {course.name}
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
                                                        this.deleteCourse(_id)
                                                    }>
                                                    delete
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </AppContext.Consumer>
                )}
            </>
        );
    }
}
