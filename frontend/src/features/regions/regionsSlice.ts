import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import regionApi, { Region, CreateRegionRequest, UpdateRegionRequest } from '../../api/services/regionApi';

export interface RegionsState {
  regions: Region[];
  currentRegion: Region | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RegionsState = {
  regions: [],
  currentRegion: null,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchRegions = createAsyncThunk(
  'regions/fetchRegions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await regionApi.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch regions');
    }
  }
);

export const fetchRegionById = createAsyncThunk(
  'regions/fetchRegionById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await regionApi.getById(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch region');
    }
  }
);

export const fetchRegionByCode = createAsyncThunk(
  'regions/fetchRegionByCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await regionApi.getByCode(code);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch region');
    }
  }
);

export const fetchActiveRegions = createAsyncThunk(
  'regions/fetchActiveRegions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await regionApi.getActiveRegions();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch active regions');
    }
  }
);

export const createRegion = createAsyncThunk(
  'regions/createRegion',
  async (regionData: CreateRegionRequest, { rejectWithValue }) => {
    try {
      const response = await regionApi.create(regionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create region');
    }
  }
);

export const updateRegion = createAsyncThunk(
  'regions/updateRegion',
  async ({ id, regionData }: { id: number; regionData: UpdateRegionRequest }, { rejectWithValue }) => {
    try {
      const response = await regionApi.update(id, regionData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update region');
    }
  }
);

export const deleteRegion = createAsyncThunk(
  'regions/deleteRegion',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await regionApi.delete(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete region');
    }
  }
);

export const activateRegion = createAsyncThunk(
  'regions/activateRegion',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await regionApi.activate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate region');
    }
  }
);

export const deactivateRegion = createAsyncThunk(
  'regions/deactivateRegion',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await regionApi.deactivate(id);
      return { id, ...response.data.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate region');
    }
  }
);

const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {
    clearCurrentRegion: (state) => {
      state.currentRegion = null;
    },
    clearRegionsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all regions
      .addCase(fetchRegions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch regions';
      })

      // Fetch region by ID
      .addCase(fetchRegionById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRegionById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentRegion = action.payload as Region;
      })
      .addCase(fetchRegionById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch region';
      })

      // Fetch region by code
      .addCase(fetchRegionByCode.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRegionByCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentRegion = action.payload as Region;
      })
      .addCase(fetchRegionByCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch region';
      })

      // Fetch active regions
      .addCase(fetchActiveRegions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchActiveRegions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchActiveRegions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch active regions';
      })

      // Create region
      .addCase(createRegion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createRegion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.regions.push(action.payload as Region);
        state.currentRegion = action.payload as Region;
      })
      .addCase(createRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create region';
      })

      // Update region
      .addCase(updateRegion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateRegion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedRegion = action.payload as Region;
        const index = state.regions.findIndex(region => region.id === updatedRegion.id);
        if (index !== -1) {
          state.regions[index] = updatedRegion;
        }
        state.currentRegion = updatedRegion;
      })
      .addCase(updateRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to update region';
      })

      // Delete region
      .addCase(deleteRegion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteRegion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        state.regions = state.regions.filter(region => region.id !== id);
        if (state.currentRegion?.id === id) {
          state.currentRegion = null;
        }
      })
      .addCase(deleteRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to delete region';
      })

      // Activate region
      .addCase(activateRegion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(activateRegion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.regions.findIndex(region => region.id === id);
        if (index !== -1) {
          state.regions[index] = { ...state.regions[index], active: true };
        }
        if (state.currentRegion?.id === id) {
          state.currentRegion = { ...state.currentRegion, active: true };
        }
      })
      .addCase(activateRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to activate region';
      })

      // Deactivate region
      .addCase(deactivateRegion.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deactivateRegion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { id } = action.payload as { id: number };
        const index = state.regions.findIndex(region => region.id === id);
        if (index !== -1) {
          state.regions[index] = { ...state.regions[index], active: false };
        }
        if (state.currentRegion?.id === id) {
          state.currentRegion = { ...state.currentRegion, active: false };
        }
      })
      .addCase(deactivateRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to deactivate region';
      });
  }
});

export const { clearCurrentRegion, clearRegionsError } = regionsSlice.actions;
export default regionsSlice.reducer; 