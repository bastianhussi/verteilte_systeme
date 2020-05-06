import React from 'react';
import CalendarContext from '../../calendarContext';
import UserContext from '../../userContext';

export default class Lecture extends React.Component {
    constructor(props) {
        super(props);

        this.getTitle = this.getTitle.bind(this);
        this.getPercent = this.getPercent.bind(this);
    }

    static contextType = CalendarContext;

    getTitle() {
        const { date, lecture } = this.props;
        const lectureStart = new Date(lecture.start);
        return lectureStart.getHours() === date.getHours() ? lecture.title : '';
    }

    getPercent() {
        const { date, lecture } = this.props;
        const lectureStart = new Date(lecture.start);
        const lectureEnd = new Date(lecture.end);

        if (lectureStart.getHours() === date.getHours()) {
            return 100 - (100 / 60) * lectureStart.getMinutes();
        } else if (lectureEnd.getHours() === date.getHours()) {
            return (100 / 60) * lectureEnd.getMinutes();
        } else {
            return 100;
        }
    }

    render() {
        const { date, lecture } = this.props;
        const { changeDate, changeLecture, showForm } = this.context;

        return (
            <UserContext.Consumer>
                {({ courses }) => (
                    <>
                        <div
                            onClick={() => {
                                changeDate(date);
                                changeLecture(lecture);
                                showForm();
                            }}>
                            {this.getTitle().length > 8
                                ? `${this.getTitle().substring(0, 8)}...`
                                : this.getTitle()}
                        </div>
                        <style jsx>{`
                            div {
                                position: absolute;
                                ${
                                    new Date(lecture.start).getHours() ===
                                    date.getHours()
                                        ? 'bottom: 0;'
                                        : 'top: 0;'
                                }
                                height: ${this.getPercent()}%;
                                width: 70%;
                                right: 0;
                                background-color: ${
                                    courses.find(
                                        (course) =>
                                            course._id === lecture.course
                                    ).color
                                };
                            }

                            div:hover {
                                cursor: pointer;
                            }
                        `}</style>
                    </>
                )}
            </UserContext.Consumer>
        );
    }
}
