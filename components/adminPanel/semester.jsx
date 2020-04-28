import React from 'react';
import axios from 'axios';
import UserContext from '../userContext';
import Message from '../message';

function getTimeStringFromDate(date) {
    return date.toISOString().split('T')[0];
}

export default class Semester extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.value.name,
            start: getTimeStringFromDate(new Date(this.props.value.start)),
            end: getTimeStringFromDate(new Date(this.props.value.end)),
            showEditing: false,
            message: '',
        };

        this.changeName = this.changeName.bind(this);
        this.changeStart = this.changeStart.bind(this);
        this.changeEnd = this.changeEnd.bind(this);
        this.changeShowEditing = this.changeShowEditing.bind(this);
        this.changeSemster = this.changeSemster.bind(this);
        this.deleteSemester = this.deleteSemester.bind(this);
    }

    static contextType = UserContext;

    changeName(event) {
        this.setState({ name: event.target.value });
    }

    changeStart(event) {
        this.setState({ start: event.target.value });
    }

    changeEnd(event) {
        this.setState({ end: event.target.value });
    }

    changeShowEditing() {
        this.setState({ showEditing: !this.state.showEditing });
    }

    async changeSemster(event) {
        event.preventDefault();
        const { apiUrl, token, semesters, changeSemesters } = this.context;
        const { value } = this.props;

        try {
            const res = await axios.patch(
                `${apiUrl}/semesters/${value._id}`,
                {
                    name: this.state.name,
                    start: this.state.start,
                    end: this.state.end,
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const modifiedSemesters = semesters;
            const index = modifiedSemesters.indexOf({
                _id: value._id,
            });
            modifiedSemesters[index] = res.data;

            changeSemesters(modifiedSemesters);
            this.setState({ showEditing: false });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    async deleteSemester() {
        const { apiUrl, token, semesters, changeSemesters } = this.context;
        try {
            await axios.delete(`${apiUrl}/semesters/${this.props.value._id}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            });

            const modifiedSemesters = semesters.filter(
                (semester) => semester._id !== this.props.value._id
            );
            changeSemesters(modifiedSemesters);
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <Message value={this.state.message} />
                {this.state.showEditing ? (
                    <form onSubmit={this.changeSemster}>
                        <div>
                            <label>
                                Name:
                                <br />
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
                                Start:
                                <br />
                                <input
                                    type='date'
                                    value={this.state.start}
                                    onChange={this.changeStart}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                End:
                                <br />
                                <input
                                    type='date'
                                    value={this.state.end}
                                    onChange={this.changeEnd}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <button type='submit'>Save</button>
                            <button
                                onClick={() =>
                                    this.setState({ showEditing: false })
                                }>
                                cancel
                            </button>
                        </div>
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
                            onClick={this.deleteSemester}>
                            delete
                        </span>
                    </div>
                )}
            </>
        );
    }
}
