import React from "react";
import axios from "axios";
import styles from "./name.module.css";
import AppContext from "../appContext";
import Message from "../message";

export default class Name extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      name: "",
    };

    this.changeName = this.changeName.bind(this);
    this.submitNameForm = this.submitNameForm.bind(this);
  }

  changeName(event) {
    this.setState({ name: event.target.value });
  }

  async submitNameForm(event) {
    event.preventDefault();

    const { user, changeUser, apiUrl, token } = this.context;

    if (this.state.name === user.name) {
      this.setState({ message: "Please choose a new name", name: "" });
      return;
    }
    this.setState({ message: "" });
    try {
      const res = await axios.patch(
        `${apiUrl}/users/${user._id}`,
        {
          name: this.state.name,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      changeUser(res.data);
    } catch (err) {
      this.setState({ message: err.response.data });
    }
    this.setState({ name: "" });
  }

  static contextType = AppContext;

  render() {
    return (
      <AppContext.Consumer>
        {({ user }) => (
          <>
            <p>
              Current name: <strong>{user.name}</strong>
            </p>
            <form onSubmit={this.submitNameForm}>
              <label>
                New name:
                <input
                  type="text"
                  value={this.state.name}
                  onChange={this.changeName}
                  required
                />
              </label>
              <button type="submit">Change</button>
            </form>
            <Message value={this.state.message} />
          </>
        )}
      </AppContext.Consumer>
    );
  }
}
