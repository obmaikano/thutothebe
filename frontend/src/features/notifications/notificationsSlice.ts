import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationApi, { Notification, CreateNotificationRequest, UpdateNotificationRequest } from '../../api/services/notificationApi';

export interface NotificationsState {
  notifications: Notification[];
  currentNotification: Notification | null;
  unreadCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: {
    type: string;
    active: boolean | null;
    unreadOnly: boolean;
  };
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

const initialState: NotificationsState = {
  notifications: [],
  currentNotification: null,
  unreadCount: 0,
  status: 'idle',
  error: null,
  filter: {
    type: '',
    active: null,
    unreadOnly: false,
  },
  pagination: {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  },
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: { recipientId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const { recipientId, page = 0, size = 20 } = params;
      const response = await notificationApi.getByRecipient(recipientId, page, size);
      return {
        notifications: response.data.data.content,
        pagination: {
          page: response.data.data.number,
          size: response.data.data.size,
          totalElements: response.data.data.totalElements,
          totalPages: response.data.data.totalPages,
          hasNext: !response.data.data.last,
          hasPrevious: !response.data.data.first,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchNotificationById = createAsyncThunk(
  'notifications/fetchNotificationById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getById(id);
      return response.data.data as Notification;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notification';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchActiveNotifications = createAsyncThunk(
  'notifications/fetchActiveNotifications',
  async (params: { recipientId: number; active?: boolean; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const { recipientId, active = true, page = 0, size = 20 } = params;
      const response = await notificationApi.getByRecipientAndActive(recipientId, active, page, size);
      return {
        notifications: response.data.data.content,
        pagination: {
          page: response.data.data.number,
          size: response.data.data.size,
          totalElements: response.data.data.totalElements,
          totalPages: response.data.data.totalPages,
          hasNext: !response.data.data.last,
          hasPrevious: !response.data.data.first,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch active notifications';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchNotificationsByType = createAsyncThunk(
  'notifications/fetchNotificationsByType',
  async (params: { recipientId: number; type: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const { recipientId, type, page = 0, size = 20 } = params;
      const response = await notificationApi.getByRecipientAndType(recipientId, type, page, size);
      return {
        notifications: response.data.data.content,
        pagination: {
          page: response.data.data.number,
          size: response.data.data.size,
          totalElements: response.data.data.totalElements,
          totalPages: response.data.data.totalPages,
          hasNext: !response.data.data.last,
          hasPrevious: !response.data.data.first,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch notifications by type';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUnreadNotifications = createAsyncThunk(
  'notifications/fetchUnreadNotifications',
  async (recipientId: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadByRecipient(recipientId);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch unread notifications';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (recipientId: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadCountByRecipient(recipientId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch unread count';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData: CreateNotificationRequest, { rejectWithValue }) => {
    try {
      const response = await notificationApi.create(notificationData);
      return response.data.data as Notification;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create notification';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateNotification = createAsyncThunk(
  'notifications/updateNotification',
  async ({ id, notificationData }: { id: number; notificationData: UpdateNotificationRequest }, { rejectWithValue }) => {
    try {
      const response = await notificationApi.update(id, notificationData);
      return response.data.data as Notification;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update notification';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.markAsRead(id);
      return response.data.data as Notification;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (recipientId: number, { rejectWithValue }) => {
    try {
      await notificationApi.markAllAsRead(recipientId);
      return { recipientId };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark all notifications as read';
      return rejectWithValue(errorMessage);
    }
  }
);

export const archiveNotification = createAsyncThunk(
  'notifications/archive',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.archive(id);
      return response.data.data as Notification;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive notification';
      return rejectWithValue(errorMessage);
    }
  }
);

export const unarchiveNotification = createAsyncThunk(
  'notifications/unarchive',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await notificationApi.unarchive(id);
      return response.data.data as Notification;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unarchive notification';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: number, { rejectWithValue }) => {
    try {
      await notificationApi.delete(id);
      return { id };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete notification';
      return rejectWithValue(errorMessage);
    }
  }
);

export const bulkMarkAsRead = createAsyncThunk(
  'notifications/bulkMarkAsRead',
  async (notificationIds: number[], { rejectWithValue }) => {
    try {
      await notificationApi.bulkMarkAsRead(notificationIds);
      return { notificationIds };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notifications as read';
      return rejectWithValue(errorMessage);
    }
  }
);

export const bulkArchive = createAsyncThunk(
  'notifications/bulkArchive',
  async (notificationIds: number[], { rejectWithValue }) => {
    try {
      await notificationApi.bulkArchive(notificationIds);
      return { notificationIds };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive notifications';
      return rejectWithValue(errorMessage);
    }
  }
);

export const bulkDelete = createAsyncThunk(
  'notifications/bulkDelete',
  async (notificationIds: number[], { rejectWithValue }) => {
    try {
      await notificationApi.bulkDelete(notificationIds);
      return { notificationIds };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete notifications';
      return rejectWithValue(errorMessage);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotification: (state) => {
      state.currentNotification = null;
    },
    clearNotificationsError: (state) => {
      state.error = null;
    },
    setNotificationFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetNotificationFilter: (state) => {
      state.filter = initialState.filter;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.readAt) {
        notification.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        if (!notification.readAt) {
          notification.readAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.readAt) {
        state.unreadCount += 1;
      }
    },
    removeNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.readAt) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch notifications';
      })

      // Fetch notification by ID
      .addCase(fetchNotificationById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentNotification = action.payload;
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch notification';
      })

      // Fetch active notifications
      .addCase(fetchActiveNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchActiveNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active notifications';
      })

      // Fetch notifications by type
      .addCase(fetchNotificationsByType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotificationsByType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotificationsByType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch notifications by type';
      })

      // Fetch unread notifications
      .addCase(fetchUnreadNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
      })
      .addCase(fetchUnreadNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch unread notifications';
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to fetch unread count';
      })

      // Create notification
      .addCase(createNotification.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications.unshift(action.payload);
        if (!action.payload.readAt) {
          state.unreadCount += 1;
        }
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create notification';
      })

      // Update notification
      .addCase(updateNotification.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
        if (state.currentNotification?.id === action.payload.id) {
          state.currentNotification = action.payload;
        }
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update notification';
      })

      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          const wasUnread = !state.notifications[index].readAt;
          state.notifications[index] = action.payload;
          if (wasUnread && action.payload.readAt) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
        if (state.currentNotification?.id === action.payload.id) {
          state.currentNotification = action.payload;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to mark notification as read';
      })

      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          if (!notification.readAt) {
            notification.readAt = new Date().toISOString();
          }
        });
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to mark all notifications as read';
      })

      // Archive notification
      .addCase(archiveNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
        if (state.currentNotification?.id === action.payload.id) {
          state.currentNotification = action.payload;
        }
      })
      .addCase(archiveNotification.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to archive notification';
      })

      // Unarchive notification
      .addCase(unarchiveNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
        if (state.currentNotification?.id === action.payload.id) {
          state.currentNotification = action.payload;
        }
      })
      .addCase(unarchiveNotification.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to unarchive notification';
      })

      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          const notification = state.notifications[index];
          if (!notification.readAt) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(index, 1);
        }
        if (state.currentNotification?.id === action.payload.id) {
          state.currentNotification = null;
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to delete notification';
      })

      // Bulk mark as read
      .addCase(bulkMarkAsRead.fulfilled, (state, action) => {
        const { notificationIds } = action.payload;
        let unreadReduced = 0;
        state.notifications.forEach(notification => {
          if (notificationIds.includes(notification.id) && !notification.readAt) {
            notification.readAt = new Date().toISOString();
            unreadReduced++;
          }
        });
        state.unreadCount = Math.max(0, state.unreadCount - unreadReduced);
      })
      .addCase(bulkMarkAsRead.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to mark notifications as read';
      })

      // Bulk archive
      .addCase(bulkArchive.fulfilled, (state, action) => {
        const { notificationIds } = action.payload;
        state.notifications.forEach(notification => {
          if (notificationIds.includes(notification.id)) {
            notification.active = false;
          }
        });
      })
      .addCase(bulkArchive.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to archive notifications';
      })

      // Bulk delete
      .addCase(bulkDelete.fulfilled, (state, action) => {
        const { notificationIds } = action.payload;
        let unreadReduced = 0;
        state.notifications = state.notifications.filter(notification => {
          if (notificationIds.includes(notification.id)) {
            if (!notification.readAt) {
              unreadReduced++;
            }
            return false;
          }
          return true;
        });
        state.unreadCount = Math.max(0, state.unreadCount - unreadReduced);
      })
      .addCase(bulkDelete.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to delete notifications';
      });
  },
});

export const {
  clearCurrentNotification,
  clearNotificationsError,
  setNotificationFilter,
  resetNotificationFilter,
  markAsRead,
  markAllAsRead,
  addNotification,
  removeNotification,
  updateUnreadCount,
} = notificationsSlice.actions;

export default notificationsSlice.reducer; 