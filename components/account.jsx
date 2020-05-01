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
            activeButton: 'email',
        };
        this.changeCurrentView = this.changeCurrentView.bind(this);
        this.changeActiveButton = this.changeActiveButton.bind(this);
    }

    changeCurrentView(newView) {
        this.setState({ currentView: newView });
    }

    changeActiveButton(button) {
        this.setState({ activeButton: button });
    }

    render() {
        return (
            <div className={styles.center}>
                <div className={styles.container}>
                    <div className={styles.containerHeader}>
                        <button
                            className={
                                this.state.activeButton === 'email'
                                    ? 'activeButton'
                                    : ''
                            }
                            onClick={() => {
                                this.changeCurrentView(<Email />);
                                this.changeActiveButton('email');
                            }}>
                            Email
                        </button>
                        <button
                            className={
                                this.state.activeButton === 'name'
                                    ? 'activeButton'
                                    : ''
                            }
                            onClick={() => {
                                this.changeCurrentView(<Name />);
                                this.changeActiveButton('name');
                            }}>
                            Name
                        </button>
                        <button
                            className={
                                this.state.activeButton === 'password'
                                    ? 'activeButton'
                                    : ''
                            }
                            onClick={() => {
                                this.changeCurrentView(<Password />);
                                this.changeActiveButton('password');
                            }}>
                            Password
                        </button>
                        <button
                            className={
                                this.state.activeButton === 'delete'
                                    ? 'activeButton'
                                    : ''
                            }
                            onClick={() => {
                                this.changeCurrentView(<DeleteAccount />);
                                this.changeActiveButton('delete');
                            }}>
                            Danger Zone
                        </button>
                    </div>
                    <div className={styles.separatorLine} />
                    <div className={styles.containerBody}>
                        {this.state.currentView}
                    </div>
                </div>
            </div>
        );
    }
}
