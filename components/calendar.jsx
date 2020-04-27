import React from 'react';
import MonthController from './calendar/month';
import Form from './calendar/form';
import CalendarContext from './calendarContext';
import UserContext from './userContext';
import styles from './calendar.module.css';

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            currentView: <MonthController />,
            showForm: false,
            message: '',
        };

        this.changeView = this.changeView.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.showForm = this.showForm.bind(this);
    }

    static contextType = UserContext;

    changeView(view) {
        this.setState({
            currentView: view,
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
                <CalendarContext.Provider
                    value={{
                        selectedDate: this.state.selectedDate,
                        changeDate: this.changeDate,
                        changeView: this.changeView,
                        showForm: this.showForm,
                    }}>
                    {this.state.currentView}
                </CalendarContext.Provider>
                {this.state.showForm ? (
                    <Form
                        calendarContext
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
