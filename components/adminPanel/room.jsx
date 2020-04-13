import React from 'react';

export default class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            showEditing: false,
        };

        this.changeName = this.changeName.bind(this);
        this.changeShowEditing = this.changeShowEditing.bind(this);
        this.submitEditingForm = this.submitEditingForm.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
    }

    changeName(event) {
        this.setState({ name: event.target.value });
    }

    changeShowEditing() {
        this.setState({ showEditing: !this.state.showEditing });
    }

    async submitEditingForm(event) {
        event.preventDefault();
        await this.props.onChange(this.props.value._id, this.state.name);

    }

    async deleteRoom() {
        await this.props.onDelete(this.props.value._id);
    }

    render() {
        return (
            <>
                <div>
                    <p>{this.props.value.name}</p>
                    <span className="material-icons" onClick={this.changeShowEditing}>edit</span>
                    <span className="material-icons" onClick={this.deleteRoom}>delete</span>
                    {this.state.showEditing ? (<>
                        <form onSubmit={this.submitEditingForm}>
                            <input type="text" value={this.state.name} onChange={this.changeName} required />
                            <button type="submit">Save</button>
                        </form>
                    </>) : (<></>)}
                </div>
            </>
        );
    }
}