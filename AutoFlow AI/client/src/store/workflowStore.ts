import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkflowDefinition, WorkflowNode, WorkflowConnection } from "@shared/schema";

interface WorkflowState {
  currentWorkflow: WorkflowDefinition | null;
  selectedNodeId: string | null;
  isEditing: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  error: string | null;
}

const initialState: WorkflowState = {
  currentWorkflow: null,
  selectedNodeId: null,
  isEditing: false,
  isSaving: false,
  hasChanges: false,
  error: null
};

export const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    setWorkflow: (state, action: PayloadAction<WorkflowDefinition>) => {
      state.currentWorkflow = action.payload;
      state.selectedNodeId = null;
      state.isEditing = false;
      state.hasChanges = false;
      state.error = null;
    },
    
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    
    startEditing: (state) => {
      state.isEditing = true;
    },
    
    stopEditing: (state) => {
      state.isEditing = false;
    },
    
    updateNode: (state, action: PayloadAction<WorkflowNode>) => {
      if (!state.currentWorkflow) return;
      
      const index = state.currentWorkflow.nodes.findIndex(
        node => node.id === action.payload.id
      );
      
      if (index !== -1) {
        state.currentWorkflow.nodes[index] = action.payload;
        state.hasChanges = true;
      }
    },
    
    addNode: (state, action: PayloadAction<WorkflowNode>) => {
      if (!state.currentWorkflow) return;
      
      state.currentWorkflow.nodes.push(action.payload);
      state.hasChanges = true;
    },
    
    removeNode: (state, action: PayloadAction<string>) => {
      if (!state.currentWorkflow) return;
      
      state.currentWorkflow.nodes = state.currentWorkflow.nodes.filter(
        node => node.id !== action.payload
      );
      
      // Also remove any connections to/from this node
      state.currentWorkflow.connections = state.currentWorkflow.connections.filter(
        conn => conn.sourceId !== action.payload && conn.targetId !== action.payload
      );
      
      state.hasChanges = true;
      
      if (state.selectedNodeId === action.payload) {
        state.selectedNodeId = null;
      }
    },
    
    addConnection: (state, action: PayloadAction<WorkflowConnection>) => {
      if (!state.currentWorkflow) return;
      
      state.currentWorkflow.connections.push(action.payload);
      state.hasChanges = true;
    },
    
    removeConnection: (state, action: PayloadAction<string>) => {
      if (!state.currentWorkflow) return;
      
      state.currentWorkflow.connections = state.currentWorkflow.connections.filter(
        conn => conn.id !== action.payload
      );
      
      state.hasChanges = true;
    },
    
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    resetWorkflow: (state) => {
      state.currentWorkflow = null;
      state.selectedNodeId = null;
      state.isEditing = false;
      state.isSaving = false;
      state.hasChanges = false;
      state.error = null;
    }
  }
});

export const {
  setWorkflow,
  selectNode,
  startEditing,
  stopEditing,
  updateNode,
  addNode,
  removeNode,
  addConnection,
  removeConnection,
  setSaving,
  setError,
  resetWorkflow
} = workflowSlice.actions;

export default workflowSlice.reducer;
