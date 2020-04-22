import React from "react";
import AppContext from "../appContext";
import axios from "axios";
import Message from "../message";

export default class CourseForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: "",
      message: "",
    };

    this.changeCourse = this.changeCourse.bind(this);
    this.submitCourseForm = this.submitCourseForm.bind(this);
  }

  static contextType = AppContext;

  changeCourse(event) {
    this.setState({ course: event.target.value });
  }

  async submitCourseForm(event) {
    event.preventDefault();
    this.setState({ message: "" });
    const { token, apiUrl } = this.context;
    try {
      const res = await axios.post(
        `${apiUrl}/courses`,
        {
          name: this.state.course,
        },
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      this.setState({ course: "" });
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
          <form onSubmit={this.submitCourseForm}>
            <label>
              Course:
              <br />
              <input
                type="text"
                value={this.state.course}
                onChange={this.changeCourse}
                required
              />
            </label>
            <button type="submit">Create</button>
          </form>
        </div>
      </>
    );
  }
}
