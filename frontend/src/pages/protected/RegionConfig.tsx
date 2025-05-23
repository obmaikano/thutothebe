import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import RegionConfigPage from '../../features/admin/pages/RegionConfigPage';

const RegionConfig = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: 'Region Configuration' }));
    }, [dispatch]);

    return (
        <div className="region-config-container">
            <RegionConfigPage />
        </div>
    );
};

export default RegionConfig; 