import React from 'react';
import Head from 'next/head';
import { auth } from '../utils/auth';
import axios from 'axios';
import LoadingScreen from '../components/loadingScreen';
import Calendar from '../components/calendar';
import Navbar from '../components/navbar';
import UserContext from '../components/userContext';

/**
 * This is a single page application.
 * All the content (besides the login and register page) happens in this component.
 * This component consists of a navbar and a other component below that.
 */
export default class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // loading will determine if information is beeing fetched and if the user has to wait.
            loading: true,
            // view displayed below the navbar.
            currentView: <Calendar />,
            // same as the user props, but has to be mutable, so that the user change for example his name.
            user: this.props.user,
            // other information for the user.
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

    /**
     * This will run when React did render the content (called mounting).
     * Can't be done before because the state is set in here.
     */
    componentDidMount() {
        const { apiUrl, token } = this.props;

        // fetching data asynchronously
        // custom promises are required because a single 404-error could make the
        // whole chain of promises fail.
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
            })
            .finally(() => {
                // either way the information has been fetched and the app isn't loading anymore.
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

    /**
     * At the top of React fragment is the Head-tag, specifing information like the title.
     * Below that either the loading screen or the content is shown.
     * The actual content is a navbar with an other component below.
     */
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
                    // Providing the UserContext.
                    // This way all the variables and function don't have to be passed down
                    // via props and can simple be called by children by consuming the context.
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

/**
 * This will get the inital props of this component: The url for api request, the user and this jwt.
 * This function is ensures that the props are generated on the server side.
 * Normally this is done with "getInitalProps", which is rendered on the server- or client-side.
 * However getter the user's token can only be done on the server side:
 * Verifing the jwt doesn't work on the client side (which shouldn't be done anyways).
 * @param {object} ctx - The context
 */
export async function getServerSideProps(ctx) {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const apiUrl = process.browser
        ? `${protocol}://${window.location.host}/api`
        : `${protocol}://${ctx.req.headers.host}/api`;

    const { user, token } = await auth(ctx, apiUrl);
    return { props: { user, token, apiUrl } };
}
