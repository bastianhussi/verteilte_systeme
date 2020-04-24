import React from 'react';
import Month from './calendar/month';
import Form from './calendar/form';
import CalendarContext from './calendarContext';

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            selectedView: <Month />,
            showForm: false,
        };

        this.changeView = this.changeView.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.showForm = this.showForm.bind(this);
    }

    static contextType = CalendarContext;

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
            <CalendarContext.Provider
                value={{
                    selectedDate: this.state.selectedDate,
                    changeDate: this.changeDate,
                    changeView: this.changeView,
                    showForm: this.showForm,
                }}>
                {this.state.showForm ? <Form /> : <></>}
                {this.state.selectedView}
            </CalendarContext.Provider>
        );
    }
}
