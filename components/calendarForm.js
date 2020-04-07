import React from 'react';

class CalendarForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="lightbox">
                    <div className="createLectureForm">
                        <button onClick={this.props.onClose}>Close</button>
                        <form>
                            <label>
                                Title:
                            <br />
                                <input type="text" required />
                            </label>
                            <br />
                            <label>
                                Time:
                                <br />
                                <span>
                                    <input type="time" />
                                -
                                <input type="time" />
                                </span>
                            </label>
                            <br />
                            <label>
                                Room:
                                <br />
                                <input type="text" />
                            </label>
                            <button type="submit">Create</button>
                        </form>
                    </div>

                </div>
                <style jsx>{`
                    .lightbox {
                        position: fixed;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, .8);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .createLectureForm {
                        background-color: white;
                    }
                `}</style>
            </>
        );
    }
}

export default CalendarForm;
