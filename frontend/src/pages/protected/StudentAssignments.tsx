import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentAssignmentsPage from '../../features/students/pages/StudentAssignmentsPage';

const StudentAssignments = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Assignments" }));
    }, [dispatch]);

    return (
        <div className="student-assignments-container">
            <StudentAssignmentsPage />
        </div>
    );
};

export default StudentAssignments; 