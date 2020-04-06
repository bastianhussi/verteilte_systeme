import React from 'react';

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        let days = [];
        for (let d = 0; d < 7; d++) {
            days.push(<Day dayNumber={d + 1} key={d} />);
        }
        return (
            <>
                <div className="week">{days}</div>
                <style jsx>{`
                    .week {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        justify-content: center;
                        align-items: flex-start;
                    }
                `}</style>
            </>
        );
    }
}

class Day extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        function onClick(start, end) {
            console.log(`${start}-${end}`);
        }

        let hours = [];
        for (let h = 0; h < 24; h++) {
            hours.push(<Hour start={h} end={h + 1} key={h} onClick={onClick} />)
        }
        return (
            <>

                <div className="day">
                    <div className="day-header">Day {this.props.dayNumber}</div>
                    {hours}
                </div>
                <style jsx>{`
                    .day {
                        display: flex;
                        flex-direction: column;
                        flex-wrap: nowrap;
                        justify-content: flex-start;
                        align-items: center;
                    }
                    .day:nth-child(odd) {
                        background-color: #20232a;
                    }
                    .day:nth-child(even) {
                        background-color: #282c34;
                    }
                    .day-header {
                        background-color: #61dafb;
                        width: 100%;
                        height: 50px;
                        position: sticky;
                        top: 0;
                    }
                `}</style>
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
                <div className="hour" onClick={() => this.props.onClick(this.props.start, this.props.end)}>{this.props.start}-{this.props.end}</div>
                <style jsx>{`
                    .hour {
                        height: 50px;
                        width: 150px;
                        color: white;
                        border: white solid 2px;
                    }
                    .hour:hover {
                        cursor: pointer;
                    }
                `}</style>
            </>
        );
    }
}

export default Calendar;
