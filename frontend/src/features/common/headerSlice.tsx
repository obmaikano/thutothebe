import { createSlice } from '@reduxjs/toolkit';

export const headerSlice = createSlice({
    name: 'header',
    initialState: {
        pageTitle: "Home",  // current page title state management
        noOfNotifications: 0,  // number of unread notifications
        newNotificationMessage: "",  // message of notification to be shown
        newNotificationStatus: 1,   // to check the notification type - success/error/info
    },
    reducers: {
        setPageTitle: (state, action) => {
            state.pageTitle = action.payload.title;
        },
        removeNotificationMessage: (state) => {
            state.newNotificationMessage = "";
        },
        showNotification: (state, action) => {
            state.newNotificationMessage = action.payload.message;
            state.newNotificationStatus = action.payload.status;
        },
    }
});

// Export actions
export const { setPageTitle, removeNotificationMessage, showNotification } = headerSlice.actions;

// Export reducer
export default headerSlice.reducer; 