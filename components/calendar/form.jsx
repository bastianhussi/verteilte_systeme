import React from 'react';
import styles from './form.module.css';
import axios from 'axios';
import AppContext from '../appContext';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title:'',
      time1:'',
      time2:'',
      //time: time1+ '-'+ time2,
      room:'',
      message:'',
    };
    this.changeTitle = this.changeTitle.bind(this);
    this.changeTime1 = this.changeTime1.bind(this);
    this.changeTime2 = this.changeTime2.bind(this);
    this.changeRoom = this.changeRoom.bind(this);
  }
  changeTitle(event) {
    this.setState({title: event.target.value});
  }
  changeTime1(event) {
    this.setState({time1: event.target.value});
  }
  changeTime2(event) {
    this.setState({time2: event.target.value});
  }
  changeRoom(event) {
    this.setState({room: event.target.value});
  }

  //async submitForm(event) {
    //event.preventDefault();
    //this.setState({message: ''});
    //try {
      //await axios.post
    //}
  //}

  render() {
    return (
      <div className={styles.lightbox}>
        <div className={styles.createLectureForm}>
          <button onClick={this.props.onClose}>Close</button>
          <form onSubmit={this.submitForm}>
            <label>
              Title:
                <br />
              <input type="text" required value={this.state.title} onChange={this.changeTitle} />
            </label>
            <br />
            <label>
              Time:
                <br />
              <span>
                <input type="time" value={this.state.time1} onChange={this.changeTime1} />
                  -
                  <input type="time" value={this.state.time2} onChange={this.changeTime2}/>
              </span>
            </label>
            <br />
            <label>
              Room:
                <br />
              <input type="text" value={this.state.room} onChange={this.changeRoom}/>
            </label>
            <button type="submit" onClick={this.props.onSubmit}>Create</button>
          </form>
        </div>
      </div>
    );
  }
}
