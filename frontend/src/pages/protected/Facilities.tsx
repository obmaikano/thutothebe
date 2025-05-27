import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { FacilitiesPage } from '../../features/school_admin/pages/FacilitiesPage';

const Facilities = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Facilities Management" }));
    }, [dispatch]);

    return (
        <div className="facilities-container">
            <FacilitiesPage />
        </div>
    );
};

export default Facilities; 