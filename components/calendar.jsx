import React from 'react';
import Month from './calendar/month';
import Form from './calendar/form';
import CalendarContext from './calendarContext';
import AppContext from './appContext';
import axios from 'axios';
import Message from './message';
import { NotFoundError } from '../utils/errors';
import styles from './calendar.module.css';

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            lectures: [],
            selectedDate: new Date(),
            selectedView: <Month />,
            showForm: false,
            message: '',
        };

        this.changeView = this.changeView.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.showForm = this.showForm.bind(this);
    }

    static contextType = AppContext;

    componentDidMount() {
        const { apiUrl, token } = this.context;

        axios
            .get(`${apiUrl}/lectures`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                const lectures = res.data.map(({ start, end, ...lecture }) => {
                    return {
                        start: new Date(start),
                        end: new Date(end),
                        ...lecture,
                    };
                });
                this.setState({ lectures });
            })
            .catch((err) => {
                if (!err instanceof NotFoundError) {
                    this.setState({ message: err.response.data });
                }
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    changeView(view) {
        this.setState({
            selectedView: view,
        });
    }

    changeDate(newDate) {
        this.setState({ selectedDate: newDate });
    }

    showForm() {
        this.setState({ showForm: !this.state.showForm });
    }

    render() {
        return (
            <>
                <Message value={this.state.message} />
                {this.state.loading ? (
                    <p>fetching...</p>
                ) : (
                    <CalendarContext.Provider
                        value={{
                            lectures: this.state.lectures,
                            selectedDate: this.state.selectedDate,
                            changeDate: this.changeDate,
                            changeView: this.changeView,
                            showForm: this.showForm,
                        }}>
                        {this.state.selectedView}
                    </CalendarContext.Provider>
                )}
                {this.state.showForm ? (
                    <Form
                        date={this.state.selectedDate}
                        onClose={this.showForm}
                    />
                ) : (
                    <></>
                )}
            </>
        );
    }
}
