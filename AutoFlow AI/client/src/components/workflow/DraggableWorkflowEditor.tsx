import { useState, useRef, useEffect } from "react";
import { WorkflowDefinition, WorkflowNode, WorkflowConnection } from "@shared/schema";
import { Button } from "@/components/ui/button";
import WorkflowNodeComponent from "@/components/ui/workflow-node";
import { toast } from "@/hooks/use-toast";

interface DraggableWorkflowEditorProps {
  workflow: WorkflowDefinition | null;
  selectedNodeId?: string;
  onSelectNode: (nodeId: string) => void;
  onWorkflowChange?: (workflow: WorkflowDefinition) => void;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  nodeId: string | null;
  offsetX: number;
  offsetY: number;
}

interface ConnectionInProgress {
  sourceId: string | null;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

export default function DraggableWorkflowEditor({
  workflow,
  selectedNodeId,
  onSelectNode,
  onWorkflowChange
}: DraggableWorkflowEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [positions, setPositions] = useState<NodePosition[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    nodeId: null,
    offsetX: 0,
    offsetY: 0
  });
  const [connectionInProgress, setConnectionInProgress] = useState<ConnectionInProgress>({
    sourceId: null,
    sourceX: 0,
    sourceY: 0,
    targetX: 0,
    targetY: 0
  });
  const [showConnectionMenu, setShowConnectionMenu] = useState(false);
  const [mode, setMode] = useState<'move' | 'connect'>('move');

  // Set initial positions in a grid layout
  useEffect(() => {
    if (workflow && workflow.nodes.length > 0) {
      // Use existing positions if available, otherwise create a new layout
      const newPositions = workflow.nodes.map((node, index) => {
        // If node already has a position, use it
        if (node.position) {
          return {
            id: node.id,
            x: node.position.x,
            y: node.position.y
          };
        }
        
        // Otherwise, create a new position in a grid layout
        const cols = Math.ceil(Math.sqrt(workflow.nodes.length));
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        return {
          id: node.id,
          x: 150 + col * 200,
          y: 100 + row * 150
        };
      });
      
      setPositions(newPositions);
    }
  }, [workflow?.nodes]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleZoomReset = () => {
    setZoom(1);
  };

  const handleNodeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>, 
    nodeId: string
  ) => {
    if (!containerRef.current) return;
    
    if (mode === 'move') {
      // Start dragging the node
      const rect = e.currentTarget.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      setDragState({
        isDragging: true,
        nodeId,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      });
    } else if (mode === 'connect') {
      // Start creating a connection
      const nodePos = positions.find(p => p.id === nodeId);
      if (nodePos) {
        setConnectionInProgress({
          sourceId: nodeId,
          sourceX: nodePos.x,
          sourceY: nodePos.y,
          targetX: nodePos.x,
          targetY: nodePos.y
        });
      }
    }
    
    // Select the node
    onSelectNode(nodeId);
    
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    if (dragState.isDragging && dragState.nodeId) {
      // Update the position of the dragged node
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - containerRect.left) / zoom - dragState.offsetX;
      const y = (e.clientY - containerRect.top) / zoom - dragState.offsetY;
      
      setPositions(prev => prev.map(pos => 
        pos.id === dragState.nodeId 
          ? { ...pos, x, y } 
          : pos
      ));
    } else if (connectionInProgress.sourceId) {
      // Update the end point of the connection being created
      const containerRect = containerRef.current.getBoundingClientRect();
      setConnectionInProgress(prev => ({
        ...prev,
        targetX: (e.clientX - containerRect.left) / zoom,
        targetY: (e.clientY - containerRect.top) / zoom
      }));
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    // Stop dragging
    if (dragState.isDragging) {
      setDragState({
        isDragging: false,
        nodeId: null,
        offsetX: 0,
        offsetY: 0
      });
      
      // Update node positions in the workflow
      if (workflow && onWorkflowChange) {
        const updatedNodes = workflow.nodes.map(node => {
          const position = positions.find(p => p.id === node.id);
          if (position) {
            return {
              ...node,
              position: { x: position.x, y: position.y }
            };
          }
          return node;
        });
        
        onWorkflowChange({
          ...workflow,
          nodes: updatedNodes
        });
      }
    }
    
    // Check if we need to create a connection
    if (connectionInProgress.sourceId) {
      // Find if we're hovering over a node
      const targetNodeId = getNodeAtPosition(connectionInProgress.targetX, connectionInProgress.targetY);
      
      if (targetNodeId && targetNodeId !== connectionInProgress.sourceId) {
        // Create a new connection
        if (workflow && onWorkflowChange) {
          // Check if connection already exists
          const connectionExists = workflow.connections.some(
            conn => conn.sourceId === connectionInProgress.sourceId && conn.targetId === targetNodeId
          );
          
          if (!connectionExists) {
            const newConnection: WorkflowConnection = {
              id: `conn-${Date.now()}`,
              sourceId: connectionInProgress.sourceId,
              targetId: targetNodeId,
              label: "Next"
            };
            
            onWorkflowChange({
              ...workflow,
              connections: [...workflow.connections, newConnection]
            });
            
            toast({
              title: "Connection created",
              description: "A new connection has been added to your workflow",
            });
          }
        }
      }
      
      // Reset connection in progress
      setConnectionInProgress({
        sourceId: null,
        sourceX: 0,
        sourceY: 0,
        targetX: 0,
        targetY: 0
      });
    }
  };

