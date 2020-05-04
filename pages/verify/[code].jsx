import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axois from 'axios';
import Link from 'next/link';

/**
 * This page is beeing renderd when the user clicks on the link inside of
 * his confirmation email. If the code exists the user is prompted to login,
 * if not an error is displayed.
 */
export default class Verify extends React.Component {
    constructor(props) {
        super(props);
    }

    static async getInitialProps({ req }) {
        const protocol =
            process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const apiUrl = process.browser
            ? `${protocol}://${window.location.host}/api/verify`
            : `${protocol}://${req.headers.host}/api/verify`;

        const code = req ? req.url.split('/')[2] : useRouter().query.code;

        try {
            await axois.post(`${apiUrl}/${code}`);
            return {
                error: '',
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
                <Head>
                    <meta charSet='UTF-8' />
                    <meta
                        name='viewport'
                        content='width=device-width, initial-scale=1.0'
                    />
                    <title>Verify</title>
                </Head>
                {this.props.error ? (
                    <>
                        <h1>An error occurred:</h1>
                        <div>
                            <p>{this.props.error}</p>
                            <p>
                                Please make sure your account is not alread
                                activated.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Your account is now activated</h1>
                        <div>
                            <Link href='/'>
                                <a>login now</a>
                            </Link>
                        </div>
                    </>
                )}
                <style jsx>{`
                    h1 {
                        text-align: center;
                    }
                    div {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    a {
                        padding: 1rem;
                        font-size: larger;
                        border: 1px solid var(--cyan);
                        background-color: var(--cyan);
                        border-radius: 4px;
                    }
                `}</style>
            </>
        );
    }
}
