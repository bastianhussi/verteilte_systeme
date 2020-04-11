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
    }

    changeName(event) {
        this.setState({ name: event.target.value });
    }

    changeShowEditing() {
        this.state({ showEditing: !this.state.showEditing });
    }

    render() {
        return (
            <>
                <p>{name}</p>
                <input type="checkbox" defaultChecked={this.state.showEditing} onClick={this.changeShowEditing} />
                {this.state.showEditing ? 
                (<form onSubmit={this.props.onSubmit}>
                    <input type="text" value={this.state.name} onChange={this.changeName} />
                </form>) 
                : (<></>)}
            </>
        );
    }
}