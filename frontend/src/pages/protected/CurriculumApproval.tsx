import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { CurriculumApprovalPage } from '../../features/curriculum';

function CurriculumApproval() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Curriculum Approval" }));
  }, [dispatch]);

  return <CurriculumApprovalPage />;
}

export default CurriculumApproval; 