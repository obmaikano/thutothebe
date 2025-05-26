import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StaffDetailPage from '../../features/school_admin/pages/StaffDetailPage';

const StaffDetail = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Staff Details" }));
    }, [dispatch]);

    return (
        <div className="staff-detail-container">
            <StaffDetailPage />
        </div>
    );
};

export default StaffDetail; 