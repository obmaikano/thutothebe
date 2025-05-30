import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import calendarEventApi, { CalendarEvent, CreateCalendarEventRequest, UpdateCalendarEventRequest } from '../../api/services/calendarEventApi';

export interface CalendarEventsState {
  events: CalendarEvent[];
  currentEvent: CalendarEvent | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  calendarView: 'month' | 'week' | 'day' | 'list';
  selectedDate: string;
  filters: {
    eventType: string;
    scope: string;
    status: string;
    showMyEventsOnly: boolean;
  };
}

const initialState: CalendarEventsState = {
  events: [],
  currentEvent: null,
  status: 'idle',
  error: null,
  calendarView: 'month',
  selectedDate: new Date().toISOString(),
  filters: {
    eventType: '',
    scope: '',
    status: '',
    showMyEventsOnly: false,
  }
};

// Async thunks
export const fetchCalendarEvents = createAsyncThunk(
  'calendarEvents/fetchCalendarEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar events');
    }
  }
);

export const fetchCalendarEventById = createAsyncThunk(
  'calendarEvents/fetchCalendarEventById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calendar event');
    }
  }
);

export const fetchEventsBetweenDates = createAsyncThunk(
  'calendarEvents/fetchEventsBetweenDates',
  async ({ startTime, endTime }: { startTime: string; endTime: string }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getDateRange(startTime, endTime);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events for date range');
    }
  }
);

export const fetchUserEvents = createAsyncThunk(
  'calendarEvents/fetchUserEvents',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getUserEvents(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user events');
    }
  }
);

export const fetchCreatedByUser = createAsyncThunk(
  'calendarEvents/fetchCreatedByUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getCreatedByUser(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch created events');
    }
  }
);

export const fetchAttendingEvents = createAsyncThunk(
  'calendarEvents/fetchAttendingEvents',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getAttendingEvents(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attending events');
    }
  }
);

export const fetchOrganizingEvents = createAsyncThunk(
  'calendarEvents/fetchOrganizingEvents',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getOrganizingEvents(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizing events');
    }
  }
);

export const fetchUpcomingEvents = createAsyncThunk(
  'calendarEvents/fetchUpcomingEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getUpcoming();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming events');
    }
  }
);

export const fetchTodaysEvents = createAsyncThunk(
  'calendarEvents/fetchTodaysEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getToday();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch today\'s events');
    }
  }
);

export const fetchThisWeeksEvents = createAsyncThunk(
  'calendarEvents/fetchThisWeeksEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getThisWeek();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch this week\'s events');
    }
  }
);

export const fetchEventsByType = createAsyncThunk(
  'calendarEvents/fetchEventsByType',
  async (eventType: string, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getByType(eventType);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events by type');
    }
  }
);

export const fetchEventsByStatus = createAsyncThunk(
  'calendarEvents/fetchEventsByStatus',
  async (status: string, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getByStatus(status);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events by status');
    }
  }
);

export const fetchPendingApprovalEvents = createAsyncThunk(
  'calendarEvents/fetchPendingApprovalEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getPendingApproval();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending approval events');
    }
  }
);

export const fetchMonthEvents = createAsyncThunk(
  'calendarEvents/fetchMonthEvents',
  async ({ userId, year, month }: { userId: number; year: number; month: number }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.getMonthEvents(userId, year, month);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch month events');
    }
  }
);

export const searchEvents = createAsyncThunk(
  'calendarEvents/searchEvents',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.search(searchTerm);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search events');
    }
  }
);

export const createCalendarEvent = createAsyncThunk(
  'calendarEvents/createCalendarEvent',
  async (eventData: CreateCalendarEventRequest, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.create(eventData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create calendar event');
    }
  }
);

export const updateCalendarEvent = createAsyncThunk(
  'calendarEvents/updateCalendarEvent',
  async ({ id, eventData }: { id: number; eventData: UpdateCalendarEventRequest }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.update(id, eventData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update calendar event');
    }
  }
);

export const deleteCalendarEvent = createAsyncThunk(
  'calendarEvents/deleteCalendarEvent',
  async (id: number, { rejectWithValue }) => {
    try {
      await calendarEventApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete calendar event');
    }
  }
);

export const addAttendee = createAsyncThunk(
  'calendarEvents/addAttendee',
  async ({ eventId, userId }: { eventId: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.addAttendee(eventId, userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add attendee');
    }
  }
);

export const removeAttendee = createAsyncThunk(
  'calendarEvents/removeAttendee',
  async ({ eventId, userId }: { eventId: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.removeAttendee(eventId, userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove attendee');
    }
  }
);

export const addOrganizer = createAsyncThunk(
  'calendarEvents/addOrganizer',
  async ({ eventId, userId }: { eventId: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.addOrganizer(eventId, userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add organizer');
    }
  }
);

export const removeOrganizer = createAsyncThunk(
  'calendarEvents/removeOrganizer',
  async ({ eventId, userId }: { eventId: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.removeOrganizer(eventId, userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove organizer');
    }
  }
);

export const approveEvent = createAsyncThunk(
  'calendarEvents/approveEvent',
  async ({ eventId, approverId, approvalNotes }: { eventId: number; approverId: number; approvalNotes?: string }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.approve(eventId, approverId, approvalNotes);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve event');
    }
  }
);

export const rejectEvent = createAsyncThunk(
  'calendarEvents/rejectEvent',
  async ({ eventId, approverId, rejectionNotes }: { eventId: number; approverId: number; rejectionNotes?: string }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.reject(eventId, approverId, rejectionNotes);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject event');
    }
  }
);

export const markEventAsOngoing = createAsyncThunk(
  'calendarEvents/markEventAsOngoing',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.markAsOngoing(eventId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark event as ongoing');
    }
  }
);

export const markEventAsCompleted = createAsyncThunk(
  'calendarEvents/markEventAsCompleted',
  async (eventId: number, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.markAsCompleted(eventId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark event as completed');
    }
  }
);

export const cancelEvent = createAsyncThunk(
  'calendarEvents/cancelEvent',
  async ({ eventId, reason }: { eventId: number; reason: string }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.cancel(eventId, reason);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel event');
    }
  }
);

