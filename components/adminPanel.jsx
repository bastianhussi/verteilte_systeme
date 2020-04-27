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
        };
        this.changeCurrentView = this.changeCurrentView.bind(this);
    }

    changeCurrentView(newView) {
        this.setState({ currentView: newView });
    }

    render() {
        return (
            <div className={styles.center}>
                <div className={styles.container}>
                    <div className={styles.containerHeader}>
                        <button
                            onClick={() =>
                                this.changeCurrentView(<CourseForm />)
                            }>
                            Courses
                        </button>
                        <button
                            onClick={() =>
                                this.changeCurrentView(<RoomForm />)
                            }>
                            Rooms
                        </button>
                        <button
                            onClick={() =>
                                this.changeCurrentView(<SemesterForm />)
                            }>
                            Semesters
                        </button>
                    </div>
                    <hr />
                    <div className={styles.containerBody}>
                        {this.state.currentView}
                    </div>
                </div>
            </div>
        );
    }
}
