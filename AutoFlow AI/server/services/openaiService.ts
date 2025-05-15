import OpenAI from "openai";
import fs from "fs";
import { WorkflowDefinition, WorkflowNode, WorkflowConnection, EngineType } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "" });

interface WorkflowResponse {
  workflow: WorkflowDefinition;
  explanation: string;
}

const openaiService = {
  async generateWorkflow(prompt: string, engineType: EngineType): Promise<WorkflowResponse> {
    try {
      const systemPrompt = `You are an expert in automation workflows, particularly for ${engineType}. 
Given a user's request, analyze it and create a detailed workflow with appropriate nodes and connections.
For each node, specify its type (trigger, action, condition, loop, delay), name, description, service (if applicable), and icon.
Create proper connections between nodes.

Output the workflow as a JSON object with the following structure:
{
  "workflow": {
    "nodes": [
      {
        "id": "unique-id",
        "type": "trigger|action|condition|loop|delay",
        "name": "Node Name",
        "description": "What this node does",
        "service": "Service name if applicable",
        "icon": "icon-name"
      }
    ],
    "connections": [
      {
        "id": "unique-id",
        "sourceId": "source-node-id",
        "targetId": "target-node-id",
        "label": "Optional connection label"
      }
    ]
  },
  "explanation": "A clear explanation of the workflow in natural language, describing what each step does and how they connect."
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content as string);
      
      // Validate the response has the expected structure
      if (!result.workflow || !result.workflow.nodes || !result.workflow.connections || !result.explanation) {
        throw new Error("AI returned an invalid workflow structure");
      }

      return result as WorkflowResponse;
    } catch (error) {
      console.error("OpenAI workflow generation error:", error);
      throw error;
    }
  },

  async processMindMap(imagePath: string): Promise<{ prompt: string }> {
    try {
      // Read the image file as a base64 string
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at interpreting mind maps and flowcharts. Analyze the uploaded mind map image and convert it into a detailed textual description of an automation workflow. Focus on the steps, connections, and logic that would need to be implemented."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "This is a mind map or flowchart for an automation workflow I want to create. Please analyze it and give me a detailed description that I can use to generate an actual automation workflow. Be specific about triggers, actions, conditions, and the overall flow."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ]
      });

      const prompt = response.choices[0].message.content || "";
      
      return { prompt };
    } catch (error) {
      console.error("OpenAI mind map processing error:", error);
      throw error;
    }
  },

  async refineWorkflow(workflow: WorkflowDefinition, feedback: string): Promise<WorkflowResponse> {
    try {
      const systemPrompt = `You are an expert in automation workflows. 
A user has provided feedback on a workflow. Modify the workflow according to their feedback.
Maintain the same structure for nodes and connections, but update, add, or remove as needed based on the feedback.

Output the updated workflow as a JSON object with the following structure:
{
  "workflow": {
    "nodes": [
      {
        "id": "unique-id",
        "type": "trigger|action|condition|loop|delay",
        "name": "Node Name",
        "description": "What this node does",
        "service": "Service name if applicable",
        "icon": "icon-name"
      }
    ],
    "connections": [
      {
        "id": "unique-id",
        "sourceId": "source-node-id",
        "targetId": "target-node-id",
        "label": "Optional connection label"
      }
    ]
  },
  "explanation": "An explanation of the changes made to the workflow based on the feedback."
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Here is the current workflow: ${JSON.stringify(workflow)}\n\nFeedback: ${feedback}` 
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content as string);
      
      // Validate the response has the expected structure
      if (!result.workflow || !result.workflow.nodes || !result.workflow.connections || !result.explanation) {
        throw new Error("AI returned an invalid workflow structure");
      }

      return result as WorkflowResponse;
    } catch (error) {
      console.error("OpenAI workflow refinement error:", error);
      throw error;
    }
  }
};

export default openaiService;
