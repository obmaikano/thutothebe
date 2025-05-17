import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../commonSlice';
import { ModalContentSwitch } from './ModalContentSwitch';

export function GlobalModal() {
  const dispatch = useAppDispatch();
  const { modalOpen, modalContent } = useAppSelector(state => state.common);

  if (!modalOpen || !modalContent) return null;

  // Check if this is a custom modal type or a direct React node
  const isCustomModal = typeof modalContent.content === 'string';
  const size = modalContent.size || 'md';
  
  return (
    <dialog className="modal modal-open">
      <div className={`modal-box ${size === 'lg' ? 'max-w-4xl' : 'max-w-2xl'} w-full`}>
        <h3 className="font-bold text-lg">{modalContent.title}</h3>
        <button
          onClick={() => dispatch(closeModal())}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <div className="py-4">
          {isCustomModal ? (
            <ModalContentSwitch 
              content={modalContent.content as string} 
              contentProps={modalContent.contentProps} 
            />
          ) : (
            modalContent.content
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => dispatch(closeModal())}>close</button>
      </form>
    </dialog>
  );
} 