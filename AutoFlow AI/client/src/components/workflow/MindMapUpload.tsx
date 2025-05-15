import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MindMapUploadProps {
  onProcessed: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export default function MindMapUpload({ 
  onProcessed, 
  onGenerate,
  isLoading 
}: MindMapUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  
  const processMindMapMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/workflow/process-mindmap", formData);
      return response.json();
    },
    onSuccess: (data) => {
      onProcessed(data.prompt);
      toast({
        title: "Mind map processed",
        description: "Your mind map has been processed successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to process mind map",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a mind map image to upload.",
        variant: "destructive"
      });
      return;
    }
    
    const formData = new FormData();
    formData.append('mindmap', file);
    processMindMapMutation.mutate(formData);
  };

  return (
    <div>
      <div className="mb-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center">
        {preview ? (
          <div className="mb-4">
            <img src={preview} alt="Mind map preview" className="max-h-40 mx-auto" />
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <span className="material-icons text-3xl mb-2">upload_file</span>
            <p>Drag and drop your mind map image here, or click to select a file</p>
            <p className="text-xs mt-1">Supported formats: PNG, JPG, SVG</p>
          </div>
        )}
        
        <input
          type="file"
          id="mindmap-upload"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => document.getElementById('mindmap-upload')?.click()}
        >
          {file ? "Change File" : "Select File"}
        </Button>
        
        {file && (
          <Button
            className="ml-2 mt-2"
            onClick={handleUpload}
            disabled={processMindMapMutation.isPending}
          >
            {processMindMapMutation.isPending ? "Processing..." : "Process Mind Map"}
          </Button>
        )}
      </div>
      
      <div className="flex space-x-3">
        <Button
          className="flex-1 px-4 py-2 flex items-center justify-center"
          onClick={onGenerate}
          disabled={isLoading || processMindMapMutation.isPending}
        >
          <span className="material-icons mr-1">bolt</span>
          {isLoading ? "Generating..." : "Generate Workflow"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="px-4 py-2"
          onClick={() => {}}
        >
          <span className="material-icons">folder_open</span>
        </Button>
      </div>
    </div>
  );
}
