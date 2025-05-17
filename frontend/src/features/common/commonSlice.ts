import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalProps {
  title: string;
  size?: 'sm' | 'md' | 'lg';
  content: React.ReactNode | string;
  contentProps?: any;
  modalType?: string;
}

interface CustomModalPayload {
  modalType: string;
  modalProps: ModalProps;
}

interface CommonState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  theme: 'light' | 'dark';
  pageTitle: string;
  modalOpen: boolean;
  modalContent: ModalProps | null;
  notification: {
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
  } | null;
}

const initialState: CommonState = {
  leftSidebarOpen: false,
  rightSidebarOpen: false,
  theme: 'light',
  pageTitle: '',
  modalOpen: false,
  modalContent: null,
  notification: null
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    toggleLeftSidebar: (state) => {
      state.leftSidebarOpen = !state.leftSidebarOpen;
    },
    toggleRightSidebar: (state) => {
      state.rightSidebarOpen = !state.rightSidebarOpen;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
    openModal: (state, action: PayloadAction<ModalProps | CustomModalPayload>) => {
      state.modalOpen = true;
      
      // Check if this is a custom modal format
      const payload = action.payload as any;
      if (payload.modalType && payload.modalProps) {
        // It's the custom format with modalType and modalProps
        state.modalContent = payload.modalProps;
      } else {
        // It's the direct ModalProps format
        state.modalContent = action.payload as ModalProps;
      }
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.modalContent = null;
    },
    showNotification: (state, action: PayloadAction<CommonState['notification']>) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    }
  }
});

export const {
  toggleLeftSidebar,
  toggleRightSidebar,
  toggleTheme,
  setPageTitle,
  openModal,
  closeModal,
  showNotification,
  clearNotification
} = commonSlice.actions;

export default commonSlice.reducer;