import { WorkflowDefinition } from "@shared/schema";

// Interfaces for automation engine adapters
export interface AutomationEngine {
  name: string;
  displayName: string;
  deployWorkflow: (workflow: WorkflowDefinition) => Promise<any>;
  testWorkflow: (workflow: WorkflowDefinition, testData?: any) => Promise<any>;
  getWorkflow: (workflowId: string) => Promise<any>;
  listWorkflows: () => Promise<any[]>;
}

// n8n adapter implementation
export const n8nEngine: AutomationEngine = {
  name: "n8n",
  displayName: "n8n",
  
  async deployWorkflow(workflow) {
    try {
      const response = await fetch("/api/n8n/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflow }),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to deploy to n8n: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Error deploying to n8n:", error);
      throw error;
    }
  },
  
  async testWorkflow(workflow, testData) {
    try {
      const response = await fetch("/api/n8n/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflow, testData }),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to test n8n workflow: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Error testing n8n workflow:", error);
      throw error;
    }
  },
  
  async getWorkflow(workflowId) {
    try {
      const response = await fetch(`/api/n8n/workflows/${workflowId}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get n8n workflow: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Error getting n8n workflow:", error);
      throw error;
    }
  },
  
  async listWorkflows() {
    try {
      const response = await fetch("/api/n8n/workflows", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to list n8n workflows: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Error listing n8n workflows:", error);
      throw error;
    }
  }
};

// Make.com adapter implementation
export const makeEngine: AutomationEngine = {
  name: "make",
  displayName: "Make.com",
  
  async deployWorkflow(workflow) {
    try {
      const response = await fetch("/api/make/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflow }),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to deploy to Make.com: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Error deploying to Make.com:", error);
      throw error;
    }
  },
  
  async testWorkflow(workflow, testData) {
    try {
      const response = await fetch("/api/make/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workflow, testData }),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to test Make.com workflow: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Error testing Make.com workflow:", error);
      throw error;
    }
  },
  
  async getWorkflow(workflowId) {
    try {
      const response = await fetch(`/api/make/workflows/${workflowId}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get Make.com workflow: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Error getting Make.com workflow:", error);
      throw error;
    }
  },
  
  async listWorkflows() {
    try {
      const response = await fetch("/api/make/workflows", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to list Make.com workflows: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("Error listing Make.com workflows:", error);
      throw error;
    }
  }
};

// Factory to get the appropriate engine
export function getAutomationEngine(engineType: string): AutomationEngine {
  switch (engineType.toLowerCase()) {
    case "n8n":
      return n8nEngine;
    case "make":
      return makeEngine;
    default:
      return n8nEngine; // Default to n8n
  }
}
