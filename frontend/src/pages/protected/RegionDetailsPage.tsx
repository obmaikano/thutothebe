import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import RegionDetails from '../../features/regions/pages/RegionDetailsPage';

function RegionDetailsPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Region Details" }));
  }, [dispatch]);

  return <RegionDetails />;
}

export default RegionDetailsPage; 