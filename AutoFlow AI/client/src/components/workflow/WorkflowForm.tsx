import { Button } from "@/components/ui/button";

interface WorkflowFormProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export default function WorkflowForm({
  value,
  onChange,
  onGenerate,
  isLoading
}: WorkflowFormProps) {
  return (
    <div>
      <div className="mb-5">
        <div className="relative">
          <textarea 
            className="w-full h-48 px-4 py-3 text-base text-neutral dark:text-white placeholder-gray-500 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-neutral-dark transition-all duration-200" 
            placeholder="Describe your automation workflow in natural language. For example: 'When a new lead submits the contact form, scrape their LinkedIn profile, add them to HubSpot CRM, and send a personalized email.'"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          
          <div className="absolute bottom-3 right-3 flex items-center space-x-1 text-xs text-gray-500">
            <span className="material-icons text-sm">description</span>
            <span>{value.length} characters</span>
          </div>
        </div>
        
        {value.length > 0 && value.length < 10 && (
          <div className="mt-2 text-sm text-red-500 flex items-center">
            <span className="material-icons text-sm mr-1">error_outline</span>
            Please provide a more detailed description (at least 10 characters)
          </div>
        )}
        
        <div className="mt-2 text-sm text-neutral-light">
          <span className="material-icons text-sm inline-block align-text-bottom mr-1">lightbulb</span>
          <span>Tip: Be specific about the triggers, actions, and data you want to process.</span>
        </div>
      </div>
      
      <div className="flex space-x-3">
        <Button
          className="flex-1 px-4 py-2 flex items-center justify-center bg-gradient-to-r from-primary to-primary-light hover:opacity-90 transition-opacity shadow-md"
          onClick={onGenerate}
          disabled={isLoading || !value || value.length < 10}
        >
          {isLoading ? (
            <>
              <span className="material-icons animate-spin mr-2">sync</span>
              <span>Creating your workflow...</span>
            </>
          ) : (
            <>
              <span className="material-icons mr-2">bolt</span>
              <span>Generate Workflow</span>
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="px-4 py-2 border-primary hover:bg-primary/5 transition-colors"
        >
          <span className="material-icons">folder_open</span>
        </Button>
      </div>
      
      {isLoading && (
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md flex items-center">
          <div className="animate-pulse mr-3">
            <span className="material-icons text-primary dark:text-primary-light">psychology</span>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">AI is analyzing your request</span>
            <p className="text-xs mt-1">This typically takes 10-15 seconds depending on the complexity of your workflow</p>
          </div>
        </div>
      )}
    </div>
  );
}
