import React from 'react';
import AppContext from './appContext';
import axios from 'axios';
import Message from './message';

export default class MyCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            selectIndex: -1,
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
                if (user.courses.find(({ _id }) => _id === course._id)) {
                    courses.splice(index, 1);
                }
            });
            this.setState({ selectedCourse: courses ? 0 : -1, courses });
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

        const index = this.state.courses.findIndex(({ _id }) => _id === this.state.selectedCourse);
        const newCourse = this.state.courses[index];
        try {
            const res = await axios.patch(`${apiUrl}/users/${user._id}`, {
                courses: [...user.courses, newCourse]
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${token}`
                },
            });

            // remove this course from the list of courses
            const modifiedCourses = this.state.courses;
            modifiedCourses.splice(index, 1);
            this.setState({ selectedCourse: this.state.courses ? 0 : -1, courses: modifiedCourses });

            // update the user
            const modifiedUser = res.data;
            changeUser(modifiedUser);
        } catch (err) {
            console.log(err);
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <Message value={this.state.message} />
                {this.state.loading ? (<p>Fetching Data</p>) : (
                    <AppContext.Consumer>{
                        ({ user }) => (
                            <div>
                                <form onSubmit={this.submitCourseForm}>
                                    <label>
                                        Add a new course to your list:
                                    <select selectedIndex={this.state.selectIndex} onChange={this.changeSelectedCourse}>
                                            {this.state.courses.map(course => <option value={course._id} key={course._id}>{course.name}</option>)}
                                        </select>
                                    </label>
                                    <button type="submit">Submit</button>
                                </form>
                                <div>
                                    <ul>
                                        {user.courses.map(({_id, name}) => <li key={_id}>{name}</li>)}
                                    </ul>
                                </div>
                            </div>
                        )
                    }</AppContext.Consumer>
                )}
            </>
        );
    }
}
