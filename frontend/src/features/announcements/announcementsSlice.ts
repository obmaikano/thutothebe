import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import announcementApi, { 
  Announcement, 
  CreateAnnouncementRequest, 
  UpdateAnnouncementRequest,
  PagedAnnouncementResponse 
} from '../../api/services/announcementApi';

export interface AnnouncementsState {
  announcements: Announcement[];
  currentAnnouncement: Announcement | null;
  myAnnouncements: Announcement[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  } | null;
  pendingAcknowledgmentsCount: number;
  filter: {
    type?: string;
    priority?: string;
    searchTerm?: string;
    showUnreadOnly?: boolean;
  };
}

const initialState: AnnouncementsState = {
  announcements: [],
  currentAnnouncement: null,
  myAnnouncements: [],
  status: 'idle',
  error: null,
  pagination: null,
  pendingAcknowledgmentsCount: 0,
  filter: {}
};

// Async thunks
export const fetchAnnouncementsForUser = createAsyncThunk(
  'announcements/fetchAnnouncementsForUser',
  async ({ userId, page = 0, size = 20 }: { userId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.getForUser(userId, page, size);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcements');
    }
  }
);

export const fetchAnnouncementById = createAsyncThunk(
  'announcements/fetchAnnouncementById',
  async ({ id, userId }: { id: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.getByIdWithUserStatus(id, userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcement');
    }
  }
);

export const fetchAnnouncementsByType = createAsyncThunk(
  'announcements/fetchAnnouncementsByType',
  async ({ userId, type, page = 0, size = 20 }: { userId: number; type: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.getByType(userId, type, page, size);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcements by type');
    }
  }
);

export const fetchAnnouncementsByCreator = createAsyncThunk(
  'announcements/fetchAnnouncementsByCreator',
  async ({ creatorId, page = 0, size = 20 }: { creatorId: number; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.getByCreator(creatorId, page, size);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcements by creator');
    }
  }
);

export const fetchGlobalAnnouncements = createAsyncThunk(
  'announcements/fetchGlobalAnnouncements',
  async ({ page = 0, size = 20 }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.getGlobal(page, size);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch global announcements');
    }
  }
);

export const searchAnnouncements = createAsyncThunk(
  'announcements/searchAnnouncements',
  async ({ userId, searchTerm, page = 0, size = 20 }: { userId: number; searchTerm: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.search(userId, searchTerm, page, size);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search announcements');
    }
  }
);

