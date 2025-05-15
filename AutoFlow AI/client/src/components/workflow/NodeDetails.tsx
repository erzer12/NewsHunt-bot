import { useState } from "react";
import { WorkflowNode } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NodeDetailsProps {
  node: WorkflowNode;
}

export default function NodeDetails({ node }: NodeDetailsProps) {
  const [name, setName] = useState(node.name);
  const [description, setDescription] = useState(node.description || "");
  
  // In a real app, this would save the changes to the workflow
  const handleSave = () => {
    console.log("Saving node:", { ...node, name, description });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="node-name">Node Name</Label>
        <Input
          id="node-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="node-description">Description</Label>
        <Textarea
          id="node-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label>Node Type</Label>
        <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm mt-1">
          {node.type}
        </div>
      </div>
      
      {node.service && (
        <div>
          <Label>Service</Label>
          <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm mt-1">
            {node.service}
          </div>
        </div>
      )}
      
      {/* Render specific configuration options based on node type */}
      {node.type === 'trigger' && (
        <div>
          <Label>Trigger Configuration</Label>
          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md mt-1">
            <div className="space-y-2">
              <div>
                <Label htmlFor="trigger-event" className="text-xs">Event Type</Label>
                <Input
                  id="trigger-event"
                  defaultValue={node.config?.event || ""}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="trigger-interval" className="text-xs">Check Interval (minutes)</Label>
                <Input
                  id="trigger-interval"
                  type="number"
                  defaultValue={node.config?.interval || 5}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {node.type === 'action' && (
        <div>
          <Label>Action Configuration</Label>
          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md mt-1">
            <div className="space-y-2">
              <div>
                <Label htmlFor="action-operation" className="text-xs">Operation</Label>
                <Input
                  id="action-operation"
                  defaultValue={node.config?.operation || ""}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="action-fields" className="text-xs">Fields (JSON)</Label>
                <Textarea
                  id="action-fields"
                  defaultValue={node.config?.fields ? JSON.stringify(node.config.fields, null, 2) : "{}"}
                  className="mt-1 font-mono text-xs"
                  rows={5}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
