import React from 'react';
import axios from 'axios';
import UserContext from '../userContext';
import Message from '../message';
import styles from './email.module.css';

export default class Email extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            showEditing: false,
            message: '',
        };

        this.changeEmail = this.changeEmail.bind(this);
        this.changeShowEditing = this.changeShowEditing.bind(this);
        this.submitEmailForm = this.submitEmailForm.bind(this);
    }

    componentDidMount() {
        this.setState({ email: this.context.user.email });
    }

    changeEmail(event) {
        this.setState({ email: event.target.value });
    }

    changeShowEditing() {
        this.setState({ showEditing: !this.state.showEditing });
    }

    async submitEmailForm(event) {
        event.preventDefault();

        const { user, changeUser, apiUrl, token } = this.context;

        if (this.state.email === user.email) {
            this.setState({ message: 'Please choose a new email!', email: '' });
            return;
        }

        this.setState({ message: '' });
        try {
            const res = await axios.patch(
                `${apiUrl}/users/${user._id}`,
                {
                    email: this.state.email,
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            changeUser(res.data);
            this.setState({
                showEditing: false,
                message: 'please check your inbox',
            });
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
                            <form onSubmit={this.submitEmailForm}>
                                <label>
                                    New email:
                                    <input
                                        type='email'
                                        value={this.state.email}
                                        onChange={this.changeEmail}
                                        required
                                    />
                                </label>
                                <button type='submit'>Change</button>
                                <button
                                    onClick={() =>
                                        this.setState({ showEditing: false })
                                    }>
                                    cancel
                                </button>
                            </form>
                        ) : (
                            <div>
                                <span>
                                    Current email: <strong>{user.email}</strong>
                                </span>
                                <span
                                    className='material-icons'
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
