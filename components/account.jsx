import React from 'react';
import styles from './account.module.css';
import Email from './account/email';
import Password from './account/password';
import Name from './account/name';
import DeleteAccount from './account/deleteAccount';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: <Email />,
    };
    this.changeCurrentView = this.changeCurrentView.bind(this);
  }

  changeCurrentView(newView) {
    this.setState({ currentView: newView });
  }

  render() {
    return (
      <div className={styles.center}>
        <div className={styles.container}>
          <div className={styles.containerHeader}>
            <button onClick={() => this.changeCurrentView(<Email />)}>Email</button>
            <button onClick={() => this.changeCurrentView(<Name />)}>Name</button>
            <button onClick={() => this.changeCurrentView(<Password />)}>Password</button>
            <button onClick={() => this.changeCurrentView(<DeleteAccount />)}>Danger Zone</button>
          </div>
          <hr />
          <div className={styles.containerBody}>
            {this.state.currentView}
          </div>
        </div>
      </div>
    );
  }
}
