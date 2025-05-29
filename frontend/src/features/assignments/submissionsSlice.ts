import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import submissionApi, { Submission, CreateSubmissionRequest, UpdateSubmissionRequest } from '../../api/services/submissionApi';

export interface SubmissionsState {
  submissions: Submission[];
  currentSubmission: Submission | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SubmissionsState = {
  submissions: [],
  currentSubmission: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchSubmissions = createAsyncThunk(
  'submissions/fetchSubmissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions');
    }
  }
);

export const fetchSubmissionById = createAsyncThunk(
  'submissions/fetchSubmissionById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submission');
    }
  }
);

export const fetchSubmissionByAssignmentAndStudent = createAsyncThunk(
  'submissions/fetchSubmissionByAssignmentAndStudent',
  async ({ assignmentId, studentId }: { assignmentId: number; studentId: number }, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getByAssignmentAndStudent(assignmentId, studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submission');
    }
  }
);

export const fetchSubmissionsByAssignment = createAsyncThunk(
  'submissions/fetchSubmissionsByAssignment',
  async (assignmentId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getByAssignment(assignmentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions by assignment');
    }
  }
);

export const fetchSubmissionsByStudent = createAsyncThunk(
  'submissions/fetchSubmissionsByStudent',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getByStudent(studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions by student');
    }
  }
);

export const fetchGradedSubmissionsByAssignment = createAsyncThunk(
  'submissions/fetchGradedSubmissionsByAssignment',
  async (assignmentId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getGradedByAssignment(assignmentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch graded submissions by assignment');
    }
  }
);

export const fetchGradedSubmissionsByStudent = createAsyncThunk(
  'submissions/fetchGradedSubmissionsByStudent',
  async (studentId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getGradedByStudent(studentId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch graded submissions by student');
    }
  }
);

export const fetchSubmissionsByTeacher = createAsyncThunk(
  'submissions/fetchSubmissionsByTeacher',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions by teacher');
    }
  }
);

export const fetchPendingSubmissionsByTeacher = createAsyncThunk(
  'submissions/fetchPendingSubmissionsByTeacher',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getPendingByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending submissions by teacher');
    }
  }
);

export const fetchLateSubmissionsByTeacher = createAsyncThunk(
  'submissions/fetchLateSubmissionsByTeacher',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getLateByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch late submissions by teacher');
    }
  }
);

export const fetchPendingSubmissionsByCourse = createAsyncThunk(
  'submissions/fetchPendingSubmissionsByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getPendingByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending submissions by course');
    }
  }
);

export const fetchLateSubmissionsByCourse = createAsyncThunk(
  'submissions/fetchLateSubmissionsByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getLateByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch late submissions by course');
    }
  }
);

