import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import DocumentLibraryPage from '../../features/documents/pages/DocumentLibraryPage';

const Documents = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Documents" }));
    }, [dispatch]);

    return (
        <div className="documents-container">
            <DocumentLibraryPage />
        </div>
    );
};

export default Documents; 