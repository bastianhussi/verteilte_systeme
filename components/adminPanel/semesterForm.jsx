import React from 'react';
import UserContext from '../userContext';
import axios from 'axios';
import Message from '../message';

export default class SemesterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            start: getTimeStringFromDate(new Date()),
            end: getTimeStringFromDate(new Date()),
            message: '',
        };

        this.changeName = this.changeName.bind(this);
        this.changeStart = this.changeStart.bind(this);
        this.changeEnd = this.changeEnd.bind(this);
        this.createSemester = this.createSemester.bind(this);
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

    async createSemester(event) {
        event.preventDefault();
        this.setState({ message: '' });
        const { token, apiUrl, semesters, changeSemesters } = this.context;
        try {
            const res = await axios.post(
                `${apiUrl}/semesters`,
                {
                    name: this.state.name,
                    start: getDateFromTimeString(this.state.start),
                    end: getDateFromTimeString(this.state.end),
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            changeSemesters([...semesters, res.data]);
            this.setState({ name: '', start: new Date(), end: new Date() });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <div>
                    <Message value={this.state.message} />
                    <form onSubmit={this.createSemester}>
                        <div>
                            <label>
                                Semester:
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
                        <button type='submit'>Create</button>
                    </form>
                </div>
            </>
        );
    }
}

function getTimeStringFromDate(date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function getDateFromTimeString(time) {
    const [year, month, day] = time.split('-');
    const parsedDate = new Date();
    parsedDate.setFullYear(year);
    parsedDate.setMonth(month);
    parsedDate.setDate(day);
    parsedDate.setHours(0);
    parsedDate.setMinutes(0);
    parsedDate.setSeconds(0);
    parsedDate.setMilliseconds(0);
    return parsedDate;
}