  const getNodeAtPosition = (x: number, y: number): string | null => {
    if (!workflow) return null;
    
    // Find a node at the given position
    for (const pos of positions) {
      const node = workflow.nodes.find(n => n.id === pos.id);
      if (!node) continue;
      
      // Check if position is within the node boundaries
      // Using approximate node dimensions
      const nodeWidth = 224; // 56 * 4
      const nodeHeight = 80;
      
      if (
        x >= pos.x - 5 &&
        x <= pos.x + nodeWidth + 5 &&
        y >= pos.y - 5 &&
        y <= pos.y + nodeHeight + 5
      ) {
        return pos.id;
      }
    }
    
    return null;
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!workflow || !onWorkflowChange) return;
    
    // Remove the node
    const updatedNodes = workflow.nodes.filter(node => node.id !== nodeId);
    
    // Remove any connections involving the node
    const updatedConnections = workflow.connections.filter(
      conn => conn.sourceId !== nodeId && conn.targetId !== nodeId
    );
    
    // Update the workflow
    onWorkflowChange({
      ...workflow,
      nodes: updatedNodes,
      connections: updatedConnections
    });
    
    // Update positions
    setPositions(prev => prev.filter(pos => pos.id !== nodeId));
    
    // Deselect if the deleted node was selected
    if (selectedNodeId === nodeId) {
      onSelectNode("");
    }
    
