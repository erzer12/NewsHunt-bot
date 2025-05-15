import mermaid from "mermaid";
import { WorkflowDefinition, WorkflowNode, WorkflowConnection } from "@shared/schema";

// Initialize mermaid configuration
mermaid.initialize({
  startOnLoad: false,
  theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
  securityLevel: "loose",
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: "linear",
  },
});

export function generateMermaidDefinition(workflow: WorkflowDefinition): string {
  // Start with flowchart definition, top to bottom
  let definition = "graph TD;\n";
  
  // Create nodes
  workflow.nodes.forEach(node => {
    const nodeShape = getNodeShape(node.type);
    definition += `  ${node.id}${nodeShape}["${node.name}"];\n`;
  });
  
  // Create connections
  workflow.connections.forEach(conn => {
    const label = conn.label ? `|${conn.label}|` : "";
    definition += `  ${conn.sourceId} -->`;
    definition += `${label} ${conn.targetId};\n`;
  });
  
  // Add styling
  definition += "  classDef trigger fill:#E6F7FF,stroke:#1890FF,stroke-width:2px;\n";
  definition += "  classDef action fill:#F6FFED,stroke:#52C41A,stroke-width:2px;\n";
  definition += "  classDef condition fill:#FFFBE6,stroke:#FAAD14,stroke-width:2px;\n";
  definition += "  classDef loop fill:#F9F0FF,stroke:#722ED1,stroke-width:2px;\n";
  definition += "  classDef delay fill:#FFF2E8,stroke:#FA541C,stroke-width:2px;\n";
  
  // Apply styles to nodes
  workflow.nodes.forEach(node => {
    definition += `  class ${node.id} ${node.type};\n`;
  });
  
  return definition;
}

function getNodeShape(nodeType: string): string {
  switch (nodeType) {
    case "trigger":
      return "([])"; // Stadium shape for triggers
    case "action":
      return "[/\\]"; // Trapezoid for actions
    case "condition":
      return "{{}"; // Hexagon for conditions
    case "loop":
      return "((-))"; // Circle for loops
    case "delay":
      return "[=-=]"; // Subroutine shape for delays
    default:
      return "[]"; // Rectangle for default
  }
}

export async function renderMermaidDiagram(
  definition: string,
  elementId: string
): Promise<void> {
  try {
    const { svg } = await mermaid.render(elementId, definition);
    document.getElementById(elementId)!.innerHTML = svg;
  } catch (error) {
    console.error("Error rendering Mermaid diagram:", error);
    throw error;
  }
}

export function workflowToMermaid(workflow: WorkflowDefinition): string {
  return generateMermaidDefinition(workflow);
}
