import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import RegionDetailPage from '../../features/regions/pages/RegionDetailPage';

function RegionDetail() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Region Details" }));
  }, [dispatch]);

  return <RegionDetailPage />;
}

export default RegionDetail; 