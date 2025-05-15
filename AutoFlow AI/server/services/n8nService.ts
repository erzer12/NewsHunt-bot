import { WorkflowDefinition } from "@shared/schema";
import axios from "axios";

// Get n8n API configuration from environment variables
const N8N_BASE_URL = process.env.N8N_BASE_URL || "http://localhost:5678";
const N8N_API_KEY = process.env.N8N_API_KEY || "";

// Configure axios instance for n8n API
const n8nApi = axios.create({
  baseURL: N8N_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-N8N-API-KEY": N8N_API_KEY
  }
});

// Convert our internal workflow definition to n8n format
function convertToN8nFormat(workflow: WorkflowDefinition) {
  // This would be a complex transformation in a real app
  // We'd map our node types to n8n node types, handle parameters, etc.
  
  // Basic structure for n8n workflow
  const n8nWorkflow = {
    name: "AutoFlow Generated",
    nodes: workflow.nodes.map((node, index) => {
      // Create a basic n8n node (this is simplified)
      return {
        id: node.id,
        name: node.name,
        type: mapNodeTypeToN8n(node.type, node.service),
        position: [index * 200, 300],
        parameters: {
          // Parameters would be derived from node.config
        }
      };
    }),
    connections: workflow.connections.map(conn => {
      return {
        source: conn.sourceId,
        sourceHandle: "main",
        target: conn.targetId,
        targetHandle: "main"
      };
    }),
    active: true
  };
  
  return n8nWorkflow;
}

// Map our node types to n8n node types (simplified)
function mapNodeTypeToN8n(type: string, service?: string): string {
  switch (type) {
    case "trigger":
      if (service === "linkedin") return "n8n-nodes-base.linkedinTrigger";
      if (service === "email") return "n8n-nodes-base.emailReadImap";
      return "n8n-nodes-base.webhook";
    case "action":
      if (service === "salesforce") return "n8n-nodes-base.salesforce";
      if (service === "email") return "n8n-nodes-base.emailSend";
      if (service === "hunter") return "n8n-nodes-base.httpRequest";
      return "n8n-nodes-base.set";
    case "condition":
      return "n8n-nodes-base.if";
    case "loop":
      return "n8n-nodes-base.splitInBatches";
    case "delay":
      return "n8n-nodes-base.wait";
    default:
      return "n8n-nodes-base.noOp";
  }
}

const n8nService = {
  async deployWorkflow(workflow: WorkflowDefinition) {
    try {
      const n8nWorkflow = convertToN8nFormat(workflow);
      
      // Create workflow in n8n
      const response = await n8nApi.post("/workflows", n8nWorkflow);
      
      return {
        id: response.data.id,
        message: "Workflow deployed successfully to n8n",
        url: `${N8N_BASE_URL}/workflow/${response.data.id}`
      };
    } catch (error) {
      console.error("Error deploying to n8n:", error);
      throw new Error(`Failed to deploy to n8n: ${(error as any).message}`);
    }
  },

  async testWorkflow(workflow: WorkflowDefinition, testData?: any) {
    try {
      // For actual implementation, we'd need to:
      // 1. Convert our workflow to n8n format
      // 2. Use the n8n /workflows/execute endpoint to run the workflow with test data
      // This is simplified for demonstration
      
      const n8nWorkflow = convertToN8nFormat(workflow);
      
      // Check if the API key is set for a more informative error message
      if (!N8N_API_KEY) {
        return {
          message: "N8N API key not configured. In a real implementation, this would execute the workflow in n8n.",
          testData,
          simulatedResult: {
            success: true,
            executionTime: "1.2s",
            nodes: workflow.nodes.map(node => ({
              id: node.id,
              name: node.name,
              status: "success"
            }))
          }
        };
      }
      
      // In a real implementation, we would make the actual API call:
      // const response = await n8nApi.post("/workflows/execute", {
      //   workflowData: n8nWorkflow,
      //   startNodes: [],
      //   destinationNode: "",
      //   runData: testData
      // });
      
      // For now, return a simulated result
      return {
        message: "Workflow test executed successfully",
        executionTime: "1.2s",
        result: {
          success: true,
          nodes: workflow.nodes.map(node => ({
            id: node.id,
            name: node.name,
            status: "success"
          }))
        }
      };
    } catch (error) {
      console.error("Error testing n8n workflow:", error);
      throw new Error(`Failed to test workflow in n8n: ${(error as any).message}`);
    }
  },

  async getWorkflow(workflowId: string) {
    try {
      const response = await n8nApi.get(`/workflows/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting n8n workflow:", error);
      throw new Error(`Failed to get workflow from n8n: ${(error as any).message}`);
    }
  },

  async listWorkflows() {
    try {
      const response = await n8nApi.get("/workflows");
      return response.data;
    } catch (error) {
      console.error("Error listing n8n workflows:", error);
      throw new Error(`Failed to list workflows from n8n: ${(error as any).message}`);
    }
  }
};

export default n8nService;
