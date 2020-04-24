import React from 'react';
import CalendarContext from '../calendarContext';
import styles from './form.module.css';

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            room: '',
            course: '',
            start: '',
            end: '',
        };

        this.changeTitle = this.changeTitle.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.changeStart = this.changeStart.bind(this);
        this.changeEnd = this.changeEnd.bind(this);
    }

    static contextType = CalendarContext;

    changeTitle(event) {
        this.setState({ title: event.target.value });
    }

    changeRoom(event) {
        this.setState({ room: event.target.value });
    }

    changeCourse(event) {
        this.setState({ course: event.target.value });
    }

    changeStart(event) {
        this.setState({ start: event.target.value });
    }

    changeEnd(event) {
        this.setState({ end: event.target.value });
    }

    render() {
        return (
            <div className={styles.lightbox}>
                <span className={`material-icons ${styles.closeButton}`} onClick={() => this.context.showForm()}>close</span>
                <form onSubmit={() => {}}>
                    <label>
                        Title:
                        <br />
                        <input type="text" value={this.state.title} onChange={this.changeTitle} required/>
                    </label>
                    <button type='submit'>Create lecture</button>
                </form>
            </div>
        );
    }
}
