import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { Frown } from 'lucide-react'; // Importing Frown icon from Lucide

function InternalPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "404 - Not Found" }));
    }, [dispatch]);

    return (
        <div className="hero h-4/5 bg-base-200">
            <div className="hero-content text-accent text-center">
                <div className="max-w-md">
                    <Frown className="h-48 w-48 inline-block" /> {/* Using Lucide Frown icon */}
                    <h1 className="text-5xl font-bold">404 - Not Found</h1>
                </div>
            </div>
        </div>
    );
}

export default InternalPage;