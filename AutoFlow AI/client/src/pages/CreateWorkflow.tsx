import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowForm from "@/components/workflow/WorkflowForm";
import MindMapUpload from "@/components/workflow/MindMapUpload";
import AIChat from "@/components/workflow/AIChat";
import WorkflowDiagram from "@/components/workflow/WorkflowDiagram";
import DraggableWorkflowEditor from "@/components/workflow/DraggableWorkflowEditor";
import NodeDetails from "@/components/workflow/NodeDetails";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { WorkflowDefinition, WorkflowNode } from "@shared/schema";

export default function CreateWorkflow() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [inputTab, setInputTab] = useState<"text" | "mindmap">("text");
  const [workflowStep, setWorkflowStep] = useState<number>(1);
  const [workflowName, setWorkflowName] = useState<string>("");
  const [workflowPrompt, setWorkflowPrompt] = useState<string>("");
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowDefinition | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: "system", content: "I'll help you create an automation workflow. Let me understand what you're trying to accomplish." }
  ]);

  const generateWorkflowMutation = useMutation({
    mutationFn: async (data: { prompt: string, engineType: string }) => {
      const response = await apiRequest("POST", "/api/workflow/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedWorkflow(data.workflow);
      setChatMessages(prev => [
        ...prev,
        { role: "user", content: workflowPrompt },
        { role: "assistant", content: data.explanation }
      ]);
      toast({
        title: "Workflow generated successfully",
        description: "Your workflow has been created based on your description."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to generate workflow",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const saveWorkflowMutation = useMutation({
    mutationFn: async (data: {
      name: string,
      prompt: string,
      workflowData: any,
      mermaidDefinition: string,
      engineType: string,
      status: string
    }) => {
      const response = await apiRequest("POST", "/api/workflows", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Workflow saved",
        description: "Your workflow has been saved successfully."
      });
      navigate(`/workflows/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to save workflow",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deployWorkflowMutation = useMutation({
    mutationFn: async (data: {
      name: string,
      prompt: string,
      workflowData: any,
      mermaidDefinition: string,
      engineType: string,
      status: string
    }) => {
      const response = await apiRequest("POST", "/api/workflow/deploy", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Workflow deployed",
        description: "Your workflow has been deployed successfully."
      });
      navigate(`/workflows/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to deploy workflow",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleGenerateWorkflow = () => {
    if (!workflowPrompt || workflowPrompt.length < 10) {
      toast({
        title: "Prompt too short",
        description: "Please provide a more detailed description of your workflow.",
        variant: "destructive"
      });
      return;
    }

    generateWorkflowMutation.mutate({
      prompt: workflowPrompt,
      engineType: "n8n"
    });
  };

  const handleSaveDraft = () => {
    if (!generatedWorkflow) {
      toast({
        title: "No workflow to save",
        description: "Please generate a workflow first.",
        variant: "destructive"
      });
      return;
    }

    if (!workflowName) {
      toast({
        title: "Workflow name required",
        description: "Please enter a name for your workflow.",
        variant: "destructive"
      });
      return;
    }

    saveWorkflowMutation.mutate({
      name: workflowName,
      prompt: workflowPrompt,
      workflowData: generatedWorkflow,
      mermaidDefinition: "", // Would be generated from the workflow
      engineType: "n8n",
      status: "draft"
    });
  };

  const handleDeployWorkflow = () => {
    if (!generatedWorkflow) {
      toast({
        title: "No workflow to deploy",
        description: "Please generate a workflow first.",
        variant: "destructive"
      });
      return;
    }

    if (!workflowName) {
      toast({
        title: "Workflow name required",
        description: "Please enter a name for your workflow.",
        variant: "destructive"
      });
      return;
    }

    deployWorkflowMutation.mutate({
      name: workflowName,
      prompt: workflowPrompt,
      workflowData: generatedWorkflow,
      mermaidDefinition: "", // Would be generated from the workflow
      engineType: "n8n",
      status: "active"
    });
  };

  const handleSelectNode = (nodeId: string) => {
    if (!generatedWorkflow) return;
    const node = generatedWorkflow.nodes.find(n => n.id === nodeId) || null;
    setSelectedNode(node);
  };

  const handleSendChatMessage = (message: string) => {
    setChatMessages(prev => [
      ...prev,
      { role: "user", content: message }
    ]);
    
    // In a real app, this would send the message to the AI and get a response
    // For now, we'll just simulate a response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { role: "assistant", content: "I've noted your feedback. Is there anything else you'd like to modify in the workflow?" }
      ]);
    }, 1000);
  };

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-dark py-5 px-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-heading font-semibold text-gradient-primary">Create New Workflow</h1>
          <p className="text-neutral dark:text-neutral-light text-sm mt-1">Transform your ideas into automated workflows in minutes</p>
        </div>
        <div className="flex space-x-3 mt-3 md:mt-0">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={saveWorkflowMutation.isPending || !generatedWorkflow}
            className="border-primary hover:bg-primary/5 transition-colors"
          >
            {saveWorkflowMutation.isPending ? (
              <>
                <span className="material-icons animate-spin mr-1 text-sm">sync</span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-icons mr-1 text-sm">save</span>
                Save Draft
              </>
            )}
          </Button>
          <Button
            onClick={handleDeployWorkflow}
            disabled={deployWorkflowMutation.isPending || !generatedWorkflow}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-md"
          >
            {deployWorkflowMutation.isPending ? (
              <>
                <span className="material-icons animate-spin mr-1 text-sm">sync</span>
                Deploying...
              </>
            ) : (
              <>
                <span className="material-icons mr-1 text-sm">rocket_launch</span>
                Deploy Workflow
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="px-4 md:px-6 py-4 bg-gray-50 dark:bg-gray-900">
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button 
            className={`px-5 py-3 border-b-2 font-medium flex items-center transition-all ${
              workflowStep === 1 
                ? "border-primary text-primary dark:text-primary-light border-b-[3px]" 
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-primary/70 dark:hover:text-primary-light/70"
            }`}
            onClick={() => setWorkflowStep(1)}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              workflowStep === 1 
                ? "bg-primary text-white" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}>1</div>
            Define
          </button>
          <button 
            className={`px-5 py-3 border-b-2 font-medium flex items-center transition-all ${
              workflowStep === 2 
                ? "border-primary text-primary dark:text-primary-light border-b-[3px]" 
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-primary/70 dark:hover:text-primary-light/70"
            } ${!generatedWorkflow ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => generatedWorkflow && setWorkflowStep(2)}
            disabled={!generatedWorkflow}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              workflowStep === 2 
                ? "bg-primary text-white" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}>2</div>
            Configure
          </button>
          <button 
            className={`px-5 py-3 border-b-2 font-medium flex items-center transition-all ${
              workflowStep === 3 
                ? "border-primary text-primary dark:text-primary-light border-b-[3px]" 
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-primary/70 dark:hover:text-primary-light/70"
            } ${!generatedWorkflow ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => generatedWorkflow && setWorkflowStep(3)}
            disabled={!generatedWorkflow}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              workflowStep === 3 
                ? "bg-primary text-white" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}>3</div>
            Test & Run
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="bg-white dark:bg-neutral-dark rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-medium mb-3 font-heading">
              {workflowStep === 1 && "Describe Your Workflow"}
              {workflowStep === 2 && "Configure Workflow"}
              {workflowStep === 3 && "Test Workflow"}
            </h2>
            
            {workflowStep === 1 && (
              <>
                <div className="mb-4">
                  <label htmlFor="workflowName" className="block text-sm font-medium mb-1">
                    Workflow Name
                  </label>
                  <input
                    id="workflowName"
                    type="text"
                    value={workflowName}
                    onChange={e => setWorkflowName(e.target.value)}
                    className="w-full px-3 py-2 text-base text-neutral dark:text-white placeholder-gray-500 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-white dark:bg-neutral-dark"
                    placeholder="Enter a name for your workflow"
                  />
                </div>
                
                <Tabs value={inputTab} onValueChange={(value) => setInputTab(value as "text" | "mindmap")}>
                  <TabsList className="mb-4 border-b border-gray-200 dark:border-gray-800 w-full justify-start">
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="mindmap">Mindmap</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text">
                    <WorkflowForm
                      value={workflowPrompt}
                      onChange={setWorkflowPrompt}
                      onGenerate={handleGenerateWorkflow}
                      isLoading={generateWorkflowMutation.isPending}
                    />
                  </TabsContent>
                  <TabsContent value="mindmap">
                    <MindMapUpload 
                      onProcessed={setWorkflowPrompt}
                      onGenerate={handleGenerateWorkflow}
                      isLoading={generateWorkflowMutation.isPending}
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}

            {workflowStep === 2 && generatedWorkflow && (
              <div>
                <p className="text-sm mb-4">
                  Configure the settings and parameters for each node in your workflow.
                  Click on a node in the diagram to edit its properties.
                </p>
                {selectedNode && <NodeDetails node={selectedNode} />}
                {!selectedNode && (
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Select a node from the diagram to configure its details
                    </p>
                  </div>
                )}
              </div>
            )}

            {workflowStep === 3 && generatedWorkflow && (
              <div>
                <p className="text-sm mb-4">
                  Test your workflow before deploying it. You can provide sample data
                  and see how the workflow behaves.
                </p>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <h3 className="font-medium mb-2">Test Configuration</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Select which parts of the workflow to test:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="test-all" 
                        className="mr-2" 
                        checked 
                      />
                      <label htmlFor="test-all">Test entire workflow</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="use-sample" 
                        className="mr-2" 
                      />
                      <label htmlFor="use-sample">Use sample data</label>
                    </div>
                  </div>
                  
                  <Button className="mt-4 w-full">
                    Run Test
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <AIChat 
            messages={chatMessages}
            onSendMessage={handleSendChatMessage}
          />
        </div>
        
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="bg-white dark:bg-neutral-dark rounded-lg shadow p-4 mb-6 flex justify-between items-center">
            <h2 className="text-lg font-medium font-heading">
              {workflowStep === 1 ? "Generated Workflow" : "Interactive Workflow Editor"}
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled={!generatedWorkflow}>
                Export
              </Button>
              <Button 
                size="sm" 
                disabled={!generatedWorkflow}
                onClick={() => toast({
                  title: "Editor Tips",
                  description: "Drag nodes to reposition them. Use Connect mode to create links between nodes. Click on nodes to edit their properties.",
                })}
              >
                <span className="material-icons text-sm mr-1">help_outline</span>
                Help
              </Button>
            </div>
          </div>

          {workflowStep === 1 ? (
            <WorkflowDiagram 
              workflow={generatedWorkflow}
              selectedNodeId={selectedNode?.id}
              onSelectNode={handleSelectNode}
            />
          ) : (
            <DraggableWorkflowEditor
              workflow={generatedWorkflow}
              selectedNodeId={selectedNode?.id}
              onSelectNode={handleSelectNode}
              onWorkflowChange={setGeneratedWorkflow}
            />
          )}
        </div>
      </div>
    </>
  );
}