export const fetchAnnouncementsByTag = createAsyncThunk(
  'announcements/fetchAnnouncementsByTag',
  async ({ userId, tag, page = 0, size = 20 }: { userId: number; tag: string; page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.getByTag(userId, tag, page, size);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcements by tag');
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  'announcements/createAnnouncement',
  async ({ creatorId, announcementData }: { creatorId: number; announcementData: CreateAnnouncementRequest }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.create(creatorId, announcementData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create announcement');
    }
  }
);

export const updateAnnouncement = createAsyncThunk(
  'announcements/updateAnnouncement',
  async ({ id, userId, announcementData }: { id: number; userId: number; announcementData: UpdateAnnouncementRequest }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.update(id, userId, announcementData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update announcement');
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  'announcements/deleteAnnouncement',
  async ({ id, userId }: { id: number; userId: number }, { rejectWithValue }) => {
    try {
      await announcementApi.delete(id, userId);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete announcement');
    }
  }
);

export const markAnnouncementAsRead = createAsyncThunk(
  'announcements/markAnnouncementAsRead',
  async ({ announcementId, userId }: { announcementId: number; userId: number }, { rejectWithValue }) => {
    try {
      await announcementApi.markAsRead(announcementId, userId);
      return announcementId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark announcement as read');
    }
  }
);

export const acknowledgeAnnouncement = createAsyncThunk(
  'announcements/acknowledgeAnnouncement',
  async ({ announcementId, userId, note }: { announcementId: number; userId: number; note?: string }, { rejectWithValue }) => {
    try {
      await announcementApi.acknowledge(announcementId, userId, note);
      return announcementId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to acknowledge announcement');
    }
  }
);

export const fetchPendingAcknowledgmentsCount = createAsyncThunk(
  'announcements/fetchPendingAcknowledgmentsCount',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await announcementApi.getPendingAcknowledgmentsCount(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending acknowledgments count');
    }
  }
);

export const toggleAnnouncementStatus = createAsyncThunk(
  'announcements/toggleAnnouncementStatus',
  async ({ id, userId }: { id: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.toggleStatus(id, userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle announcement status');
    }
  }
);

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    clearCurrentAnnouncement: (state) => {
      state.currentAnnouncement = null;
    },
    clearAnnouncementsError: (state) => {
      state.error = null;
    },
    setAnnouncementFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearAnnouncementFilter: (state) => {
      state.filter = {};
    },
    markAsReadLocally: (state, action) => {
      const announcementId = action.payload;
      const announcement = state.announcements.find(a => a.id === announcementId);
      if (announcement) {
        announcement.isRead = true;
        if (announcement.readCount !== undefined) {
          announcement.readCount += 1;
        }
      }
      if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
        state.currentAnnouncement.isRead = true;
        if (state.currentAnnouncement.readCount !== undefined) {
          state.currentAnnouncement.readCount += 1;
        }
      }
    },
    markAsAcknowledgedLocally: (state, action) => {
      const announcementId = action.payload;
      const announcement = state.announcements.find(a => a.id === announcementId);
      if (announcement) {
        announcement.isAcknowledged = true;
        if (announcement.acknowledgmentCount !== undefined) {
          announcement.acknowledgmentCount += 1;
        }
      }
      if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
        state.currentAnnouncement.isAcknowledged = true;
        if (state.currentAnnouncement.acknowledgmentCount !== undefined) {
          state.currentAnnouncement.acknowledgmentCount += 1;
        }
      }
      // Decrease pending acknowledgments count
      if (state.pendingAcknowledgmentsCount > 0) {
        state.pendingAcknowledgmentsCount -= 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch announcements for user
      .addCase(fetchAnnouncementsForUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnnouncementsForUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.announcements = action.payload.content || [];
          state.pagination = {
            totalElements: action.payload.totalElements || 0,
            totalPages: action.payload.totalPages || 0,
            size: action.payload.size || 20,
            number: action.payload.number || 0,
            first: action.payload.first || true,
            last: action.payload.last || true
          };
        }
      })
      .addCase(fetchAnnouncementsForUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch announcements';
      })

      // Fetch announcement by ID
      .addCase(fetchAnnouncementById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnnouncementById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentAnnouncement = action.payload as Announcement;
      })
      .addCase(fetchAnnouncementById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch announcement';
      })

      // Fetch announcements by type
      .addCase(fetchAnnouncementsByType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnnouncementsByType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.announcements = action.payload.content || [];
          state.pagination = {
            totalElements: action.payload.totalElements || 0,
            totalPages: action.payload.totalPages || 0,
            size: action.payload.size || 20,
            number: action.payload.number || 0,
            first: action.payload.first || true,
            last: action.payload.last || true
          };
        }
      })
      .addCase(fetchAnnouncementsByType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch announcements by type';
      })

      // Fetch announcements by creator
      .addCase(fetchAnnouncementsByCreator.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnnouncementsByCreator.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.myAnnouncements = action.payload.content || [];
          state.pagination = {
            totalElements: action.payload.totalElements || 0,
            totalPages: action.payload.totalPages || 0,
            size: action.payload.size || 20,
            number: action.payload.number || 0,
            first: action.payload.first || true,
            last: action.payload.last || true
          };
        }
      })
      .addCase(fetchAnnouncementsByCreator.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch announcements by creator';
      })

      // Fetch global announcements
      .addCase(fetchGlobalAnnouncements.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGlobalAnnouncements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.announcements = action.payload.content || [];
          state.pagination = {
            totalElements: action.payload.totalElements || 0,
            totalPages: action.payload.totalPages || 0,
            size: action.payload.size || 20,
            number: action.payload.number || 0,
            first: action.payload.first || true,
            last: action.payload.last || true
          };
        }
      })
      .addCase(fetchGlobalAnnouncements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch global announcements';
      })

      // Search announcements
      .addCase(searchAnnouncements.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchAnnouncements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.announcements = action.payload.content || [];
          state.pagination = {
            totalElements: action.payload.totalElements || 0,
            totalPages: action.payload.totalPages || 0,
            size: action.payload.size || 20,
            number: action.payload.number || 0,
            first: action.payload.first || true,
            last: action.payload.last || true
          };
        }
      })
      .addCase(searchAnnouncements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to search announcements';
      })

      // Fetch announcements by tag
      .addCase(fetchAnnouncementsByTag.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnnouncementsByTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.announcements = action.payload.content || [];
          state.pagination = {
            totalElements: action.payload.totalElements || 0,
            totalPages: action.payload.totalPages || 0,
            size: action.payload.size || 20,
            number: action.payload.number || 0,
            first: action.payload.first || true,
            last: action.payload.last || true
          };
        }
      })
      .addCase(fetchAnnouncementsByTag.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch announcements by tag';
      })

      // Create announcement
      .addCase(createAnnouncement.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.announcements.unshift(action.payload as Announcement);
          state.myAnnouncements.unshift(action.payload as Announcement);
        }
      })
      .addCase(createAnnouncement.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create announcement';
      })

      // Update announcement
      .addCase(updateAnnouncement.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const updatedAnnouncement = action.payload as Announcement;
          const index = state.announcements.findIndex(a => a.id === updatedAnnouncement.id);
          if (index !== -1) {
            state.announcements[index] = updatedAnnouncement;
          }
          const myIndex = state.myAnnouncements.findIndex(a => a.id === updatedAnnouncement.id);
          if (myIndex !== -1) {
            state.myAnnouncements[myIndex] = updatedAnnouncement;
          }
          if (state.currentAnnouncement && state.currentAnnouncement.id === updatedAnnouncement.id) {
            state.currentAnnouncement = updatedAnnouncement;
          }
        }
      })
      .addCase(updateAnnouncement.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update announcement';
      })

      // Delete announcement
      .addCase(deleteAnnouncement.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const deletedId = action.payload;
        state.announcements = state.announcements.filter(a => a.id !== deletedId);
        state.myAnnouncements = state.myAnnouncements.filter(a => a.id !== deletedId);
        if (state.currentAnnouncement && state.currentAnnouncement.id === deletedId) {
          state.currentAnnouncement = null;
        }
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete announcement';
      })

      // Mark as read
      .addCase(markAnnouncementAsRead.fulfilled, (state, action) => {
        const announcementId = action.payload;
        const announcement = state.announcements.find(a => a.id === announcementId);
        if (announcement) {
          announcement.isRead = true;
          if (announcement.readCount !== undefined) {
            announcement.readCount += 1;
          }
        }
        if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
          state.currentAnnouncement.isRead = true;
          if (state.currentAnnouncement.readCount !== undefined) {
            state.currentAnnouncement.readCount += 1;
          }
        }
      })

      // Acknowledge announcement
      .addCase(acknowledgeAnnouncement.fulfilled, (state, action) => {
        const announcementId = action.payload;
        const announcement = state.announcements.find(a => a.id === announcementId);
        if (announcement) {
          announcement.isAcknowledged = true;
          if (announcement.acknowledgmentCount !== undefined) {
            announcement.acknowledgmentCount += 1;
          }
        }
        if (state.currentAnnouncement && state.currentAnnouncement.id === announcementId) {
          state.currentAnnouncement.isAcknowledged = true;
          if (state.currentAnnouncement.acknowledgmentCount !== undefined) {
            state.currentAnnouncement.acknowledgmentCount += 1;
          }
        }
        // Decrease pending acknowledgments count
        if (state.pendingAcknowledgmentsCount > 0) {
          state.pendingAcknowledgmentsCount -= 1;
        }
      })

      // Fetch pending acknowledgments count
      .addCase(fetchPendingAcknowledgmentsCount.fulfilled, (state, action) => {
        state.pendingAcknowledgmentsCount = action.payload || 0;
      })

      // Toggle announcement status
      .addCase(toggleAnnouncementStatus.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(toggleAnnouncementStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const updatedAnnouncement = action.payload as Announcement;
          const index = state.announcements.findIndex(a => a.id === updatedAnnouncement.id);
          if (index !== -1) {
            state.announcements[index] = updatedAnnouncement;
          }
          const myIndex = state.myAnnouncements.findIndex(a => a.id === updatedAnnouncement.id);
          if (myIndex !== -1) {
            state.myAnnouncements[myIndex] = updatedAnnouncement;
          }
          if (state.currentAnnouncement && state.currentAnnouncement.id === updatedAnnouncement.id) {
            state.currentAnnouncement = updatedAnnouncement;
          }
        }
      })
      .addCase(toggleAnnouncementStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to toggle announcement status';
      });
  }
});

export const {
  clearCurrentAnnouncement,
  clearAnnouncementsError,
  setAnnouncementFilter,
  clearAnnouncementFilter,
  markAsReadLocally,
  markAsAcknowledgedLocally
} = announcementsSlice.actions;

export default announcementsSlice.reducer; 