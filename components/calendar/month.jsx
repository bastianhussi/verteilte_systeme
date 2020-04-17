import React from 'react';
import styles from './month.module.css';
import Calendar from '../calendar';
import Form from './form';


Date.prototype.getMonthDays = function () {
  const d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
  return d.getDate();
};

function Popup(props) {
  return (
    <button
    className = "popup"
    onClick = {props.onClick}
    >
      {props.showPopup}
    </button>
  );
}

export default class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),


    };
    this.previousMonth = this.previousMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);

  }

  previousMonth() {
    let previousMonth;
    if (this.state.date.getMonth() == 1) {
      previousMonth = new Date(this.state.date.getFullYear() - 1, 0, 1);
    } else {
      previousMonth = new Date(this.state.date.getFullYear(), this.state.date.getMonth() - 1, 1);
    }
    this.setState({ date: previousMonth });
  }

  nextMonth() {
    let nextMonth;
    if (this.state.date.getMonth() == 11) {
      nextMonth = new Date(this.state.date.getFullYear() + 1, 0, 1);
    } else {
      nextMonth = new Date(this.state.date.getFullYear(), this.state.date.getMonth() + 1, 1);
    }
    this.setState({ date: nextMonth });
  }
  
  

  render() {
    const days = [];
    
    for (let d = 1; d <= this.state.date.getMonthDays(); d++) {
      days.push(<Day key={d} number={d}  />);
    }
    return (
      <>
        
        <div className={styles.monthHeader}>
          <button onClick={this.previousMonth}>previous</button>
          {this.state.date.toDateString()}
          <button onClick={this.nextMonth}>next</button>
        </div>
        <div className={styles.month}>
          {days}
        </div>
       
      </>
    );
  }
}

export class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = 
    {
      showPopup:false,
      closed: false
    };
    this.toggleShowPopup=this.toggleShowPopup.bind(this)
    this.handleOutsideClick=this.handleOutsideClick.bind(this)
  
  }

  

 toggleShowPopup() {
   if(!this.state.showPopup) {
     document.addEventListener('click', this.handleOutsideClick, false)
   }
   else {
     document.removeEventListener('click', this.handleOutsideClick, false)
   }

   this.setState({
     showPopup: !this.state.showPopup
   });
 }
 handleOutsideClick(e) {
   if(this.node.contains(e.target)) {
     return;
   }
   this.toggleShowPopup();
 }
 handleSubmit() {

 }

  render() {
    
    return (
      <div>
      
      <div  
      className={styles.monthDay}
      ref={node => { this.node = node; }} 
      onClick={() =>{this.toggleShowPopup()}}
      showPopup={this.state.showPopup} 
       >
         {this.props.number}
         </div>

         {this.state.showPopup ? <Form 
         onClose={this.toggleShowPopup.bind(this)}
      
         /> : null }
      </div>
      
    );
  }
}