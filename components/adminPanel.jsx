import React from 'react';
import CourseForm from './adminPanel/courseForm';
import RoomForm from './adminPanel/roomForm';
import SemesterForm from './adminPanel/semesterForm';
import styles from './adminPanel.module.css';

export default class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: <CourseForm />,
            activeButton: 'course',
        };
        this.changeCurrentView = this.changeCurrentView.bind(this);
        this.changeActiveButton = this.changeActiveButton.bind(this);
    }

    changeCurrentView(view) {
        this.setState({ currentView: view });
    }

    changeActiveButton(button) {
        this.setState({ activeButton: button });
    }

    render() {
        return (
            <div className={styles.center}>
                <div className={styles.container}>
                    <div className={styles.containerHeader}>
                        <button
                            className={
                                this.state.activeButton === 'course'
                                    ? 'activeButton'
                                    : ''
                            }
                            onClick={() => {
                                this.changeCurrentView(<CourseForm />);
                                this.changeActiveButton('course');
                            }}>
                            Courses
                        </button>
                        <button
                            className={
                                this.state.activeButton === 'room'
                                    ? 'activeButton'
                                    : ''
                            }
                            onClick={() => {
                                this.changeCurrentView(<RoomForm />);
                                this.changeActiveButton('room');
                            }}>
                            Rooms
                        </button>
                        <button
                            className={
                                this.state.activeButton === 'semester'
                                    ? 'activeButton'
                                    : ''
                            }
                            onClick={() => {
                                this.changeCurrentView(<SemesterForm />);
                                this.changeActiveButton('semester');
                            }}>
                            Semesters
                        </button>
                    </div>
                    <div className={styles.separatorLine}/>
                    <div className={styles.containerBody}>
                        {this.state.currentView}
                    </div>
                </div>
            </div>
        );
    }
}
