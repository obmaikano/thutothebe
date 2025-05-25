import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentListPage from '../../features/students/pages/StudentListPage';

const Students = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Students" }));
    }, [dispatch]);

    return (
        <div className="students-container">
            <StudentListPage />
        </div>
    );
};

export default Students; 