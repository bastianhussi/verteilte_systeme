import React from "react";
import { useRouter } from "next/router";
import axois from "axios";
import Link from "next/link";

export default class Verify extends React.Component {
  constructor(props) {
    super(props);
  }

  static async getInitialProps({ req }) {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const apiUrl = process.browser
      ? `${protocol}://${window.location.host}/api/verify`
      : `${protocol}://${req.headers.host}/api/verify`;

    const code = req ? req.url.split("/")[2] : useRouter().query.code;

    try {
      await axois.post(`${apiUrl}/${code}`);
      return {
        error: "",
      };
    } catch (err) {
      return {
        error: err.response.data,
      };
    }
  }

  render() {
    return (
      <>
        {this.props.error ? (
          <div>
            <h1>An Error occured:</h1>
            <p>{this.props.error}</p>
          </div>
        ) : (
          <div>
            <h1>Congratulations!</h1>
            <Link href="/">
              <a>login now</a>
            </Link>
          </div>
        )}
      </>
    );
  }
}
