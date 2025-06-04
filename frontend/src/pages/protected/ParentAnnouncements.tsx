import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import ParentAnnouncementsPage from '../../features/announcements/pages/ParentAnnouncementsPage';

const ParentAnnouncements = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "School Announcements" }));
    }, [dispatch]);

    return (
        <div className="parent-announcements-container">
            <ParentAnnouncementsPage />
        </div>
    );
};

export default ParentAnnouncements; 