export const createSubmission = createAsyncThunk(
  'submissions/createSubmission',
  async (submissionData: CreateSubmissionRequest, { rejectWithValue }) => {
    try {
      const response = await submissionApi.create(submissionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create submission');
    }
  }
);

export const updateSubmission = createAsyncThunk(
  'submissions/updateSubmission',
  async ({ id, submissionData }: { id: number; submissionData: UpdateSubmissionRequest }, { rejectWithValue }) => {
    try {
      const response = await submissionApi.update(id, submissionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update submission');
    }
  }
);

export const submitSubmission = createAsyncThunk(
  'submissions/submitSubmission',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.submit(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit submission');
    }
  }
);

export const gradeSubmission = createAsyncThunk(
  'submissions/gradeSubmission',
  async ({ id, score, feedback }: { id: number; score: number; feedback?: string }, { rejectWithValue }) => {
    try {
      const response = await submissionApi.grade(id, score, feedback);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to grade submission');
    }
  }
);

export const deleteSubmission = createAsyncThunk(
  'submissions/deleteSubmission',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete submission');
    }
  }
);

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    clearCurrentSubmission: (state) => {
      state.currentSubmission = null;
    },
    clearSubmissionsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all submissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submissions';
      })

      // Fetch submission by ID
      .addCase(fetchSubmissionById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSubmission = action.payload as Submission;
      })
      .addCase(fetchSubmissionById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submission';
      })

      // Fetch submission by assignment and student
      .addCase(fetchSubmissionByAssignmentAndStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionByAssignmentAndStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentSubmission = action.payload as Submission;
      })
      .addCase(fetchSubmissionByAssignmentAndStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submission';
      })

      // Fetch submissions by assignment
      .addCase(fetchSubmissionsByAssignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionsByAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubmissionsByAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submissions by assignment';
      })

      // Fetch submissions by student
      .addCase(fetchSubmissionsByStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionsByStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubmissionsByStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submissions by student';
      })

      // Fetch graded submissions by assignment
      .addCase(fetchGradedSubmissionsByAssignment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGradedSubmissionsByAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGradedSubmissionsByAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch graded submissions by assignment';
      })

      // Fetch graded submissions by student
      .addCase(fetchGradedSubmissionsByStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGradedSubmissionsByStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGradedSubmissionsByStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch graded submissions by student';
      })

      // Fetch submissions by teacher
      .addCase(fetchSubmissionsByTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionsByTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubmissionsByTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submissions by teacher';
      })

      // Fetch pending submissions by teacher
      .addCase(fetchPendingSubmissionsByTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPendingSubmissionsByTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPendingSubmissionsByTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch pending submissions by teacher';
      })

      // Fetch late submissions by teacher
      .addCase(fetchLateSubmissionsByTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLateSubmissionsByTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLateSubmissionsByTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch late submissions by teacher';
      })

      // Fetch pending submissions by course
      .addCase(fetchPendingSubmissionsByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPendingSubmissionsByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPendingSubmissionsByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch pending submissions by course';
      })

      // Fetch late submissions by course
      .addCase(fetchLateSubmissionsByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLateSubmissionsByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLateSubmissionsByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch late submissions by course';
      })

      // Create submission
      .addCase(createSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.submissions.push(action.payload as Submission);
        }
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create submission';
      })

      // Update submission
      .addCase(updateSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedSubmission = action.payload as Submission;
        if (updatedSubmission?.id) {
          const index = state.submissions.findIndex(s => s.id === updatedSubmission.id);
          if (index !== -1) {
            state.submissions[index] = updatedSubmission;
          }
          if (state.currentSubmission?.id === updatedSubmission.id) {
            state.currentSubmission = updatedSubmission;
          }
        }
      })
      .addCase(updateSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update submission';
      })

      // Submit submission
      .addCase(submitSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const submittedSubmission = action.payload as Submission;
        if (submittedSubmission?.id) {
          const index = state.submissions.findIndex(s => s.id === submittedSubmission.id);
          if (index !== -1) {
            state.submissions[index] = submittedSubmission;
          }
          if (state.currentSubmission?.id === submittedSubmission.id) {
            state.currentSubmission = submittedSubmission;
          }
        }
      })
      .addCase(submitSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to submit submission';
      })

      // Grade submission
      .addCase(gradeSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const gradedSubmission = action.payload as Submission;
        if (gradedSubmission?.id) {
          const index = state.submissions.findIndex(s => s.id === gradedSubmission.id);
          if (index !== -1) {
            state.submissions[index] = gradedSubmission;
          }
          if (state.currentSubmission?.id === gradedSubmission.id) {
            state.currentSubmission = gradedSubmission;
          }
        }
      })
      .addCase(gradeSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to grade submission';
      })

      // Delete submission
      .addCase(deleteSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const deletedId = action.payload?.id;
        if (deletedId) {
          state.submissions = state.submissions.filter(s => s.id !== deletedId);
          if (state.currentSubmission?.id === deletedId) {
            state.currentSubmission = null;
          }
        }
      })
      .addCase(deleteSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete submission';
      });
  }
});

export const { clearCurrentSubmission, clearSubmissionsError } = submissionsSlice.actions;

export default submissionsSlice.reducer; 