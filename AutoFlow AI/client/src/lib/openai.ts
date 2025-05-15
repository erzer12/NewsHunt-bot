import { WorkflowDefinition, WorkflowNode, WorkflowConnection } from "@shared/schema";

// In a real implementation, we would use the OpenAI client library
// This is a mock implementation for the frontend
export async function generateWorkflowFromPrompt(
  prompt: string,
  engineType: string = "n8n"
): Promise<{
  workflow: WorkflowDefinition;
  explanation: string;
}> {
  try {
    const response = await fetch("/api/workflow/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, engineType }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to generate workflow: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating workflow:", error);
    throw error;
  }
}

export async function processMindMap(
  file: File
): Promise<{ prompt: string }> {
  try {
    const formData = new FormData();
    formData.append("mindmap", file);

    const response = await fetch("/api/workflow/process-mindmap", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to process mind map: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing mind map:", error);
    throw error;
  }
}

export async function refineWorkflow(
  workflow: WorkflowDefinition,
  feedback: string
): Promise<{
  workflow: WorkflowDefinition;
  explanation: string;
}> {
  try {
    const response = await fetch("/api/workflow/refine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workflow, feedback }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to refine workflow: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error refining workflow:", error);
    throw error;
  }
}
