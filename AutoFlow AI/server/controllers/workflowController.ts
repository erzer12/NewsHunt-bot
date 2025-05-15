import { Request, Response } from "express";
import { storage } from "../storage";
import { 
  insertWorkflowSchema, 
  updateWorkflowSchema, 
  workflowTestSchema,
  WorkflowDefinition
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import n8nService from "../services/n8nService";
import makeService from "../services/makeService";

// Helper to handle zod validation errors
const validateRequest = (schema: any, data: any) => {
  try {
    return { data: schema.parse(data), error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return { data: null, error: fromZodError(error).message };
    }
    return { data: null, error: "Invalid request data" };
  }
};

const workflowController = {
  // Workflow CRUD operations
  async listWorkflows(req: Request, res: Response) {
    try {
      // Get the authenticated user's ID
      const userId = req.user!.id;
      const workflows = await storage.getWorkflowsByUserId(userId);
      return res.json(workflows);
    } catch (error) {
      console.error("Error listing workflows:", error);
      return res.status(500).json({ message: "Failed to list workflows" });
    }
  },

  async getWorkflow(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workflow ID" });
      }

      const workflow = await storage.getWorkflow(id);
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      // Check if the workflow belongs to the authenticated user
      if (workflow.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      return res.json(workflow);
    } catch (error) {
      console.error("Error getting workflow:", error);
      return res.status(500).json({ message: "Failed to get workflow" });
    }
  },

  async createWorkflow(req: Request, res: Response) {
    try {
      const { data, error } = validateRequest(insertWorkflowSchema, req.body);
      if (error) {
        return res.status(400).json({ message: error });
      }

      // Get the authenticated user's ID
      const workflow = await storage.createWorkflow({ ...data, userId: req.user!.id });
      return res.status(201).json(workflow);
    } catch (error) {
      console.error("Error creating workflow:", error);
      return res.status(500).json({ message: "Failed to create workflow" });
    }
  },

  async updateWorkflow(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workflow ID" });
      }

      const { data, error } = validateRequest(updateWorkflowSchema, req.body);
      if (error) {
        return res.status(400).json({ message: error });
      }

      const existingWorkflow = await storage.getWorkflow(id);
      if (!existingWorkflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      // Check if the workflow belongs to the authenticated user
      if (existingWorkflow.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedWorkflow = await storage.updateWorkflow(id, data);
      return res.json(updatedWorkflow);
    } catch (error) {
      console.error("Error updating workflow:", error);
      return res.status(500).json({ message: "Failed to update workflow" });
    }
  },

  async deleteWorkflow(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid workflow ID" });
      }

      const existingWorkflow = await storage.getWorkflow(id);
      if (!existingWorkflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      // Check if the workflow belongs to the authenticated user
      if (existingWorkflow.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteWorkflow(id);
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting workflow:", error);
      return res.status(500).json({ message: "Failed to delete workflow" });
    }
  },

  // Workflow operations
  async deployWorkflow(req: Request, res: Response) {
    try {
      const { name, workflowData, engineType, status } = req.body;
      
      if (!name || !workflowData || !engineType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      let deploymentResult;
      if (engineType === "n8n") {
        deploymentResult = await n8nService.deployWorkflow(workflowData);
      } else if (engineType === "make") {
        deploymentResult = await makeService.deployWorkflow(workflowData);
      } else {
        return res.status(400).json({ message: "Unsupported engine type" });
      }

      // Save the workflow to the database with deployed status
      const workflow = await storage.createWorkflow({
        name,
        description: req.body.description || "",
        prompt: req.body.prompt || "",
        engineType,
        status: "active",
        workflowData,
        mermaidDefinition: req.body.mermaidDefinition || "",
        userId: req.user!.id // Get the authenticated user's ID
      });

      return res.status(201).json({
        ...workflow,
        deploymentResult
      });
    } catch (error) {
      console.error("Error deploying workflow:", error);
      return res.status(500).json({ message: "Failed to deploy workflow" });
    }
  },

  async testWorkflow(req: Request, res: Response) {
    try {
      const { data, error } = validateRequest(workflowTestSchema, req.body);
      if (error) {
        return res.status(400).json({ message: error });
      }

      const workflow = await storage.getWorkflow(data.workflowId);
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }

      let testResult;
      if (workflow.engineType === "n8n") {
        testResult = await n8nService.testWorkflow(workflow.workflowData as WorkflowDefinition, data.testData);
      } else if (workflow.engineType === "make") {
        testResult = await makeService.testWorkflow(workflow.workflowData as WorkflowDefinition, data.testData);
      } else {
        return res.status(400).json({ message: "Unsupported engine type" });
      }

      return res.json({ testResult });
    } catch (error) {
      console.error("Error testing workflow:", error);
      return res.status(500).json({ message: "Failed to test workflow" });
    }
  },

  // Template operations
  async listTemplates(req: Request, res: Response) {
    try {
      const templates = await storage.listTemplates();
      return res.json(templates);
    } catch (error) {
      console.error("Error listing templates:", error);
      return res.status(500).json({ message: "Failed to list templates" });
    }
  },

  async getTemplate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      return res.json(template);
    } catch (error) {
      console.error("Error getting template:", error);
      return res.status(500).json({ message: "Failed to get template" });
    }
  },

  // n8n specific operations
  async deployToN8n(req: Request, res: Response) {
    try {
      const { workflow } = req.body;
      if (!workflow) {
        return res.status(400).json({ message: "Workflow data is required" });
      }

      const result = await n8nService.deployWorkflow(workflow);
      return res.json(result);
    } catch (error) {
      console.error("Error deploying to n8n:", error);
      return res.status(500).json({ message: "Failed to deploy to n8n" });
    }
  },

  async testN8nWorkflow(req: Request, res: Response) {
    try {
      const { workflow, testData } = req.body;
      if (!workflow) {
        return res.status(400).json({ message: "Workflow data is required" });
      }

      const result = await n8nService.testWorkflow(workflow, testData);
      return res.json(result);
    } catch (error) {
      console.error("Error testing n8n workflow:", error);
      return res.status(500).json({ message: "Failed to test n8n workflow" });
    }
  },

  async listN8nWorkflows(req: Request, res: Response) {
    try {
      const workflows = await n8nService.listWorkflows();
      return res.json(workflows);
    } catch (error) {
      console.error("Error listing n8n workflows:", error);
      return res.status(500).json({ message: "Failed to list n8n workflows" });
    }
  },

  async getN8nWorkflow(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const workflow = await n8nService.getWorkflow(id);
      if (!workflow) {
        return res.status(404).json({ message: "n8n workflow not found" });
      }
      return res.json(workflow);
    } catch (error) {
      console.error("Error getting n8n workflow:", error);
      return res.status(500).json({ message: "Failed to get n8n workflow" });
    }
  },

  // Make.com specific operations
  async deployToMake(req: Request, res: Response) {
    try {
      const { workflow } = req.body;
      if (!workflow) {
        return res.status(400).json({ message: "Workflow data is required" });
      }

      const result = await makeService.deployWorkflow(workflow);
      return res.json(result);
    } catch (error) {
      console.error("Error deploying to Make.com:", error);
      return res.status(500).json({ message: "Failed to deploy to Make.com" });
    }
  },

  async testMakeWorkflow(req: Request, res: Response) {
    try {
      const { workflow, testData } = req.body;
      if (!workflow) {
        return res.status(400).json({ message: "Workflow data is required" });
      }

      const result = await makeService.testWorkflow(workflow, testData);
      return res.json(result);
    } catch (error) {
      console.error("Error testing Make.com workflow:", error);
      return res.status(500).json({ message: "Failed to test Make.com workflow" });
    }
  },

  async listMakeWorkflows(req: Request, res: Response) {
    try {
      const workflows = await makeService.listWorkflows();
      return res.json(workflows);
    } catch (error) {
      console.error("Error listing Make.com workflows:", error);
      return res.status(500).json({ message: "Failed to list Make.com workflows" });
    }
  },

  async getMakeWorkflow(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const workflow = await makeService.getWorkflow(id);
      if (!workflow) {
        return res.status(404).json({ message: "Make.com workflow not found" });
      }
      return res.json(workflow);
    } catch (error) {
      console.error("Error getting Make.com workflow:", error);
      return res.status(500).json({ message: "Failed to get Make.com workflow" });
    }
  }
};

export default workflowController;
