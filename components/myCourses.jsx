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

    componentDidMount() {
        const { user, apiUrl, token } = this.context;
        axios.get(`${apiUrl}/courses`, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
        }).then(res => {
            const courses = res.data;
            courses.forEach((course, index) => {
                if (user.courses.find(userCourse => userCourse === course._id)) {
                    courses.splice(index, 1);
                }
            });
            this.setState({ selectedCourse: courses[0]._id, courses });
        }).catch(err => {
            if (err.response.status !== 404) {
                this.setState({ message: err.response.data });
            }
        }).finally(() => {
            this.setState({ loading: false });
        });
    }

    changeSelectedCourse(event) {
        this.setState({ selectedCourse: event.target.value });
    }

    async submitCourseForm(event) {
        event.preventDefault();
        this.setState({ message: '' });

        const { apiUrl, token, user, changeUser } = this.context;

        try {
            const res = await axios.patch(`${apiUrl}/users/${user._id}`, {
                courses: [...user.courses, this.state.selectedCourse]
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
            });

            // remove this course from the list of courses
            const modifiedCourses = this.state.courses;
            const index = modifiedCourses.findIndex((course) => {
                course._id === this.state.selectedCourse;
            })
            modifiedCourses.splice(index, 1);
            this.setState({ selectedCourse: modifiedCourses[0]._id, courses: modifiedCourses });

            // update the user
            const modifiedUser = res.data;
            changeUser(modifiedUser);
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        const courses = this.state.courses.map(course => {
            return <option value={course._id} key={course._id}>{course.name}</option>;
        });

        return (
            <>
                {this.state.loading ? (<p>Fetching Data</p>) : (
                    <AppContext.Consumer>{
                        ({ user }) => (
                            <form onSubmit={this.submitCourseForm}>
                                <label>
                                    Add a new course to your list:
                                    <select value={this.state.selectedCourse} onChange={this.changeSelectedCourse}>
                                        {courses}
                                    </select>
                                </label>
                                <button type="submit">Submit</button>
                            </form>
                        )
                    }</AppContext.Consumer>
                )}
                <Message value={this.state.message} />
            </>
        );
    }
}
