import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { closeModal } from '../features/common/modalSlice';
import { MODAL_BODY_TYPES } from '../utils/modalConstants';
import { ModalContentSwitch } from '../features/common/components/ModalContentSwitch';

const ModalLayout: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isOpen, title, bodyType, extraObject, size } = useAppSelector(state => state.modal);

    const close = () => {
        dispatch(closeModal({}));
    };

    return (
        <>
            {/* Modal */}
            <div className={`modal ${isOpen ? "modal-open" : ""}`}>
                <div className={`modal-box ${
                    size === 'sm' ? 'max-w-sm' : 
                    size === 'lg' ? 'max-w-4xl' : 
                    size === 'xl' ? 'max-w-6xl' : 
                    'max-w-2xl'
                } w-full`}>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">{title}</h3>
                        <button 
                            className="btn btn-sm btn-circle btn-ghost"
                            onClick={close}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Loading modal body according to different modal type */}
                    <div className="py-4">
                        <ModalContentSwitch content={bodyType} contentProps={extraObject} />
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={close}>close</button>
                </form>
            </div>
        </>
    );
};

export default ModalLayout; 