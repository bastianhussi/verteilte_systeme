import React from 'react';
import Head from 'next/head';
import { auth } from '../utils/auth';
import axios from 'axios';
import LoadingScreen from '../components/loadingScreen';
import Calendar from '../components/calendar';
import Navbar from '../components/navbar';
import UserContext from '../components/userContext';

export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            user: this.props.user,
            lectures: [],
            courses: [],
            rooms: [],
            currentView: <Calendar />,
        };

        this.changeUser = this.changeUser.bind(this);
        this.changeCourses = this.changeCourses.bind(this);
        this.changeCurrentView = this.changeCurrentView.bind(this);
    }

    static async getInitialProps(ctx) {
        const protocol =
            process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const apiUrl = process.browser
            ? `${protocol}://${window.location.host}/api`
            : `${protocol}://${ctx.req.headers.host}/api`;

        const { user, token } = await auth(ctx, apiUrl);
        return { user, token, apiUrl };
    }

    componentDidMount() {
        const { apiUrl, token } = this.props;
        Promise.race([
            axios.get(`${apiUrl}/courses`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            }),
            axios.get(`${apiUrl}/rooms`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            }),
            axios.get(`${apiUrl}/lectures`, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${token}`,
                },
            }),
        ])
            .then(([courses, rooms, lectures]) => {

                if(courses) {
                    const userCourses = this.state.user.courses;
                    const otherCourses = courses.data;
                    otherCourses.forEach((course, index) => {
                        const userIndex = userCourses.findIndex(
                            (userCourse) => userCourse === course._id
                        );
                        if (userIndex) {
                            userCourses[userIndex] = course;
                            otherCourses.splice(index, 1);
                        }
                    });
                    this.setState({
                        user: Object.assign(this.state.user, {
                            courses: userCourses,
                        }),
                        courses: otherCourses,
                    });
                }

                if(rooms) {
                    this.setState({ rooms: rooms.data});
                }

                if(lectures) {
                    this.setState({ lectures: lectures.data });
                }
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    changeUser(modifiedUser) {
        this.setState({ user: modifiedUser });
    }

    changeCourses(modifiedCourses) {
        this.setState({ courses: modifiedCourses });
    }

    changeCurrentView(newView) {
        this.setState({ currentView: newView });
    }

    render() {
        const { token, apiUrl } = this.props;
        const { user, lectures, rooms, courses } = this.state;

        return (
            <>
                <Head>
                    <meta charSet='UTF-8' />
                    <meta
                        name='viewport'
                        content='width=device-width, initial-scale=1.0'
                    />
                    <title>{`Welcome ${user.name}`}</title>
                </Head>
                {this.state.loading ? (
                    <LoadingScreen />
                ) : (
                    <UserContext.Provider
                        value={{
                            user,
                            changeUser: this.changeUser,
                            token,
                            apiUrl,
                            lectures,
                            courses,
                            changeCourses: this.changeCourses,
                            rooms,
                        }}>
                        <Navbar changeView={this.changeCurrentView} />
                        {this.state.currentView}
                    </UserContext.Provider>
                )}
            </>
        );
    }
}
