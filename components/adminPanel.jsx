import CourseForm from './adminPanel/courseForm';
import RoomForm from './adminPanel/roomForm';
import React from 'react';
import UserContext from './userContext';
import Course from './adminPanel/course';
import Room from './adminPanel/room';

export default function AdminPanel() {
    return (
        <UserContext.Consumer>
            {({ rooms, courses }) => (
                <>
                    <div>
                        <RoomForm />
                    </div>
                    <div>
                        <CourseForm />
                    </div>
                    <div>
                        rooms:
                        <ul>
                            {rooms.map((room) => (
                                <Room key={room._id} value={room} />
                            ))}
                        </ul>
                        courses:
                        <ul>
                            {courses.map((course) => (
                                <Course key={course._id} value={course} />
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </UserContext.Consumer>
    );
}
