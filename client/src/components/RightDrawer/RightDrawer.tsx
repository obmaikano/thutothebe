import React from 'react';
import { X } from 'lucide-react';
import { closeRightDrawer } from '../../features/common/rightDrawerSlice';
import { RightDrawerState } from '../../app/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

const RightDrawer: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isOpen, title, content } = useAppSelector((state) => state.rightDrawer as RightDrawerState);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <div className="pointer-events-auto w-screen max-w-md">
                        <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                            <div className="px-4 py-6 sm:px-6">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={() => dispatch(closeRightDrawer())}
                                    >
                                        <span className="sr-only">Close panel</span>
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="relative flex-1 px-4 sm:px-6">
                                {content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightDrawer; 