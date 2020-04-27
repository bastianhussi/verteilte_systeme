import React from 'react';
import UserContext from '../userContext';
import axios from 'axios';
import Message from '../message';

export default class RoomForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            message: '',
        };

        this.changeName = this.changeName.bind(this);
        this.createRoom = this.createRoom.bind(this);
    }

    static contextType = UserContext;

    changeName(event) {
        this.setState({ name: event.target.value });
    }

    async createRoom(event) {
        event.preventDefault();
        this.setState({ message: '' });
        const { token, apiUrl, rooms, changeRooms } = this.context;
        try {
            const res = await axios.post(
                `${apiUrl}/rooms`,
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

            changeRooms([...rooms, res.data]);
            this.setState({ name: '' });
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
                                value={this.state.name}
                                onChange={this.changeName}
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
