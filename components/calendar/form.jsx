import React from 'react';
import styles from './form.module.css';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.lightbox}>
        <div className={styles.createLectureForm}>
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
    );
  }
}