export const postponeEvent = createAsyncThunk(
  'calendarEvents/postponeEvent',
  async ({ eventId, newStartTime, newEndTime }: { eventId: number; newStartTime: string; newEndTime: string }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.postpone(eventId, newStartTime, newEndTime);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to postpone event');
    }
  }
);

export const rescheduleEvent = createAsyncThunk(
  'calendarEvents/rescheduleEvent',
  async ({ eventId, newStartTime, newEndTime }: { eventId: number; newStartTime: string; newEndTime: string }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.reschedule(eventId, newStartTime, newEndTime);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reschedule event');
    }
  }
);

export const findConflictingEvents = createAsyncThunk(
  'calendarEvents/findConflictingEvents',
  async ({ eventId, location, startTime, endTime }: { eventId: number; location: string; startTime: string; endTime: string }, { rejectWithValue }) => {
    try {
      const response = await calendarEventApi.findConflicts(eventId, location, startTime, endTime);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to find conflicting events');
    }
  }
);

const calendarEventsSlice = createSlice({
  name: 'calendarEvents',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearCalendarError: (state) => {
      state.error = null;
    },
    setCalendarView: (state, action) => {
      state.calendarView = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setEventTypeFilter: (state, action) => {
      state.filters.eventType = action.payload;
    },
    setScopeFilter: (state, action) => {
      state.filters.scope = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    setShowMyEventsOnly: (state, action) => {
      state.filters.showMyEventsOnly = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        eventType: '',
        scope: '',
        status: '',
        showMyEventsOnly: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all calendar events
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch calendar event by ID
      .addCase(fetchCalendarEventById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCalendarEventById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentEvent = action.payload as CalendarEvent;
      })
      .addCase(fetchCalendarEventById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch events between dates
      .addCase(fetchEventsBetweenDates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch user events
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch created by user
      .addCase(fetchCreatedByUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch attending events
      .addCase(fetchAttendingEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch organizing events
      .addCase(fetchOrganizingEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch upcoming events
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch today's events
      .addCase(fetchTodaysEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch this week's events
      .addCase(fetchThisWeeksEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch events by type
      .addCase(fetchEventsByType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch events by status
      .addCase(fetchEventsByStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch pending approval events
      .addCase(fetchPendingApprovalEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch month events
      .addCase(fetchMonthEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Search events
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })

      // Create calendar event
      .addCase(createCalendarEvent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createCalendarEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.events.push(action.payload as CalendarEvent);
        }
      })
      .addCase(createCalendarEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Update calendar event
      .addCase(updateCalendarEvent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCalendarEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })
      .addCase(updateCalendarEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Delete calendar event
      .addCase(deleteCalendarEvent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCalendarEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = state.events.filter(event => event.id !== action.payload);
        if (state.currentEvent && state.currentEvent.id === action.payload) {
          state.currentEvent = null;
        }
      })
      .addCase(deleteCalendarEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Add/Remove attendee
      .addCase(addAttendee.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })
      .addCase(removeAttendee.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })

      // Add/Remove organizer
      .addCase(addOrganizer.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })
      .addCase(removeOrganizer.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })

      // Approve/Reject event
      .addCase(approveEvent.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })
      .addCase(rejectEvent.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })

      // Mark event status changes
      .addCase(markEventAsOngoing.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })
      .addCase(markEventAsCompleted.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })

      // Cancel/Postpone/Reschedule event
      .addCase(cancelEvent.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })
      .addCase(postponeEvent.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      })
      .addCase(rescheduleEvent.fulfilled, (state, action) => {
        if (action.payload) {
          const updatedEvent = action.payload as CalendarEvent;
          const index = state.events.findIndex(event => event.id === updatedEvent.id);
          if (index !== -1) {
            state.events[index] = updatedEvent;
          }
          if (state.currentEvent && state.currentEvent.id === updatedEvent.id) {
            state.currentEvent = updatedEvent;
          }
        }
      });
  }
});

export const {
  clearCurrentEvent,
  clearCalendarError,
  setCalendarView,
  setSelectedDate,
  setEventTypeFilter,
  setScopeFilter,
  setStatusFilter,
  setShowMyEventsOnly,
  clearFilters,
} = calendarEventsSlice.actions;

export default calendarEventsSlice.reducer; 