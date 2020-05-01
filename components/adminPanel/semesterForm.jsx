import React from 'react';
import UserContext from '../userContext';
import axios from 'axios';
import Message from '../message';
import Semester from './semester';
import { getYYYYMMDDFromDate, getDateFromYYYMMDD } from '../../utils/date';
import styles from '../adminPanel.module.css';

export default class SemesterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            start: getYYYYMMDDFromDate(new Date()),
            end: getYYYYMMDDFromDate(new Date()),
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
                    start: getDateFromYYYMMDD(this.state.start),
                    end: getDateFromYYYMMDD(this.state.end),
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            changeSemesters([...semesters, res.data]);
            this.setState({
                name: '',
                start: getYYYYMMDDFromDate(new Date()),
                end: getYYYYMMDDFromDate(new Date()),
            });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <div className={styles.createForm}>
                    <Message value={this.state.message} />
                    <form onSubmit={this.createSemester}>
                        <div>
                            <label>
                                Semester:
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
                                <input
                                    type='date'
                                    value={this.state.end}
                                    onChange={this.changeEnd}
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
                <div className={styles.separatorLine} />
                <UserContext.Consumer>
                    {({ semesters }) =>
                        semesters.length === 0 ? (
                            <div>No semesters yet</div>
                        ) : (
                            <div>
                                {semesters.map((semester) => (
                                    <Semester
                                        key={semester._id}
                                        value={semester}
                                    />
                                ))}
                            </div>
                        )
                    }
                </UserContext.Consumer>
            </>
        );
    }
}
