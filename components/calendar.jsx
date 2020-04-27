import React from 'react';
import MonthController from './calendar/month';
import LectureDialog from './calendar/lectureDialog';
import CalendarContext from './calendarContext';
import UserContext from './userContext';
import styles from './calendar.module.css';

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: new Date(),
            selectedLecture: undefined,
            currentView: <MonthController />,
            showForm: false,
            message: '',
        };

        this.changeView = this.changeView.bind(this);
        this.changeLecture = this.changeLecture.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.showForm = this.showForm.bind(this);
    }

    static contextType = UserContext;

    changeView(view) {
        this.setState({
            currentView: view,
        });
    }

    changeLecture(lecture) {
        this.setState({ selectedLecture: lecture });
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
                    selectedLecture: this.state.selectedLecture,
                    changeLecture: this.changeLecture,
                    changeView: this.changeView,
                    showForm: this.showForm,
                }}>
                {this.state.currentView}
                {this.state.showForm ? <LectureDialog /> : <></>}
            </CalendarContext.Provider>
        );
    }
}
