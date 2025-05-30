import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import ContentManagement from '../../features/content';

function ContentPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Content Management" }));
  }, [dispatch]);

  return <ContentManagement />;
}

export default ContentPage; 