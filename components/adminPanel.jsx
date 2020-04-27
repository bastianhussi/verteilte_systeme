import CourseForm from './adminPanel/courseForm';
import RoomForm from './adminPanel/roomForm';
import SemesterForm from './adminPanel/semesterForm';
import React from 'react';
import UserContext from './userContext';
import Course from './adminPanel/course';
import Room from './adminPanel/room';
import Semester from './adminPanel/semester';

export default function AdminPanel() {
    return (
        <UserContext.Consumer>
            {({ rooms, courses, semesters }) => (
                <>
                    <div>
                        <RoomForm />
                    </div>
                    <div>
                        <CourseForm />
                    </div>
                    <div>
                        <SemesterForm />
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
                        semesters:
                        <ul>
                            {semesters.map((semester) => (
                                <Semester key={semester._id} value={semester} />
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </UserContext.Consumer>
    );
}
