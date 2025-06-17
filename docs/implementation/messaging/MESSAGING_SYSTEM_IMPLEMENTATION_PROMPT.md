# Frontend Implementation Prompt: Messaging System

## Overview
Implement a comprehensive frontend interface for the messaging system targeting all educational roles: **SUPER_ADMIN**, **MINISTRY_EXECUTIVE**, **MINISTRY_STAFF**, **DIRECTOR**, **REGIONAL_ADMIN**, **REGIONAL_OFFICER**, **SCHOOL_ADMIN**, **SCHOOL_HEAD**, **DEPARTMENT_HEAD**, **SENIOR_TEACHER**, **TEACHER**, **STUDENT**, and **PARENT**.

**IMPORTANT**: Follow the established code architecture and patterns in the existing frontend project. Stick strictly to the already established design patterns and conventions. Do not invent or hallucinate new functions, services, or modules that aren't present in the existing codebase. Ensure compatibility and consistency with the existing structure.

## Existing Technology Stack (DO NOT CHANGE)
- **Framework**: React 18+ with TypeScript and Vite
- **State Management**: Redux Toolkit (already configured)
- **UI Library**: DaisyUI with Tailwind CSS (already configured)
- **Routing**: React Router v6+ (already configured)
- **HTTP Client**: Axios with interceptors (already configured)
- **Form Management**: React Hook Form with Zod validation (already available)
- **Data Tables**: React Data Table Component (already available)
- **Charts**: Chart.js with react-chartjs-2 (already configured)
- **Authentication**: JWT token management (already implemented)
- **Icons**: Lucide React (already available)

## Existing Architecture Patterns to Follow

### 1. Redux Store Structure (EXISTING)
The application already uses Redux Toolkit with the following structure:
```typescript
// Existing store structure in src/app/store.ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    // ... other existing reducers
    // ADD NEW REDUCERS HERE:
    messages: messagesReducer,  // TO BE CREATED
    messageGroups: messageGroupsReducer,  // TO BE CREATED
    conversations: conversationsReducer,  // TO BE CREATED
  },
});
```

### 2. Feature-Based Directory Structure (EXISTING)
Follow the existing pattern in `src/features/`:
```
src/features/messaging/
├── pages/
│   ├── MessagingPage.tsx
│   ├── ConversationPage.tsx
│   ├── GroupMessagingPage.tsx
│   ├── ContactsPage.tsx
│   └── MessageArchivePage.tsx
├── components/
│   ├── MessageList.tsx
│   ├── MessageInput.tsx
│   ├── ConversationList.tsx
│   ├── MessageBubble.tsx
│   ├── ContactsList.tsx
│   └── GroupMembersList.tsx
├── modals/
│   ├── NewMessageModal.tsx
│   ├── CreateGroupModal.tsx
│   ├── AddMemberModal.tsx
│   ├── MessageDetailsModal.tsx
│   └── DeleteMessageModal.tsx
├── messagesSlice.ts
├── messageGroupsSlice.ts
├── conversationsSlice.ts
└── index.tsx
```

