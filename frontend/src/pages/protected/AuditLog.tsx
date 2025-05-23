import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import AuditLogPage from '../../features/admin/pages/AuditLogPage';

const AuditLog = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: 'Audit Log' }));
    }, [dispatch]);

    return (
        <div className="audit-log-container">
            <AuditLogPage />
        </div>
    );
};

export default AuditLog; 