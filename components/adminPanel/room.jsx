import React from 'react';
import axios from 'axios';
import UserContext from '../userContext';
import Message from '../message';

export default class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.value.name,
            showEditing: false,
            message: '',
        };

        this.changeName = this.changeName.bind(this);
        this.changeShowEditing = this.changeShowEditing.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
    }

    static contextType = UserContext;

    changeName(event) {
        this.setState({ name: event.target.value });
    }

    changeShowEditing() {
        this.setState({ showEditing: !this.state.showEditing });
    }

    async changeRoom(event) {
        event.preventDefault();
        const { apiUrl, token, rooms, changeRooms } = this.context;
        try {
            const res = await axios.patch(
                `${apiUrl}/rooms/${this.props.value._id}`,
                { name: this.state.name },
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const modifiedRooms = rooms;
            const index = modifiedRooms.indexOf({
                _id: this.props.value._id,
            });
            modifiedRooms[index] = res;
            changeRooms(modifiedRooms);
            this.setState({ showEditing: false });
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    async deleteRoom() {
        const { apiUrl, token, rooms, changeRooms } = this.context;
        try {
            await axios.delete(`${apiUrl}/rooms/${this.props.value._id}`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            });

            const modifiedRooms = rooms.filter(
                (room) => room._id !== this.props.value._id
            );
            changeRooms(modifiedRooms);
        } catch (err) {
            this.setState({ message: err.response.data });
        }
    }

    render() {
        return (
            <>
                <Message value={this.state.message} />
                {this.state.showEditing ? (
                    <form onSubmit={this.changeRoom}>
                        <input
                            type='text'
                            value={this.state.name}
                            onChange={this.changeName}
                            required
                        />
                        <br />
                        <button type='submit'>Save</button>
                        <button
                            onClick={() =>
                                this.setState({ showEditing: false })
                            }>
                            cancel
                        </button>
                    </form>
                ) : (
                    <div>
                        <p>{this.state.name}</p>
                        <span
                            className='material-icons'
                            onClick={this.changeShowEditing}>
                            edit
                        </span>
                        <span
                            className='material-icons'
                            onClick={this.deleteRoom}>
                            delete
                        </span>
                    </div>
                )}
            </>
        );
    }
}
