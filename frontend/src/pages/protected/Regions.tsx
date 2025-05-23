import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { RegionsOverview } from '../../features/regions';

const RegionsPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Regions" }));
    }, [dispatch]);

    return (
        <div className="regions-container">
            <RegionsOverview />
        </div>
    );
};

export default RegionsPage; 