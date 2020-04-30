import React from 'react';
import CalendarContext from '../calendarContext';
import CreateLecture from './createLecture';
import EditLecture from './editLecture';

export default function LectureDialog() {
    return (
        <CalendarContext.Consumer>
            {({
                selectedDate,
                showForm,
                selectedLecture,
                selectedSemester,
            }) => (
                <div>
                    <span
                        className={'material-icons closeButton'}
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
                    <style jsx>{`
                        .closeButton {
                            position: absolute;
                            top: 10px;
                            right: 25px;
                            color: var(--main-color);
                            font-size: 4rem;
                            z-index: 1000;
                        }

                        div {
                            position: fixed;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            background-color: rgba(0, 0, 0, 0.8);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    `}</style>
                </div>
            )}
        </CalendarContext.Consumer>
    );
}
