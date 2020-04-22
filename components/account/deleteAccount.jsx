import React from "react";
import axios from "axios";
import AppContext from "../appContext";
import styles from "./deleteAccount.module.css";
import { logout } from "../../utils/auth";
import Message from "../message";

export default class DeleteAccount extends React.Component {
  constructor(props) {
    super(props);
    this.submitDeleteForm = this.submitDeleteForm.bind(this);
    this.state = {
      message: "",
    };
  }

  static contextType = AppContext;

  async submitDeleteForm(event) {
    event.preventDefault();

    const { user, apiUrl, token } = this.context;

    this.setState({ message: "" });
    try {
      await axios.delete(`${apiUrl}/users/${user._id}`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${token}`,
        },
      });
      logout();
    } catch (err) {
      this.setState({ message: err.response.data });
    }
  }

  render() {
    return (
      <>
        <form onSubmit={this.submitDeleteForm}>
          <label>
            Delete Account:
            <button type="submit">Delete</button>
          </label>
        </form>
        <Message value={this.state.message} />
      </>
    );
  }
}
