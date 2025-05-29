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

export const fetchSubmissionsByCourse = createAsyncThunk(
  'submissions/fetchSubmissionsByCourse',
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getByCourse(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions by course');
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

export const fetchSubmissionsByInstructor = createAsyncThunk(
  'submissions/fetchSubmissionsByInstructor',
  async (instructorId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getByInstructor(instructorId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions by instructor');
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

export const fetchPendingSubmissionsByInstructor = createAsyncThunk(
  'submissions/fetchPendingSubmissionsByInstructor',
  async (instructorId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getPendingByInstructor(instructorId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending submissions by instructor');
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

export const fetchLateSubmissionsByInstructor = createAsyncThunk(
  'submissions/fetchLateSubmissionsByInstructor',
  async (instructorId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getLateByInstructor(instructorId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch late submissions by instructor');
    }
  }
);

export const fetchSubmissionsNeedingReview = createAsyncThunk(
  'submissions/fetchSubmissionsNeedingReview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getNeedingReview();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions needing review');
    }
  }
);

export const fetchSubmissionsNeedingReviewByTeacher = createAsyncThunk(
  'submissions/fetchSubmissionsNeedingReviewByTeacher',
  async (teacherId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getNeedingReviewByTeacher(teacherId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions needing review by teacher');
    }
  }
);

export const fetchSubmissionsNeedingReviewByInstructor = createAsyncThunk(
  'submissions/fetchSubmissionsNeedingReviewByInstructor',
  async (instructorId: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.getNeedingReviewByInstructor(instructorId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch submissions needing review by instructor');
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
  async ({ id, gradeData }: { 
    id: number; 
    gradeData: {
      score?: number;
      percentage?: number;
      letterGrade?: string;
      feedback?: string;
      rubricScores?: string;
    }
  }, { rejectWithValue }) => {
    try {
      const response = await submissionApi.grade(id, gradeData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to grade submission');
    }
  }
);

export const returnSubmissionToStudent = createAsyncThunk(
  'submissions/returnSubmissionToStudent',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await submissionApi.returnToStudent(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to return submission to student');
    }
  }
);

export const markSubmissionReviewed = createAsyncThunk(
  'submissions/markSubmissionReviewed',
  async ({ id, comments }: { id: number; comments?: string }, { rejectWithValue }) => {
    try {
      const response = await submissionApi.markReviewed(id, comments);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark submission as reviewed');
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

export const uploadSubmissionFile = createAsyncThunk(
  'submissions/uploadSubmissionFile',
  async ({ assignmentId, studentId, file }: { assignmentId: number; studentId: number; file: File }, { rejectWithValue }) => {
    try {
      const response = await submissionApi.uploadFile(assignmentId, studentId, file);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload submission file');
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

      // Fetch submissions by course
      .addCase(fetchSubmissionsByCourse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionsByCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubmissionsByCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submissions by course';
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

      // Fetch submissions by instructor
      .addCase(fetchSubmissionsByInstructor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionsByInstructor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubmissionsByInstructor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submissions by instructor';
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

      // Fetch pending submissions by instructor
      .addCase(fetchPendingSubmissionsByInstructor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPendingSubmissionsByInstructor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPendingSubmissionsByInstructor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch pending submissions by instructor';
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

      // Fetch late submissions by instructor
      .addCase(fetchLateSubmissionsByInstructor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLateSubmissionsByInstructor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLateSubmissionsByInstructor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch late submissions by instructor';
      })

      // Fetch submissions needing review
      .addCase(fetchSubmissionsNeedingReview.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionsNeedingReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubmissionsNeedingReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submissions needing review';
      })

      // Fetch submissions needing review by teacher
      .addCase(fetchSubmissionsNeedingReviewByTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionsNeedingReviewByTeacher.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubmissionsNeedingReviewByTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submissions needing review by teacher';
      })

      // Fetch submissions needing review by instructor
      .addCase(fetchSubmissionsNeedingReviewByInstructor.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionsNeedingReviewByInstructor.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubmissionsNeedingReviewByInstructor.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch submissions needing review by instructor';
      })

      // Create submission
      .addCase(createSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions.push(action.payload as Submission);
        state.currentSubmission = action.payload as Submission;
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
        const index = state.submissions.findIndex(submission => submission.id === updatedSubmission.id);
        if (index !== -1) {
          state.submissions[index] = updatedSubmission;
        }
        state.currentSubmission = updatedSubmission;
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
        const index = state.submissions.findIndex(submission => submission.id === submittedSubmission.id);
        if (index !== -1) {
          state.submissions[index] = submittedSubmission;
        }
        state.currentSubmission = submittedSubmission;
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
        const index = state.submissions.findIndex(submission => submission.id === gradedSubmission.id);
        if (index !== -1) {
          state.submissions[index] = gradedSubmission;
        }
        state.currentSubmission = gradedSubmission;
      })
      .addCase(gradeSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to grade submission';
      })

      // Return submission to student
      .addCase(returnSubmissionToStudent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(returnSubmissionToStudent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const returnedSubmission = action.payload as Submission;
        const index = state.submissions.findIndex(submission => submission.id === returnedSubmission.id);
        if (index !== -1) {
          state.submissions[index] = returnedSubmission;
        }
        state.currentSubmission = returnedSubmission;
      })
      .addCase(returnSubmissionToStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to return submission to student';
      })

      // Mark submission reviewed
      .addCase(markSubmissionReviewed.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(markSubmissionReviewed.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const reviewedSubmission = action.payload as Submission;
        const index = state.submissions.findIndex(submission => submission.id === reviewedSubmission.id);
        if (index !== -1) {
          state.submissions[index] = reviewedSubmission;
        }
        state.currentSubmission = reviewedSubmission;
      })
      .addCase(markSubmissionReviewed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to mark submission as reviewed';
      })

      // Delete submission
      .addCase(deleteSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.submissions = state.submissions.filter(submission => submission.id !== id);
        if (state.currentSubmission?.id === id) {
          state.currentSubmission = null;
        }
      })
      .addCase(deleteSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete submission';
      })

      // Upload submission file
      .addCase(uploadSubmissionFile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadSubmissionFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const uploadedSubmission = action.payload as Submission;
        const index = state.submissions.findIndex(submission => submission.id === uploadedSubmission.id);
        if (index !== -1) {
          state.submissions[index] = uploadedSubmission;
        } else {
          state.submissions.push(uploadedSubmission);
        }
        state.currentSubmission = uploadedSubmission;
      })
      .addCase(uploadSubmissionFile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to upload submission file';
      });
  }
});

export const { clearCurrentSubmission, clearSubmissionsError } = submissionsSlice.actions;
export default submissionsSlice.reducer; 