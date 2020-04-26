import React from 'react';
import Head from 'next/head';
import { auth } from '../utils/auth';
import axios from 'axios';
import Calendar from '../components/calendar';
import Navbar from '../components/navbar';
import AppContext from '../components/appContext';
import CalendarContext from '../components/calendarContext';
import Message from '../components/message';

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            currentView: <Calendar />,
            message: '',
        };

        this.changeCurrentView = this.changeCurrentView.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    changeCurrentView(newView) {
        this.setState({ currentView: newView });
    }

    changeUser(newUser) {
        this.setState({ user: newUser });
    }

    static async getInitialProps(ctx) {
        try {
            const protocol =
                process.env.NODE_ENV === 'production' ? 'https' : 'http';
            const apiUrl = process.browser
                ? `${protocol}://${window.location.host}/api`
                : `${protocol}://${ctx.req.headers.host}/api`;

            const { user, token } = await auth(ctx, apiUrl);

            // fetching courses from server.
            try {
                const res = await axios.get(`${apiUrl}/courses`, {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const courses = res.data;

                // replace the id in the courses array with the whole course object.
                // this workaround is needed, because if the whole course would be stored
                // in the documents of users, updating a course would require updating users as well.
                user.courses.forEach((userCourse, index) => {
                    const course = courses.find((c) => c._id === userCourse);
                    if (course) {
                        user.courses[index] = course;
                    }
                });
            } catch (err) {
                if (err.response.status !== 404) throw err;
            }

            return { user, token, apiUrl };
        } catch (err) {
            // TODO: show error page
        }
    }

    static contextType = AppContext;

    render() {
        const { token, apiUrl } = this.props;
        const { user } = this.state;
        return (
            <>
                <Head>
                    <meta charSet='UTF-8' />
                    <meta
                        name='viewport'
                        content='width=device-width, initial-scale=1.0'
                    />
                    <title>Overview</title>
                </Head>
                <AppContext.Provider
                    value={{
                        user,
                        token,
                        apiUrl,
                        changeUser: this.changeUser,
                    }}>
                    <Navbar changeView={this.changeCurrentView} />
                    <Message value={this.state.message} />
                    <CalendarContext.Provider value={{
                        lectures: [],
                        courses: [],
                        rooms: [],
                    }}></CalendarContext.Provider>
                    <div>
                        {this.state.currentView}
                    </div>
                </AppContext.Provider>
            </>
        );
    }
}
