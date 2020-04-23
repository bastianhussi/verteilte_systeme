import React from 'react';
import CalendarContext from '../calendarContext';
import Month from './month';
import styles from './week.module.css';

export default class Week extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = CalendarContext;

    render() {
        return (
            <>
                <div>
                    <button onClick={() => this.context.changeView(<Month />)}>
                        back to Month
                    </button>
                </div>
                <div className={styles.week}>
                    <Day name='Monday' />
                    <Day name='Tuesday' />
                    <Day name='Wednesday' />
                    <Day name='Thursday' />
                    <Day name='Friday' />
                    <Day name='Saturday' />
                    <Day name='Sunday' />
                </div>
            </>
        );
    }
}

class Day extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const hours = [];
        for (let h = 8; h < 18; h++) {
            hours.push(<Hour start={h} end={h + 1} key={h} />);
        }

        return (
            <>
                <div className={styles.weekDay}>
                    <div className={styles.weekDayHeader}>
                        {this.props.name}
                    </div>
                    {hours}
                </div>
            </>
        );
    }
}

class Hour extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className={styles.hour}>
                    {this.props.start}-{this.props.end}
                </div>
            </>
        );
    }
}
