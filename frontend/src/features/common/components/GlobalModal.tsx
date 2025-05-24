import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../modalSlice';
import { ModalContentSwitch } from './ModalContentSwitch';

export function GlobalModal() {
  const dispatch = useAppDispatch();
  const { isOpen, title, bodyType, extraObject, size } = useAppSelector(state => state.modal);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Focus the first focusable element in the modal
    const focusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();

    // ESC to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(closeModal({}));
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dispatch]);

  if (!isOpen || !bodyType) return null;

  const modalSize = size || 'md';
  
  return (
    <dialog className="modal modal-open">
      <div
        ref={modalRef}
        className={`modal-box ${modalSize === 'lg' ? 'max-w-4xl' : modalSize === 'xl' ? 'max-w-6xl' : 'max-w-2xl'} w-full`}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <h3 className="font-bold text-lg">{title}</h3>
        <button
          onClick={() => dispatch(closeModal({}))}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <div className="py-4">
          <ModalContentSwitch 
            content={bodyType} 
            contentProps={extraObject} 
          />
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => dispatch(closeModal({}))}>close</button>
      </form>
    </dialog>
  );
} 