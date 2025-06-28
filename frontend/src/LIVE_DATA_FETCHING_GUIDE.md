# Live Data Fetching Guide

This guide explains how to fetch live data from the backend API in the Thutothebe LMS frontend application.

## Overview

The application uses a combination of:
- **Redux Toolkit** for state management
- **RTK Query** for API calls
- **WebSocket** for real-time updates
- **Custom hooks** for data fetching logic

## Architecture

### Backend API Endpoints

The backend provides RESTful APIs for the following entities:

#### Lessons API
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/{id}` - Get lesson by ID
- `GET /api/lessons/course/{courseId}` - Get lessons by course
- `GET /api/lessons/status/{status}` - Get lessons by status
- `POST /api/lessons` - Create new lesson
- `PUT /api/lessons/{id}` - Update lesson
- `DELETE /api/lessons/{id}` - Delete lesson

#### Lesson Completions API
- `GET /api/lesson-completions` - Get all completions
- `GET /api/lesson-completions/{id}` - Get completion by ID
- `GET /api/lesson-completions/lesson/{lessonId}` - Get completions by lesson
- `GET /api/lesson-completions/student/{studentId}` - Get completions by student
- `POST /api/lesson-completions` - Create new completion
- `PUT /api/lesson-completions/{id}` - Update completion
- `DELETE /api/lesson-completions/{id}` - Delete completion

#### Curriculum Progress API
- `GET /api/curriculum-progress` - Get all progress records
- `GET /api/curriculum-progress/{id}` - Get progress by ID
- `GET /api/curriculum-progress/student/{studentId}` - Get progress by student
- `GET /api/curriculum-progress/curriculum/{curriculumId}` - Get progress by curriculum
- `POST /api/curriculum-progress` - Create new progress record
- `PUT /api/curriculum-progress/{id}` - Update progress
- `DELETE /api/curriculum-progress/{id}` - Delete progress

### Frontend Structure

```
src/
├── api/
│   └── services/
│       ├── lessonApi.ts
│       ├── lessonCompletionApi.ts
│       └── curriculumProgressApi.ts
├── features/
│   ├── lessons/
│   │   ├── lessonsSlice.ts
│   │   └── components/
│   │       └── LessonList.tsx
│   ├── lessonCompletions/
│   │   ├── lessonCompletionsSlice.ts
│   │   └── components/
│   │       └── LessonCompletionList.tsx
│   └── curriculumProgress/
│       ├── curriculumProgressSlice.ts
│       └── components/
│           └── CurriculumProgressDashboard.tsx
├── hooks/
│   └── useRealTimeData.ts
├── components/
│   └── RealTimeDataStatus.tsx
└── pages/
    └── protected/
        └── LiveDataDemo.tsx
```

## Usage Examples

### 1. Basic Data Fetching

```tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchLessons } from '../features/lessons/lessonsSlice';

const MyComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lessons, loading, error } = useSelector((state: RootState) => state.lessons);

  useEffect(() => {
    dispatch(fetchLessons());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {lessons.map(lesson => (
        <div key={lesson.id}>{lesson.title}</div>
      ))}
    </div>
  );
};
```

### 2. Using Pre-built Components

```tsx
import React from 'react';
import LessonList from '../features/lessons/components/LessonList';
import LessonCompletionList from '../features/lessonCompletions/components/LessonCompletionList';
import CurriculumProgressDashboard from '../features/curriculumProgress/components/CurriculumProgressDashboard';

const MyPage: React.FC = () => {
  return (
    <div>
      <h1>My Dashboard</h1>
      
      {/* Show all lessons */}
      <LessonList showAll={true} />
      
      {/* Show completions for a specific lesson */}
      <LessonCompletionList lessonId={123} />
      
      {/* Show progress for a specific student */}
      <CurriculumProgressDashboard studentId={456} />
    </div>
  );
};
```

### 3. Real-Time Data with Custom Hook

```tsx
import React from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';

const RealTimeComponent: React.FC = () => {
  const {
    isConnected,
    lastUpdate,
    error,
    refreshCount,
    refreshData
  } = useRealTimeData({
    enableWebSocket: true,
    refreshInterval: 30000, // 30 seconds
    autoRefresh: true
  });

  return (
    <div>
      <div>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <div>Last Update: {lastUpdate?.toLocaleTimeString()}</div>
      <div>Refresh Count: {refreshCount}</div>
      {error && <div>Error: {error}</div>}
      <button onClick={refreshData}>Manual Refresh</button>
    </div>
  );
};
```

### 4. Specific Data Type Hooks

```tsx
import React from 'react';
import { useRealTimeLessons } from '../hooks/useRealTimeData';

