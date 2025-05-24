import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { ClassDetailPage } from '../../features/classes';

const ClassDetail = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Class Detail" }));
    }, [dispatch]);

    return (
        <div className="analytics-container">
            <ClassDetailPage />
        </div>
    );
};

export default ClassDetail; 