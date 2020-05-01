import React from 'react';
import axios from 'axios';
import UserContext from '../userContext';
import Message from '../message';
import styles from '../account.module.css';

export default class Name extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            showEditing: false,
            message: '',
        };

        this.changeName = this.changeName.bind(this);
        this.changeShowEditing = this.changeShowEditing.bind(this);
        this.submitNameForm = this.submitNameForm.bind(this);
    }

    componentDidMount() {
        this.setState({ name: this.context.user.name });
    }

    changeName(event) {
        this.setState({ name: event.target.value });
    }

    changeShowEditing() {
        this.setState({ showEditing: !this.state.showEditing });
    }

    async submitNameForm(event) {
        event.preventDefault();

        const { user, changeUser, apiUrl, token } = this.context;

        if (this.state.name === user.name) {
            this.setState({ message: 'Please choose a new name', name: '' });
            return;
        }
        this.setState({ message: '' });
        try {
            const res = await axios.patch(
                `${apiUrl}/users/${user._id}`,
                {
                    name: this.state.name,
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            changeUser(res.data);
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    static contextType = UserContext;

    render() {
        return (
            <UserContext.Consumer>
                {({ user }) => (
                    <>
                        <Message value={this.state.message} />
                        {this.state.showEditing ? (
                            <form
                                onSubmit={this.submitNameForm}
                                className={styles.itemForm}>
                                <div>
                                    <label>
                                        New name:
                                        <input
                                            type='text'
                                            value={this.state.name}
                                            onChange={this.changeName}
                                            required
                                        />
                                    </label>
                                </div>
                                <div>
                                    <button
                                        onClick={() =>
                                            this.setState({
                                                showEditing: false,
                                            })
                                        }>
                                        Cancel
                                    </button>
                                    <button
                                        type='submit'
                                        className={styles.saveButton}>
                                        Save
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className={styles.item}>
                                <span>
                                    {' '}
                                    <strong>{user.name}</strong>
                                </span>
                                <span
                                    className={`material-icons ${styles.itemIcon}`}
                                    onClick={this.changeShowEditing}>
                                    edit
                                </span>
                            </div>
                        )}
                    </>
                )}
            </UserContext.Consumer>
        );
    }
}
