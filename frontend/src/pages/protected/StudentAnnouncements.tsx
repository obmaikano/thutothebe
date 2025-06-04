import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentAnnouncementsPage from '../../features/announcements/pages/StudentAnnouncementsPage';

const StudentAnnouncements = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Announcements" }));
    }, [dispatch]);

    return (
        <div className="student-announcements-container">
            <StudentAnnouncementsPage />
        </div>
    );
};

export default StudentAnnouncements; 