import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { SubjectAllocationPage } from '../../features/school_admin/pages/SubjectAllocationPage';

const SubjectAllocation = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Subject Allocation" }));
    }, [dispatch]);

    return (
        <div className="subject-allocation-container">
            <SubjectAllocationPage />
        </div>
    );
};

export default SubjectAllocation; 