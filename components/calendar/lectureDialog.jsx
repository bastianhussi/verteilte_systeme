import React from 'react';
import CalendarContext from '../calendarContext';
import CreateLecture from './createLecture';
import EditLecture from './editLecture';
import styles from './lectureDialog.module.css';

export default function LectureDialog() {
    return (
        <CalendarContext.Consumer>
            {({
                selectedDate,
                showForm,
                selectedLecture,
                selectedSemester,
            }) => (
                <div className={styles.lightbox}>
                    <span
                        className={`material-icons ${styles.closeButton}`}
                        onClick={showForm}>
                        close
                    </span>
                    {selectedLecture ? (
                        <EditLecture
                            calendarContext={{
                                selectedLecture,
                                selectedSemester,
                                showForm,
                            }}
                        />
                    ) : (
                        <CreateLecture
                            calendarContext={{
                                selectedDate,
                                selectedSemester,
                                showForm,
                            }}
                        />
                    )}
                </div>
            )}
        </CalendarContext.Consumer>
    );
}
