import { store } from './store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface HeaderState {
    pageTitle: string;
}

export interface ModalState {
    isOpen: boolean;
    title: string;
    content: React.ReactNode | null;
}

export interface RightDrawerState {
    isOpen: boolean;
    title: string;
    content: React.ReactNode | null;
} 