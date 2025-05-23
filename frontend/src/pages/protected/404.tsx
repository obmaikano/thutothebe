import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import NotFound from '../../features/common/components/NotFound';

function InternalPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "404 - Not Found" }));
    }, [dispatch]);

    return (
        <NotFound />
    );
}

export default InternalPage;