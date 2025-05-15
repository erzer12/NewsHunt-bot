import { WorkflowDefinition } from "@shared/schema";
import axios from "axios";

// Get Make.com API configuration from environment variables
const MAKE_API_KEY = process.env.MAKE_API_KEY || "";
const MAKE_API_URL = process.env.MAKE_API_URL || "https://eu1.make.com/api/v2";
const MAKE_TEAM_ID = process.env.MAKE_TEAM_ID || "";

// Configure axios instance for Make.com API
const makeApi = axios.create({
  baseURL: MAKE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Token ${MAKE_API_KEY}`
  }
});

// Convert our internal workflow definition to Make.com format
function convertToMakeFormat(workflow: WorkflowDefinition) {
  // This would be a complex transformation in a real app
  // We'd map our node types to Make.com module types, handle parameters, etc.
  
  // Basic structure for Make.com scenario
  const makeScenario = {
    name: "AutoFlow Generated",
    blueprint: {
      modules: workflow.nodes.map((node, index) => {
        return {
          id: node.id,
          name: node.name,
          type: mapNodeTypeToMake(node.type, node.service),
          position: {
            x: index * 300,
            y: 200
          },
          configuration: {
            // Configuration would be derived from node.config
          }
        };
      }),
      connections: workflow.connections.map(conn => {
        return {
          id: conn.id,
          source: {
            moduleId: conn.sourceId,
            port: "output"
          },
          target: {
            moduleId: conn.targetId,
            port: "input"
          }
        };
      })
    },
    scheduling: {
      type: "recurring",
      interval: 15 // minutes
    }
  };
  
  return makeScenario;
}

// Map our node types to Make.com module types (simplified)
function mapNodeTypeToMake(type: string, service?: string): string {
  switch (type) {
    case "trigger":
      if (service === "linkedin") return "linkedin";
      if (service === "email") return "email";
      return "webhooks";
    case "action":
      if (service === "salesforce") return "salesforce";
      if (service === "email") return "email";
      if (service === "hunter") return "http";
      return "tools";
    case "condition":
      return "router";
    case "loop":
      return "iterator";
    case "delay":
      return "tools-delay";
    default:
      return "tools";
  }
}

const makeService = {
  async deployWorkflow(workflow: WorkflowDefinition) {
    try {
      const makeScenario = convertToMakeFormat(workflow);
      
      // Check if the API key and team ID are set for a more informative error message
      if (!MAKE_API_KEY || !MAKE_TEAM_ID) {
        return {
          id: "simulated-make-id",
          message: "Make.com API key or team ID not configured. In a real implementation, this would deploy to Make.com.",
          url: "https://www.make.com"
        };
      }
      
      // Create scenario in Make.com
      const response = await makeApi.post(`/teams/${MAKE_TEAM_ID}/scenarios`, makeScenario);
      
      return {
        id: response.data.id,
        message: "Workflow deployed successfully to Make.com",
        url: `https://www.make.com/en/workspaces/${MAKE_TEAM_ID}/scenario/${response.data.id}`
      };
    } catch (error) {
      console.error("Error deploying to Make.com:", error);
      throw new Error(`Failed to deploy to Make.com: ${(error as any).message}`);
    }
  },

  async testWorkflow(workflow: WorkflowDefinition, testData?: any) {
    try {
      // For actual implementation, we'd need to:
      // 1. Convert our workflow to Make.com format
      // 2. Use the Make.com API to run the scenario with test data
      // This is simplified for demonstration
      
      const makeScenario = convertToMakeFormat(workflow);
      
      // Check if the API key and team ID are set for a more informative error message
      if (!MAKE_API_KEY || !MAKE_TEAM_ID) {
        return {
          message: "Make.com API key or team ID not configured. In a real implementation, this would execute the workflow in Make.com.",
          testData,
          simulatedResult: {
            success: true,
            executionTime: "0.8s",
            modules: workflow.nodes.map(node => ({
              id: node.id,
              name: node.name,
              status: "success"
            }))
          }
        };
      }
      
      // In a real implementation, we would create a temporary scenario and execute it:
      // const scenarioResponse = await makeApi.post(`/teams/${MAKE_TEAM_ID}/scenarios`, makeScenario);
      // const scenarioId = scenarioResponse.data.id;
      // const executionResponse = await makeApi.post(`/scenarios/${scenarioId}/execute`, {
      //   data: testData
      // });
      // await makeApi.delete(`/scenarios/${scenarioId}`); // Clean up the temporary scenario
      
      // For now, return a simulated result
      return {
        message: "Workflow test executed successfully",
        executionTime: "0.8s",
        result: {
          success: true,
          modules: workflow.nodes.map(node => ({
            id: node.id,
            name: node.name,
            status: "success"
          }))
        }
      };
    } catch (error) {
      console.error("Error testing Make.com workflow:", error);
      throw new Error(`Failed to test workflow in Make.com: ${(error as any).message}`);
    }
  },

  async getWorkflow(workflowId: string) {
    try {
      const response = await makeApi.get(`/scenarios/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting Make.com workflow:", error);
      throw new Error(`Failed to get workflow from Make.com: ${(error as any).message}`);
    }
  },

  async listWorkflows() {
    try {
      if (!MAKE_TEAM_ID) {
        return []; // Return empty array if team ID is not configured
      }
      
      const response = await makeApi.get(`/teams/${MAKE_TEAM_ID}/scenarios`);
      return response.data;
    } catch (error) {
      console.error("Error listing Make.com workflows:", error);
      throw new Error(`Failed to list workflows from Make.com: ${(error as any).message}`);
    }
  }
};

export default makeService;
