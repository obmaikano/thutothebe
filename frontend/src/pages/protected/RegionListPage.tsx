import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import RegionList from '../../features/regions/pages/RegionListPage';

function RegionListPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Regions Management" }));
  }, [dispatch]);

  return <RegionList />;
}

export default RegionListPage; 