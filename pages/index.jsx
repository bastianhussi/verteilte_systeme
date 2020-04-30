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
            currentView: <Calendar />,
            user: this.props.user,
            courses: [],
            rooms: [],
            semesters: [],
            lectures: [],
        };

        this.changeCurrentView = this.changeCurrentView.bind(this);
        this.changeUser = this.changeUser.bind(this);
        this.changeCourses = this.changeCourses.bind(this);
        this.changeRooms = this.changeRooms.bind(this);
        this.changeSemesters = this.changeSemesters.bind(this);
        this.changeLectures = this.changeLectures.bind(this);
    }

    componentDidMount() {
        const { apiUrl, token } = this.props;
        // fetching data asynchronously
        Promise.all([
            new Promise((resolve, reject) => {
                axios
                    .get(`${apiUrl}/courses`, {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                        resolve(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                        err.response.status === 404 ? resolve([]) : reject(err);
                    });
            }),
            new Promise((resolve, reject) => {
                axios
                    .get(`${apiUrl}/rooms`, {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                        resolve(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                        err.response.status === 404 ? resolve([]) : reject(err);
                    });
            }),
            new Promise((resolve, reject) => {
                axios
                    .get(`${apiUrl}/semesters`, {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                        resolve(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                        err.response.status === 404 ? resolve([]) : reject(err);
                    });
            }),
            new Promise((resolve, reject) => {
                axios
                    .get(`${apiUrl}/lectures`, {
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                        resolve(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                        err.response.status === 404 ? resolve([]) : reject(err);
                    });
            }),
        ])
            .then(([courses, rooms, semesters, lectures]) => {
                this.setState({
                    courses,
                    rooms,
                    semesters,
                    lectures,
                });
            })
            .catch((err) => {
                console.log(err);
                // TODO: show error page
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    changeCurrentView(currentView) {
        this.setState({ currentView });
    }

    changeUser(user) {
        this.setState({ user });
    }

    changeCourses(courses) {
        this.setState({ courses });
    }

    changeRooms(rooms) {
        this.setState({ rooms });
    }

    changeSemesters(semesters) {
        this.setState({ semesters });
    }

    changeLectures(lectures) {
        this.setState({ lectures });
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
                    <title>{`Welcome ${this.state.user.name}`}</title>
                </Head>
                {this.state.loading ? (
                    <LoadingScreen />
                ) : (
                    <UserContext.Provider
                        value={{
                            token: this.props.token,
                            apiUrl: this.props.apiUrl,
                            user: this.state.user,
                            changeUser: this.changeUser,
                            courses: this.state.courses,
                            changeCourses: this.changeCourses,
                            rooms: this.state.rooms,
                            changeRooms: this.changeRooms,
                            semesters: this.state.semesters,
                            changeSemesters: this.changeSemesters,
                            lectures: this.state.lectures,
                            changeLectures: this.changeLectures,
                        }}>
                        <Navbar changeView={this.changeCurrentView} />
                        {this.state.currentView}
                    </UserContext.Provider>
                )}
            </>
        );
    }
}

export async function getServerSideProps(ctx) {
    const protocol = process.env.NODE_ENV === 'production' ? 'http' : 'http';
    const apiUrl = process.browser
        ? `${protocol}://${window.location.host}/api`
        : `${protocol}://${ctx.req.headers.host}/api`;

    const { user, token } = await auth(ctx, apiUrl);
    return { props: { user, token, apiUrl } };
}
