import React from 'react';
import AppContext from '../appContext';
import axios from 'axios';
import Message from '../message';

export default class RoomForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: '',
            message: '',
        };

        this.changeRoom = this.changeRoom.bind(this);
        this.submitRoomForm = this.submitRoomForm.bind(this);
    }

    static contextType = AppContext;

    changeRoom(event) {
        this.setState({ room: event.target.value });
    }

    async submitRoomForm(event) {
        event.preventDefault();
        this.setState({ message: '' });
        const { token, apiUrl } = this.context;
        try {
            const res = await axios.post(
                `${apiUrl}/rooms`,
                {
                    name: this.state.room,
                },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            this.setState({ room: '' });
            this.props.onSubmit(res.data);
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <div>
                    <Message value={this.state.message} />
                    <form onSubmit={this.submitRoomForm}>
                        <label>
                            Room:
                            <br />
                            <input
                                type='text'
                                value={this.state.room}
                                onChange={this.changeRoom}
                                required
                            />
                        </label>
                        <button type='submit'>Create</button>
                    </form>
                </div>
            </>
        );
    }
}
