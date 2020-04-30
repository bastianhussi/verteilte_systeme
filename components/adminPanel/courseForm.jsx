import React from 'react';
import UserContext from '../userContext';
import Course from './course';
import axios from 'axios';
import Message from '../message';
import styles from '../adminPanel.module.css';

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
            this.setState({ name: '' });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <div className={styles.createForm}>
                    <Message value={this.state.message} />
                    <form onSubmit={this.createCourse}>
                        <div>
                            <label>
                                Course:
                                <input
                                    type='text'
                                    value={this.state.name}
                                    onChange={this.changeName}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <button
                                type='submit'
                                className={styles.createButton}>
                                Create
                            </button>
                        </div>
                    </form>
                </div>
                <div className={styles.separatorLine}/>
                <UserContext.Consumer>
                    {({ courses }) =>
                        courses.length === 0 ? (
                            <div>No courses yet</div>
                        ) : (
                            <div className={styles.course}>
                                {courses.map((course) => (
                                    <Course key={course._id} value={course} />
                                ))}
                            </div>
                        )
                    }
                </UserContext.Consumer>
            </>
        );
    }
}