### 3. API Service Pattern (EXISTING)
Follow the existing pattern in `src/api/services/`:
```typescript
// Create new files following existing pattern:
// src/api/services/messageApi.ts
// src/api/services/messageGroupApi.ts
// src/api/services/conversationApi.ts

import { api } from '../index';
import { AxiosResponse } from 'axios';

// Follow existing UserResponse pattern
export interface MessageResponse {
  status: string;
  message: string;
  data: Message | Message[] | null;
  timestamp: string | null;
}

export interface Message {
  id: number;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO' | 'LINK' | 'SYSTEM';
  senderId: number;
  recipientId?: number;
  groupId?: number;
  parentMessageId?: number;
  isRead: boolean;
  isDelivered: boolean;
  isEdited: boolean;
  editedAt?: string;
  readAt?: string;
  deliveredAt?: string;
  attachments?: string;
  metadata?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  expiresAt?: string;
  isEncrypted: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageGroup {
  id: number;
  name: string;
  description?: string;
  groupType: 'PRIVATE' | 'PUBLIC' | 'ANNOUNCEMENT' | 'CLASS' | 'COURSE' | 'DEPARTMENT' | 'SCHOOL' | 'REGION';
  createdById: number;
  schoolId?: number;
  regionId?: number;
  classId?: number;
  courseId?: number;
  departmentId?: number;
  maxMembers?: number;
  isArchived: boolean;
  lastMessageAt?: string;
  memberCount: number;
  unreadCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: number;
  participant1Id: number;
  participant2Id: number;
  lastMessageId?: number;
  lastMessageAt?: string;
  unreadCount1: number;
  unreadCount2: number;
  isArchived1: boolean;
  isArchived2: boolean;
  isMuted1: boolean;
  isMuted2: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const messageApi = {
  getAll: async (): Promise<AxiosResponse<MessageResponse>> => {
    return api.get('/messages');
  },
  getById: async (id: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/${id}`);
  },
  getByUser: async (userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/user/${userId}`);
  },
  getActiveByUser: async (userId: number, active: boolean = true): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/user/${userId}/active?active=${active}`);
  },
  getConversation: async (senderId: number, recipientId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/conversation?senderId=${senderId}&recipientId=${recipientId}`);
  },
  getActiveConversation: async (senderId: number, recipientId: number, active: boolean = true): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/conversation/active?senderId=${senderId}&recipientId=${recipientId}&active=${active}`);
  },
  getByGroup: async (groupId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/group/${groupId}`);
  },
  getActiveByGroup: async (groupId: number, active: boolean = true): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/group/${groupId}/active?active=${active}`);
  },
  getContactsForStudent: async (studentId: number): Promise<AxiosResponse<any>> => {
    return api.get(`/messages/contacts/student/${studentId}`);
  },
  getConversationsForUser: async (userId: number): Promise<AxiosResponse<any>> => {
    return api.get(`/messages/conversations/user/${userId}`);
  },
  getConversationMessages: async (userId1: number, userId2: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/conversation/${userId1}/${userId2}`);
  },
  getActiveConversationMessages: async (userId1: number, userId2: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.get(`/messages/conversation/${userId1}/${userId2}/active`);
  },
  getUnreadCount: async (userId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/messages/unread-count/${userId}`);
  },
  getUnreadCountForConversation: async (userId: number, partnerId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/messages/unread-count/conversation/${userId}/${partnerId}`);
  },
  getUnreadCountForGroup: async (userId: number, groupId: number): Promise<AxiosResponse<{ data: number }>> => {
    return api.get(`/messages/unread-count/group/${userId}/${groupId}`);
  },
  send: async (messageData: SendMessageRequest): Promise<AxiosResponse<MessageResponse>> => {
    return api.post('/messages', messageData);
  },
  update: async (id: number, messageData: UpdateMessageRequest): Promise<AxiosResponse<MessageResponse>> => {
    return api.put(`/messages/${id}`, messageData);
  },
  updateWithAuth: async (messageId: number, messageData: UpdateMessageRequest, userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.put(`/messages/${messageId}/update?userId=${userId}`, messageData);
  },
  delete: async (id: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.delete(`/messages/${id}`);
  },
  deleteWithAuth: async (messageId: number, userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.delete(`/messages/${messageId}/delete?userId=${userId}`);
  },
  markAsDelivered: async (messageId: number, userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.post(`/messages/${messageId}/delivered?userId=${userId}`);
  },
  markAsRead: async (messageId: number, userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.post(`/messages/${messageId}/read?userId=${userId}`);
  },
  markConversationAsRead: async (userId: number, partnerId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.post(`/messages/conversation/read?userId=${userId}&partnerId=${partnerId}`);
  },
  markGroupMessagesAsRead: async (groupId: number, userId: number): Promise<AxiosResponse<MessageResponse>> => {
    return api.post(`/messages/group/${groupId}/read?userId=${userId}`);
  },
};

export default messageApi;
```

### 4. Component Patterns (EXISTING)
Follow existing component patterns from `src/components/common/`:
- Use existing `Button.tsx`, `Modal.tsx`, `Input.tsx`, `Select.tsx` components
- Follow existing styling with DaisyUI classes
- Use existing `Table.tsx` component for data display
- Follow existing form patterns with React Hook Form

### 5. Page Structure Pattern (EXISTING)
Follow the existing pattern from `src/features/users/pages/UserListPage.tsx`:
```typescript
const MessagingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { messages, conversations, status, error } = useAppSelector(state => state.messages);
  
  // Follow existing useEffect pattern
  useEffect(() => {
    dispatch(fetchConversations());
    return () => {
      dispatch(clearMessagingError());
    };
  }, [dispatch]);

  // Follow existing modal opening pattern
  const handleNewMessage = () => {
    dispatch(openModal({
      title: 'New Message',
      bodyType: MODAL_BODY_TYPES.MESSAGE_NEW,
      size: 'lg'
    }));
  };

  // Follow existing JSX structure with DaisyUI classes
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Communicate with teachers, students, and parents</p>
        </div>
        {/* Follow existing button pattern */}
      </div>
      {/* Rest of component following existing patterns */}
    </div>
  );
};
```

## Core Features to Implement

### 1. Messaging Interface

**New Redux Slices to Create:**
```typescript
// src/features/messaging/messagesSlice.ts
// Follow existing slice pattern from usersSlice.ts
export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    clearCurrentMessage: (state) => {
      state.currentMessage = null;
    },
    clearMessagingError: (state) => {
      state.error = null;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    markMessageAsRead: (state, action) => {
      const message = state.messages.find(m => m.id === action.payload);
      if (message) {
        message.isRead = true;
        message.readAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    // Follow existing async thunk patterns
  }
});
```

**New API Services to Create:**
```typescript
// src/api/services/messageApi.ts
// src/api/services/messageGroupApi.ts
// src/api/services/conversationApi.ts
// Follow existing userApi.ts pattern exactly
```

**New Pages to Create:**
- `MessagingPage.tsx` - Main messaging interface with conversation list
- `ConversationPage.tsx` - Individual conversation view
- `GroupMessagingPage.tsx` - Group messaging interface
- `ContactsPage.tsx` - Manage messaging contacts
- `MessageArchivePage.tsx` - View archived messages

### 2. Real-time Messaging
Live messaging capabilities:
- Real-time message delivery
- Typing indicators
- Read receipts
- Online status indicators
- Message notifications

### 3. Group Messaging
Comprehensive group communication:
- Group creation and management
- Member management
- Group announcements
- File sharing in groups
- Group moderation tools

### 4. Message Management
Advanced messaging features:
- Message search and filtering
- Message archiving
- Message forwarding
- Message reactions
- Message threading

## Implementation Requirements

### 1. Follow Existing Authentication Pattern
Use existing `AuthContext` and `useAuth` hook:
```typescript
// Use existing authentication
const { user } = useAuth();
const userRole = user?.role;

// Use existing role checking pattern
const canCreateGroups = [
  'SUPER_ADMIN',
  'MINISTRY_EXECUTIVE',
  'MINISTRY_STAFF',
  'DIRECTOR',
  'REGIONAL_ADMIN',
  'REGIONAL_OFFICER',
  'SCHOOL_ADMIN',
  'SCHOOL_HEAD',
  'DEPARTMENT_HEAD',
  'SENIOR_TEACHER',
  'TEACHER'
].includes(userRole);

const canSendMessages = [
  'STUDENT',
  'PARENT',
  'TEACHER',
  'SENIOR_TEACHER',
  'DEPARTMENT_HEAD',
  'SCHOOL_HEAD',
  'SCHOOL_ADMIN',
  'REGIONAL_OFFICER',
  'REGIONAL_ADMIN',
  'DIRECTOR',
  'MINISTRY_STAFF',
  'MINISTRY_EXECUTIVE',
  'SUPER_ADMIN'
].includes(userRole);
```

### 2. Follow Existing Modal Pattern
Use existing modal system from `src/features/common/modalSlice.ts`:
```typescript
// Add new modal types to existing MODAL_BODY_TYPES
export const MODAL_BODY_TYPES = {
  // ... existing types
  MESSAGE_NEW: "MESSAGE_NEW",
  MESSAGE_GROUP_CREATE: "MESSAGE_GROUP_CREATE",
  MESSAGE_GROUP_ADD_MEMBER: "MESSAGE_GROUP_ADD_MEMBER",
  MESSAGE_DETAILS: "MESSAGE_DETAILS",
  MESSAGE_DELETE_CONFIRMATION: "MESSAGE_DELETE_CONFIRMATION",
  MESSAGE_FORWARD: "MESSAGE_FORWARD",
};
```

### 3. Follow Existing Error Handling
Use existing error patterns from other slices:
```typescript
// Follow existing error handling pattern
const handleSendMessage = async (messageData: SendMessageData) => {
  try {
    await dispatch(sendMessage(messageData)).unwrap();
    // Success handling
  } catch (error) {
    console.error('Failed to send message:', error);
    // Error handling following existing pattern
  }
};
```

### 4. Follow Existing Styling Patterns
Use existing DaisyUI classes and patterns:
```typescript
// Follow existing button patterns
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">

// Follow existing card patterns
<div className="bg-white border border-gray-200 rounded-lg p-6">

// Follow existing table patterns using existing Table component
<Table 
  data={messages}
  columns={columns}
  // ... other props following existing pattern
/>
```

## Specific Components to Create

### 1. Message List Component
```typescript
// src/features/messaging/components/MessageList.tsx
// Display list of messages in conversation
// Follow existing component patterns
```

### 2. Message Input Component
```typescript
// src/features/messaging/components/MessageInput.tsx
// Input field for composing messages
// Follow existing form patterns
```

### 3. Conversation List Component
```typescript
// src/features/messaging/components/ConversationList.tsx
// List of user conversations
// Follow existing component structure
```

### 4. Message Bubble Component
```typescript
// src/features/messaging/components/MessageBubble.tsx
// Individual message display
// Follow existing component patterns
```

## Navigation Integration

### 1. Extend Existing Sidebar
Update `src/containers/Sidebar.tsx` to include messaging routes:
```typescript
// Add to existing navigation items
{
  label: 'Messages',
  icon: MessageCircle,
  submenu: [
    { label: 'All Messages', path: '/app/messages' },
    { label: 'Conversations', path: '/app/messages/conversations' },
    { label: 'Groups', path: '/app/messages/groups' },
    { label: 'Contacts', path: '/app/messages/contacts' },
    { label: 'Archive', path: '/app/messages/archive' }
  ]
}
```

### 2. Extend Existing Routes
Update `src/app/AppRoutes.tsx` to include new routes:
```typescript
// Add new routes following existing pattern
<Route path="/messages" element={<MessagingPage />} />
<Route path="/messages/conversations/:id" element={<ConversationPage />} />
<Route path="/messages/groups" element={<GroupMessagingPage />} />
<Route path="/messages/groups/:id" element={<GroupConversationPage />} />
<Route path="/messages/contacts" element={<ContactsPage />} />
<Route path="/messages/archive" element={<MessageArchivePage />} />
```

## Data Flow Patterns

### 1. Follow Existing Redux Patterns
```typescript
// Follow existing async thunk patterns
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await messageApi.getConversationsForUser(userId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData: SendMessageData, { rejectWithValue }) => {
    try {
      const response = await messageApi.send(messageData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (readData: MarkAsReadData, { rejectWithValue }) => {
    try {
      const response = await messageApi.markAsRead(readData.messageId, readData.userId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);
```

### 2. Follow Existing Component State Patterns
```typescript
// Follow existing useState patterns from existing pages
const [activeConversation, setActiveConversation] = useState<number | null>(null);
const [messageText, setMessageText] = useState('');
const [searchTerm, setSearchTerm] = useState('');
const [showArchived, setShowArchived] = useState(false);
const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
```

## Real-time Features

### 1. Live Messaging
- Real-time message delivery
- Typing indicators
- Online status tracking
- Message status updates

### 2. WebSocket Integration
- Real-time message streaming
- Live conversation updates
- Instant notifications
- Connection status management

## Security Implementation

### 1. Use Existing Authentication
- Leverage existing JWT token management
- Use existing API interceptors for authentication
- Follow existing role-based access patterns

### 2. Messaging Security Features
```typescript
// Implement messaging access control
const canMessageUser = (targetUser: User, currentUser: User) => {
  // Students can message teachers and admins
  if (currentUser.role === 'STUDENT') {
    const allowedRoles = ['TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN'];
    return allowedRoles.includes(targetUser.role) && targetUser.schoolId === currentUser.schoolId;
  }
  
  // Parents can message teachers and admins of their children's school
  if (currentUser.role === 'PARENT') {
    const allowedRoles = ['TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN'];
    return allowedRoles.includes(targetUser.role);
  }
  
  // Teachers can message within their school
  if (['TEACHER', 'SENIOR_TEACHER'].includes(currentUser.role)) {
    return targetUser.schoolId === currentUser.schoolId;
  }
  
  // Admins have broader messaging permissions
  const adminRoles = ['SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'];
  return adminRoles.includes(currentUser.role);
};

// Implement group messaging permissions
const canCreateGroup = (user: User) => {
  const creatorRoles = ['TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD', 'SCHOOL_HEAD', 'SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'];
  return creatorRoles.includes(user.role);
};
```

## Performance Considerations

### 1. Follow Existing Optimization Patterns
- Use existing lazy loading patterns
- Follow existing component memoization patterns
- Use existing data fetching patterns

### 2. Messaging-Specific Optimizations
- Efficient message loading and pagination
- Smart conversation caching
- Optimized real-time updates
- Message search optimization

## Testing Strategy

### 1. Follow Existing Testing Patterns
- Create tests following existing test structure
- Test Redux slices following existing patterns
- Test components following existing patterns

### 2. Messaging-Specific Testing
- Test message sending workflow
- Test real-time updates
- Test group messaging
- Test access control mechanisms

## Deliverables

1. **New Redux Slices**: `messagesSlice.ts`, `messageGroupsSlice.ts`, `conversationsSlice.ts`
2. **New API Services**: `messageApi.ts`, `messageGroupApi.ts`, `conversationApi.ts`
3. **New Pages**: Messaging interface, conversations, and group messaging pages
4. **New Components**: Messaging-specific reusable components
5. **Enhanced Existing Pages**: Integration with notification systems
6. **Updated Navigation**: Extended sidebar and routes
7. **New Modal Types**: Messaging-specific modals

## Success Criteria

- All new features integrate seamlessly with existing codebase
- No breaking changes to existing functionality
- Consistent styling and UX with existing application
- Proper error handling following existing patterns
- Role-based access control working with existing authentication
- Real-time messaging functioning properly
- Group messaging working correctly
- Message delivery and read receipts functioning
- Responsive design consistent with existing pages
- Messaging security measures properly implemented

## Implementation Notes

1. **DO NOT** create new authentication systems - use existing `AuthContext`
2. **DO NOT** create new HTTP clients - use existing `api` from `src/api/index.ts`
3. **DO NOT** create new styling systems - use existing DaisyUI + Tailwind
4. **DO NOT** create new modal systems - extend existing `modalSlice`
5. **DO NOT** create new routing systems - extend existing React Router setup
6. **DO** follow existing file naming conventions
7. **DO** follow existing component structure patterns
8. **DO** follow existing Redux patterns and naming
9. **DO** use existing utility functions and helpers
10. **DO** maintain consistency with existing error handling patterns
11. **DO** implement proper message validation
12. **DO** ensure real-time updates work reliably
13. **DO** implement comprehensive access control
14. **DO** optimize for high-volume messaging scenarios

This implementation should seamlessly integrate with the existing codebase while providing comprehensive messaging capabilities for all user roles in the educational system. 