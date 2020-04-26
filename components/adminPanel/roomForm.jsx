import React from 'react';
import UserContext from '../userContext';
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
        this.createRoom = this.createRoom.bind(this);
    }

    static contextType = UserContext;

    changeRoom(event) {
        this.setState({ room: event.target.value });
    }

    async createRoom(event) {
        event.preventDefault();
        this.setState({ message: '' });
        const { token, apiUrl, rooms, changeRooms } = this.context;
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

            changeRooms([rooms, ...res.data]);
            this.setState({ room: '' });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <div>
                    <Message value={this.state.message} />
                    <form onSubmit={this.createRoom}>
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
