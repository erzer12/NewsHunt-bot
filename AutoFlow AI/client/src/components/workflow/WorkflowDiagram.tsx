import { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import { Button } from "@/components/ui/button";
import { WorkflowDefinition, WorkflowNode } from "@shared/schema";
import WorkflowNodeComponent from "@/components/ui/workflow-node";

interface WorkflowDiagramProps {
  workflow: WorkflowDefinition | null;
  selectedNodeId?: string;
  onSelectNode: (nodeId: string) => void;
}

export default function WorkflowDiagram({
  workflow,
  selectedNodeId,
  onSelectNode
}: WorkflowDiagramProps) {
  const [zoom, setZoom] = useState(1);
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleZoomReset = () => {
    setZoom(1);
  };

  if (!workflow) {
    return (
      <div className="bg-white dark:bg-neutral-dark rounded-lg shadow flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-medium font-heading">Workflow Diagram</h2>
          <div className="flex items-center space-x-3">
            <Button size="icon" variant="ghost" disabled>
              <span className="material-icons">zoom_in</span>
            </Button>
            <Button size="icon" variant="ghost" disabled>
              <span className="material-icons">zoom_out</span>
            </Button>
            <Button size="icon" variant="ghost" disabled>
              <span className="material-icons">fit_screen</span>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <span className="material-icons text-5xl mb-2">account_tree</span>
            <h3 className="text-lg font-medium">No Workflow Generated</h3>
            <p className="max-w-md mx-auto mt-2">
              Describe your automation workflow using text or upload a mind map to generate a visual workflow diagram.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render workflow diagram using actual WorkflowNode components
  return (
    <div className="bg-white dark:bg-neutral-dark rounded-lg shadow flex-1 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-medium mr-3 font-heading">Workflow Diagram</h2>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
            Valid
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="icon" variant="ghost" onClick={handleZoomIn}>
            <span className="material-icons">zoom_in</span>
          </Button>
          <Button size="icon" variant="ghost" onClick={handleZoomOut}>
            <span className="material-icons">zoom_out</span>
          </Button>
          <Button size="icon" variant="ghost" onClick={handleZoomReset}>
            <span className="material-icons">fit_screen</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-auto">
        <div 
          className="min-w-[600px] min-h-[500px] flex flex-col items-center"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
        >
          {/* A simple vertical layout of nodes with connecting arrows */}
          <div className="relative w-full py-10">
            {workflow.nodes.map((node, index) => {
              const nodeTop = index * 140;
              return (
                <div key={node.id}>
                  {/* Node */}
                  <div className="absolute" style={{ top: `${nodeTop}px`, left: '50%', transform: 'translateX(-50%)' }}>
                    <WorkflowNodeComponent
                      id={node.id}
                      type={node.type}
                      name={node.name}
                      description={node.description}
                      service={node.service}
                      icon={node.icon}
                      isSelected={node.id === selectedNodeId}
                      onClick={onSelectNode}
                    />
                  </div>
                  
                  {/* Arrow to next node (except for last node) */}
                  {index < workflow.nodes.length - 1 && (
                    <>
                      <div 
                        className="absolute bg-gray-300 dark:bg-gray-700"
                        style={{ 
                          top: `${nodeTop + 85}px`, 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          width: '2px',
                          height: '30px'
                        }}
                      ></div>
                      <div 
                        className="absolute"
                        style={{ 
                          top: `${nodeTop + 114}px`, 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 0,
                          borderLeft: '6px solid transparent',
                          borderRight: '6px solid transparent',
                          borderTop: '8px solid',
                          borderTopColor: 'var(--border-color, #d1d5db)'
                        }}
                      ></div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Node details */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">
            {selectedNodeId 
              ? `Node Details: ${workflow.nodes.find(n => n.id === selectedNodeId)?.name}` 
              : "Node Details: No node selected"}
          </h3>
          {selectedNodeId && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              {workflow.nodes.find(n => n.id === selectedNodeId)?.type.toUpperCase()} Step
            </span>
          )}
        </div>
        {selectedNodeId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Type</label>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">
                {workflow.nodes.find(n => n.id === selectedNodeId)?.type}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Service</label>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm">
                {workflow.nodes.find(n => n.id === selectedNodeId)?.service || "N/A"}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a node from the workflow diagram to view its details
          </p>
        )}
      </div>
    </div>
  );
}
