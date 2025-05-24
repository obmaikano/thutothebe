import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import RegionListPage from '../../features/regions/pages/RegionListPage';

const RegionsPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Regions" }));
    }, [dispatch]);

    return (
        <div className="regions-container">
            <RegionListPage />
        </div>
    );
};

export default RegionsPage; 