    toast({
      title: "Node deleted",
      description: "The node has been removed from your workflow",
    });
  };

  const handleDeleteConnection = (connectionId: string) => {
    if (!workflow || !onWorkflowChange) return;
    
    // Remove the connection
    const updatedConnections = workflow.connections.filter(conn => conn.id !== connectionId);
    
    // Update the workflow
    onWorkflowChange({
      ...workflow,
      connections: updatedConnections
    });
    
    toast({
      title: "Connection deleted",
      description: "The connection has been removed from your workflow",
    });
  };

  const handleAddNode = (type: string) => {
    if (!workflow || !onWorkflowChange) return;
    
    // Create a new node
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: type as any,
      name: `New ${type} node`,
      description: `This is a new ${type} node`,
      service: "",
      position: { x: 300, y: 200 }
    };
    
    // Update the workflow
    onWorkflowChange({
      ...workflow,
      nodes: [...workflow.nodes, newNode]
    });
    
    // Add position
    setPositions(prev => [
      ...prev,
      { id: newNode.id, x: 300, y: 200 }
    ]);
    
    toast({
      title: "Node added",
      description: `A new ${type} node has been added to your workflow`,
    });
  };

  if (!workflow) {
    return (
      <div className="bg-white dark:bg-neutral-dark rounded-lg shadow flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-medium font-heading">Workflow Editor</h2>
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

  return (
    <div className="bg-white dark:bg-neutral-dark rounded-lg shadow flex-1 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-lg font-medium mr-3 font-heading">Interactive Workflow Editor</h2>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant={mode === 'move' ? 'default' : 'outline'} 
              onClick={() => setMode('move')}
              className="h-8"
            >
              <span className="material-icons text-sm mr-1">open_with</span>
              Move
            </Button>
            <Button 
              size="sm" 
              variant={mode === 'connect' ? 'default' : 'outline'} 
              onClick={() => setMode('connect')}
              className="h-8"
            >
              <span className="material-icons text-sm mr-1">add_link</span>
              Connect
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="icon" variant="ghost" onClick={() => handleAddNode('trigger')}>
            <span className="material-icons">add_circle</span>
          </Button>
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
      
      <div className="toolbar p-2 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-2 overflow-x-auto">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-2">Add Node:</span>
        <Button size="sm" variant="outline" className="h-8" onClick={() => handleAddNode('trigger')}>
          <span className="material-icons text-sm mr-1 text-blue-500">notifications_active</span>
          Trigger
        </Button>
        <Button size="sm" variant="outline" className="h-8" onClick={() => handleAddNode('action')}>
          <span className="material-icons text-sm mr-1 text-purple-500">play_arrow</span>
          Action
        </Button>
        <Button size="sm" variant="outline" className="h-8" onClick={() => handleAddNode('condition')}>
          <span className="material-icons text-sm mr-1 text-yellow-500">call_split</span>
          Condition
        </Button>
        <Button size="sm" variant="outline" className="h-8" onClick={() => handleAddNode('loop')}>
          <span className="material-icons text-sm mr-1 text-indigo-500">loop</span>
          Loop
        </Button>
        <Button size="sm" variant="outline" className="h-8" onClick={() => handleAddNode('delay')}>
          <span className="material-icons text-sm mr-1 text-orange-500">timer</span>
          Delay
        </Button>
      </div>
      
      <div 
        className="flex-1 p-0 overflow-auto relative bg-gray-50 dark:bg-gray-900"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div 
          className="min-w-full min-h-full relative"
          style={{ 
            transform: `scale(${zoom})`, 
            transformOrigin: 'center top',
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)', 
            backgroundSize: '20px 20px'
          }}
        >
          {/* Render connections */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {workflow.connections.map(connection => {
              const sourcePos = positions.find(p => p.id === connection.sourceId);
              const targetPos = positions.find(p => p.id === connection.targetId);
              
              if (!sourcePos || !targetPos) return null;
              
              // Calculate connection points (center of nodes)
              const sourceX = sourcePos.x + 112; // Half of node width
              const sourceY = sourcePos.y + 40; // Half of node height
              const targetX = targetPos.x + 112;
              const targetY = targetPos.y + 40;
              
              // Calculate control points for curve
              const midX = (sourceX + targetX) / 2;
              const midY = (sourceY + targetY) / 2;
              const dx = targetX - sourceX;
              const dy = targetY - sourceY;
              const angle = Math.atan2(dy, dx);
              
              // Path for the connection
              const path = `M ${sourceX} ${sourceY} Q ${midX} ${sourceY} ${midX} ${midY} T ${targetX} ${targetY}`;
              
              return (
                <g key={connection.id}>
                  <path 
                    d={path} 
                    stroke="rgba(107, 114, 128, 0.5)" 
                    strokeWidth="2" 
                    fill="none" 
                    markerEnd="url(#arrowhead)" 
                  />
                  <circle 
                    cx={midX} 
                    cy={midY} 
                    r="6" 
                    fill="white" 
                    stroke="rgba(107, 114, 128, 0.5)" 
                    strokeWidth="1" 
                    className="connection-handle" 
                    onClick={() => handleDeleteConnection(connection.id)}
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  />
                  {connection.label && (
                    <text 
                      x={midX} 
                      y={midY - 10} 
                      textAnchor="middle" 
                      fill="rgba(107, 114, 128, 0.8)" 
                      fontSize="10"
                      style={{ pointerEvents: 'none' }}
                    >
                      {connection.label}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Connection being created */}
            {connectionInProgress.sourceId && (
              <path 
                d={`M ${connectionInProgress.sourceX + 112} ${connectionInProgress.sourceY + 40} L ${connectionInProgress.targetX} ${connectionInProgress.targetY}`} 
                stroke="rgba(59, 130, 246, 0.5)" 
                strokeWidth="2" 
                strokeDasharray="5,5" 
                fill="none" 
              />
            )}
            
            {/* SVG Definitions */}
            <defs>
              <marker 
                id="arrowhead" 
                markerWidth="10" 
                markerHeight="7" 
                refX="0" 
                refY="3.5" 
                orient="auto"
              >
                <polygon 
                  points="0 0, 10 3.5, 0 7" 
                  fill="rgba(107, 114, 128, 0.8)" 
                />
              </marker>
            </defs>
          </svg>
          
          {/* Render nodes */}
          {workflow.nodes.map(node => {
            const pos = positions.find(p => p.id === node.id) || { x: 0, y: 0 };
            
            return (
              <div 
                key={node.id} 
                className="absolute transform cursor-move"
                style={{ 
                  left: `${pos.x}px`, 
                  top: `${pos.y}px`,
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              >
                <div className="relative group">
                  <WorkflowNodeComponent
                    id={node.id}
                    type={node.type}
                    name={node.name}
                    description={node.description}
                    service={node.service}
                    icon={node.icon}
                    isSelected={node.id === selectedNodeId}
                  />
                  
                  {/* Node actions */}
                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="icon" 
                      variant="destructive" 
                      className="h-6 w-6 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                    >
                      <span className="material-icons text-xs">close</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
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