const LessonsComponent: React.FC = () => {
  const { isConnected, lastUpdate, refreshLessons } = useRealTimeLessons();

  return (
    <div>
      <h2>Real-Time Lessons</h2>
      <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
      <div>Last Update: {lastUpdate?.toLocaleTimeString()}</div>
      <button onClick={refreshLessons}>Refresh Lessons</button>
    </div>
  );
};
```

## API Service Usage

### Direct API Calls

```tsx
import { lessonApi } from '../api/services/lessonApi';

// Get all lessons
const response = await lessonApi.getAll();
const lessons = response.data.data;

// Get lesson by ID
const lesson = await lessonApi.getById(123);

// Create new lesson
const newLesson = await lessonApi.create({
  title: 'New Lesson',
  description: 'Lesson description',
  courseId: 1,
  lessonOrder: 1,
  durationMinutes: 60
});

// Update lesson
const updatedLesson = await lessonApi.update(123, {
  title: 'Updated Lesson Title'
});
```

## Redux Slice Actions

### Available Actions

Each slice provides the following actions:

#### Lessons
- `fetchLessons()` - Get all lessons
- `fetchLessonsByCourseId(courseId)` - Get lessons by course
- `fetchLessonsByStatus(status)` - Get lessons by status
- `createLesson(lessonData)` - Create new lesson
- `updateLesson({ id, lessonData })` - Update lesson
- `deleteLesson(id)` - Delete lesson

#### Lesson Completions
- `fetchLessonCompletions()` - Get all completions
- `fetchLessonCompletionsByLessonId(lessonId)` - Get by lesson
- `fetchLessonCompletionsByStudentId(studentId)` - Get by student
- `createLessonCompletion(completionData)` - Create completion
- `updateLessonCompletion({ id, completionData })` - Update completion
- `deleteLessonCompletion(id)` - Delete completion

#### Curriculum Progress
- `fetchCurriculumProgress()` - Get all progress
- `fetchCurriculumProgressByStudentId(studentId)` - Get by student
- `fetchCurriculumProgressByCurriculumId(curriculumId)` - Get by curriculum
- `createCurriculumProgress(progressData)` - Create progress
- `updateCurriculumProgress({ id, progressData })` - Update progress
- `deleteCurriculumProgress(id)` - Delete progress

## Error Handling

All API calls include proper error handling:

```tsx
const { lessons, loading, error } = useSelector((state: RootState) => state.lessons);

if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <h3 className="text-sm font-medium text-red-800">Error</h3>
      <div className="mt-2 text-sm text-red-700">{error}</div>
    </div>
  );
}
```

## WebSocket Integration

The application supports real-time updates via WebSocket:

### WebSocket Message Types

- `LESSON_UPDATED` - Lesson was updated
- `LESSON_CREATED` - New lesson created
- `LESSON_DELETED` - Lesson was deleted
- `LESSON_COMPLETION_UPDATED` - Completion was updated
- `LESSON_COMPLETION_CREATED` - New completion created
- `CURRICULUM_PROGRESS_UPDATED` - Progress was updated
- `GENERAL_UPDATE` - General update (refreshes all data)

### WebSocket Configuration

```tsx
const { isConnected, error } = useRealTimeData({
  enableWebSocket: true,
  refreshInterval: 30000,
  autoRefresh: true
});
```

## Best Practices

1. **Use Pre-built Components**: Leverage the existing components for common use cases
2. **Handle Loading States**: Always show loading indicators during API calls
3. **Error Handling**: Implement proper error handling and user feedback
4. **Real-Time Updates**: Use the real-time hooks for data that needs live updates
5. **Optimistic Updates**: Consider optimistic updates for better UX
6. **Caching**: The Redux store provides automatic caching of fetched data

## Demo Page

Visit `/live-data-demo` to see a complete example of live data fetching in action. The demo page includes:

- Real-time status indicator
- Tabbed interface for different data types
- Filtering options
- API endpoint documentation
- Technical implementation details

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Check if the backend is running and accessible
2. **WebSocket Connection**: Verify WebSocket endpoint configuration
3. **CORS Issues**: Ensure backend CORS configuration allows frontend requests
4. **Authentication**: Make sure user is authenticated for protected endpoints

### Debug Tools

- Use browser DevTools to inspect network requests
- Check Redux DevTools for state changes
- Monitor WebSocket connection in Network tab
- Review console logs for error messages 