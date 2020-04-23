import React from 'react';
import Month from './calendar/month';
import CalendarContext from './calendarContext';

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            selectedView: <Month />,
        };
        this.changeView = this.changeView.bind(this);
        this.changeDate = this.changeDate.bind(this);
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

    render() {
        return (
            <CalendarContext.Provider
                value={{
                    selectedDate: this.state.selectedDate,
                    changeDate: this.changeDate,
                    changeView: this.changeView,
                }}>
                {this.state.selectedView}
            </CalendarContext.Provider>
        );
    }
}
