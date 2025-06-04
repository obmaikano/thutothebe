import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import TeacherAnnouncementsPage from '../../features/announcements/pages/TeacherAnnouncementsPage';

const TeacherAnnouncements = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Announcements" }));
    }, [dispatch]);

    return (
        <div className="teacher-announcements-container">
            <TeacherAnnouncementsPage />
        </div>
    );
};

export default TeacherAnnouncements; 