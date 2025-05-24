import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { ClassListPage } from '../../features/classes';

const Classes = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Classes" }));
    }, [dispatch]);

    return (
        <div className="analytics-container">
            <ClassListPage />
        </div>
    );
};

export default Classes; 