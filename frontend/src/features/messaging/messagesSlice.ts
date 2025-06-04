import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messageApi, { 
  Message, 
  MessageGroup, 
  Contact, 
  Conversation, 
  CreateMessageRequest, 
  UpdateMessageRequest,
  CreateMessageGroupRequest 
} from '../../api/services/messageApi';

export interface MessagesState {
  messages: Message[];
  conversations: Conversation[];
  contacts: Contact[];
  messageGroups: MessageGroup[];
  currentConversation: Conversation | null;
  currentMessage: Message | null;
  unreadCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  conversations: [],
  contacts: [],
  messageGroups: [],
  currentConversation: null,
  currentMessage: null,
  unreadCount: 0,
  status: 'idle',
  error: null
};

// Async thunks for messages
export const fetchUserMessages = createAsyncThunk(
  'messages/fetchUserMessages',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await messageApi.getUserMessages(userId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'messages/fetchConversationMessages',
  async ({ userId1, userId2 }: { userId1: number; userId2: number }, { rejectWithValue }) => {
    try {
      const response = await messageApi.getConversationMessages(userId1, userId2);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch conversation messages';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchGroupMessages = createAsyncThunk(
  'messages/fetchGroupMessages',
  async (groupId: number, { rejectWithValue }) => {
    try {
      const response = await messageApi.getGroupMessages(groupId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch group messages';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await messageApi.getConversationsForUser(userId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch conversations';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchContacts = createAsyncThunk(
  'messages/fetchContacts',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await messageApi.getContactsForStudent(studentId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contacts';
      return rejectWithValue(errorMessage);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData: CreateMessageRequest, { rejectWithValue }) => {
    try {
      const response = await messageApi.sendMessage(messageData);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateMessage = createAsyncThunk(
  'messages/updateMessage',
  async ({ id, messageData }: { id: number; messageData: UpdateMessageRequest }, { rejectWithValue }) => {
    try {
      const response = await messageApi.updateMessage(id, messageData);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update message';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (id: number, { rejectWithValue }) => {
    try {
      await messageApi.deleteMessage(id);
      return { id };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete message';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'messages/markMessageAsRead',
  async ({ messageId, userId }: { messageId: number; userId: number }, { rejectWithValue }) => {
    try {
      await messageApi.markMessageAsRead(messageId, userId);
      return { messageId, userId };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark message as read';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markConversationAsRead = createAsyncThunk(
  'messages/markConversationAsRead',
  async ({ userId, partnerId }: { userId: number; partnerId: number }, { rejectWithValue }) => {
    try {
      await messageApi.markConversationAsRead(userId, partnerId);
      return { userId, partnerId };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark conversation as read';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'messages/fetchUnreadCount',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await messageApi.getUnreadMessageCount(userId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch unread count';
      return rejectWithValue(errorMessage);
    }
  }
);

// Message Groups
export const fetchUserGroups = createAsyncThunk(
  'messages/fetchUserGroups',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await messageApi.getUserGroups(userId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user groups';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchMemberGroups = createAsyncThunk(
  'messages/fetchMemberGroups',
  async (memberId: number, { rejectWithValue }) => {
    try {
      const response = await messageApi.getMemberGroups(memberId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch member groups';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createMessageGroup = createAsyncThunk(
  'messages/createMessageGroup',
  async (groupData: CreateMessageGroupRequest, { rejectWithValue }) => {
    try {
      const response = await messageApi.createGroup(groupData);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create message group';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateMessageGroup = createAsyncThunk(
  'messages/updateMessageGroup',
  async ({ id, groupData }: { id: number; groupData: Partial<CreateMessageGroupRequest> }, { rejectWithValue }) => {
    try {
      const response = await messageApi.updateGroup(id, groupData);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update message group';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteMessageGroup = createAsyncThunk(
  'messages/deleteMessageGroup',
  async (groupId: number, { rejectWithValue }) => {
    try {
      await messageApi.deleteGroup(groupId);
      return { id: groupId };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete message group';
      return rejectWithValue(errorMessage);
    }
  }
);

export const addGroupMember = createAsyncThunk(
  'messages/addGroupMember',
  async ({ groupId, userId }: { groupId: number; userId: number }, { rejectWithValue }) => {
    try {
      const response = await messageApi.addGroupMember(groupId, userId);
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add group member';
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeGroupMember = createAsyncThunk(
  'messages/removeGroupMember',
  async ({ groupId, userId }: { groupId: number; userId: number }, { rejectWithValue }) => {
    try {
      await messageApi.removeGroupMember(groupId, userId);
      return { groupId, userId };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove group member';
      return rejectWithValue(errorMessage);
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearCurrentMessage: (state) => {
      state.currentMessage = null;
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    clearMessagesError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const exists = state.messages.find(m => m.id === message.id);
      if (!exists) {
        state.messages.push(message);
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, isRead, isDelivered, readAt, deliveredAt } = action.payload;
      const message = state.messages.find(m => m.id === messageId);
      if (message) {
        if (isRead !== undefined) message.isRead = isRead;
        if (isDelivered !== undefined) message.isDelivered = isDelivered;
        if (readAt) message.readAt = readAt;
        if (deliveredAt) message.deliveredAt = deliveredAt;
      }
    },
    updateConversationUnreadCount: (state, action) => {
      const { conversationId, unreadCount } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.unreadCount = unreadCount;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user messages
      .addCase(fetchUserMessages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUserMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch messages';
      })

      // Fetch conversation messages
      .addCase(fetchConversationMessages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch conversation messages';
      })

      // Fetch group messages
      .addCase(fetchGroupMessages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGroupMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGroupMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch group messages';
      })

      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.conversations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch conversations';
      })

      // Fetch contacts
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contacts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch contacts';
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload && !Array.isArray(action.payload)) {
          const message = action.payload as Message;
          const exists = state.messages.find(m => m.id === message.id);
          if (!exists) {
            state.messages.push(message);
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to send message';
      })

      // Update message
      .addCase(updateMessage.fulfilled, (state, action) => {
        if (action.payload && !Array.isArray(action.payload)) {
          const message = action.payload as Message;
          const index = state.messages.findIndex(m => m.id === message.id);
          if (index !== -1) {
            state.messages[index] = message;
          }
        }
      })

      // Delete message
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(m => m.id !== action.payload.id);
      })

      // Mark message as read
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const { messageId } = action.payload;
        const message = state.messages.find(m => m.id === messageId);
        if (message) {
          message.isRead = true;
          message.readAt = new Date().toISOString();
        }
      })

      // Mark conversation as read
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        const { partnerId } = action.payload;
        const conversation = state.conversations.find(c => c.participantId === partnerId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload || 0;
      })

      // Fetch user groups
      .addCase(fetchUserGroups.fulfilled, (state, action) => {
        state.messageGroups = Array.isArray(action.payload) ? action.payload : [];
      })

      // Fetch member groups
      .addCase(fetchMemberGroups.fulfilled, (state, action) => {
        const memberGroups = Array.isArray(action.payload) ? action.payload : [];
        // Merge with existing groups, avoiding duplicates
        const existingIds = state.messageGroups.map(g => g.id);
        const newGroups = memberGroups.filter(g => !existingIds.includes(g.id));
        state.messageGroups = [...state.messageGroups, ...newGroups];
      })

      // Create message group
      .addCase(createMessageGroup.fulfilled, (state, action) => {
        if (action.payload && !Array.isArray(action.payload)) {
          const group = action.payload as MessageGroup;
          state.messageGroups.push(group);
        }
      })

      // Update message group
      .addCase(updateMessageGroup.fulfilled, (state, action) => {
        if (action.payload && !Array.isArray(action.payload)) {
          const group = action.payload as MessageGroup;
          const index = state.messageGroups.findIndex(g => g.id === group.id);
          if (index !== -1) {
            state.messageGroups[index] = group;
          }
        }
      })

      // Delete message group
      .addCase(deleteMessageGroup.fulfilled, (state, action) => {
        state.messageGroups = state.messageGroups.filter(g => g.id !== action.payload.id);
      })

      // Add group member
      .addCase(addGroupMember.fulfilled, (state, action) => {
        if (action.payload && !Array.isArray(action.payload)) {
          const group = action.payload as MessageGroup;
          const index = state.messageGroups.findIndex(g => g.id === group.id);
          if (index !== -1) {
            state.messageGroups[index] = group;
          }
        }
      })

      // Remove group member
      .addCase(removeGroupMember.fulfilled, (state, action) => {
        const { groupId, userId } = action.payload;
        const group = state.messageGroups.find(g => g.id === groupId);
        if (group && group.memberIds) {
          group.memberIds = group.memberIds.filter(id => id !== userId);
        }
      });
  }
});

export const {
  clearCurrentMessage,
  clearCurrentConversation,
  clearMessagesError,
  setCurrentConversation,
  addMessage,
  updateMessageStatus,
  updateConversationUnreadCount
} = messagesSlice.actions;

export default messagesSlice.reducer; 