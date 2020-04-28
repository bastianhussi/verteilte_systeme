import React from 'react';
import MonthController from './calendar/month';
import LectureDialog from './calendar/lectureDialog';
import CalendarContext from './calendarContext';
import UserContext from './userContext';
import LoadingScreen from './loadingScreen';
import styles from './calendar.module.css';

export default class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            selectedDate: new Date(),
            selectedLecture: undefined,
            selectedSemester: undefined,
            currentView: <MonthController />,
            showForm: false,
            message: '',
        };

        this.changeView = this.changeView.bind(this);
        this.changeLecture = this.changeLecture.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.changeSemester = this.changeSemester.bind(this);
        this.showForm = this.showForm.bind(this);
    }

    static contextType = UserContext;

    componentDidMount() {
        const { semesters } = this.context;
        this.setState({ selectedSemester: semesters[0], loading: false });
    }

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

    changeSemester(event) {
        const { semesters } = this.context;
        this.setState({ selectedSemester: semesters[event.target.value] });
    }

    showForm() {
        this.setState({ showForm: !this.state.showForm });
    }

    render() {
        return this.state.loading ? (
            <LoadingScreen />
        ) : (
            <>
                <div className={styles.header}>
                    <UserContext.Consumer>
                        {({ semesters }) => (
                            <label>
                                Semester:
                                <select onChange={this.changeSemester} required>
                                    {semesters.map((semester, index) => (
                                        <option key={index} value={index}>
                                            {semester.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                    </UserContext.Consumer>
                </div>
                <CalendarContext.Provider
                    value={{
                        selectedDate: this.state.selectedDate,
                        changeDate: this.changeDate,
                        selectedSemester: this.state.selectedSemester,
                        selectedLecture: this.state.selectedLecture,
                        changeLecture: this.changeLecture,
                        changeView: this.changeView,
                        showForm: this.showForm,
                    }}>
                    {this.state.currentView}
                    {this.state.showForm ? <LectureDialog /> : <></>}
                </CalendarContext.Provider>
            </>
        );
    }
}
