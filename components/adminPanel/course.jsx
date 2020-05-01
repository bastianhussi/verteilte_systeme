import React from 'react';
import axios from 'axios';
import UserContext from '../userContext';
import Message from '../message';
import styles from '../adminPanel.module.css';

export default class Course extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.value.name,
            color: this.props.value.color,
            showEditing: false,
            message: '',
        };

        this.changeName = this.changeName.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.changeShowEditing = this.changeShowEditing.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
    }

    static contextType = UserContext;

    changeName(event) {
        this.setState({ name: event.target.value });
    }

    changeColor(event) {
        this.setState({ color: event.target.value });
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
                { name: this.state.name, color: this.state.color },
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
            <div className={styles.item}>
                <Message value={this.state.message} />
                {this.state.showEditing ? (
                    <form
                        onSubmit={this.changeCourse}
                        className={styles.itemForm}>
                        <div>
                            <label>
                                Name:
                                <input
                                    type='text'
                                    value={this.state.name}
                                    onChange={this.changeName}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Color:
                                <input
                                    type='color'
                                    value={this.state.color}
                                    onChange={this.changeColor}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <button
                                onClick={() =>
                                    this.setState({ showEditing: false })
                                }>
                                cancel
                            </button>
                            <button type='submit' className={styles.saveButton}>
                                Save
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <span>{this.state.name}</span>
                        <span style={{ backgroundColor: this.state.color }}>
                            {this.state.color}
                        </span>
                        <span
                            className={`material-icons ${styles.itemIcon}`}
                            onClick={this.deleteCourse}>
                            delete
                        </span>
                        <span
                            className={`material-icons ${styles.itemIcon}`}
                            onClick={this.changeShowEditing}>
                            edit
                        </span>
                    </div>
                )}
            </div>
        );
    }
}
