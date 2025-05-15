import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Sample workflows
const sampleWorkflows = [
  {
    id: 1,
    name: "Lead Generation Pipeline",
    description: "Automatically gather leads from LinkedIn and add to Salesforce",
    status: "active",
    engineType: "n8n",
    createdAt: "2023-07-15T10:30:00Z",
    runs: 128,
    lastRun: "2023-07-28T14:22:00Z",
  },
  {
    id: 2,
    name: "Email Follow-up Sequence",
    description: "Send personalized follow-up emails to new contacts",
    status: "draft",
    engineType: "make",
    createdAt: "2023-07-20T15:45:00Z",
    runs: 0,
    lastRun: null,
  },
  {
    id: 3,
    name: "Customer Feedback Analysis",
    description: "Collect and analyze customer feedback from multiple sources",
    status: "active",
    engineType: "n8n",
    createdAt: "2023-07-10T09:15:00Z",
    runs: 45,
    lastRun: "2023-07-28T08:10:00Z",
  },
  {
    id: 4,
    name: "Social Media Monitoring",
    description: "Track brand mentions across social platforms",
    status: "inactive",
    engineType: "n8n",
    createdAt: "2023-07-05T11:20:00Z",
    runs: 12,
    lastRun: "2023-07-15T16:30:00Z",
  },
  {
    id: 5,
    name: "Content Distribution",
    description: "Automatically share new content across platforms",
    status: "draft",
    engineType: "make",
    createdAt: "2023-07-25T14:10:00Z",
    runs: 0,
    lastRun: null,
  }
];

export default function WorkflowList() {
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split('?')[1] || '');
  const defaultFilter = queryParams.get('filter') || 'all';
  
  const [statusFilter, setStatusFilter] = useState<string>(defaultFilter);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkflows = sampleWorkflows.filter(workflow => {
    // Status filter
    if (statusFilter !== 'all' && statusFilter !== 'recent' && statusFilter !== 'favorites') {
      if (workflow.status !== statusFilter) return false;
    }
    
    // Search term
    if (searchTerm && 
        !workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !workflow.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading">My Workflows</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your automation workflows
          </p>
        </div>
        
        <Link href="/create" className="inline-block self-start sm:self-auto">
          <Button>
            <span className="material-icons mr-1 text-sm">add</span>
            New Workflow
          </Button>
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search workflows..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-white dark:bg-neutral-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <span className="material-icons text-lg">search</span>
          </span>
        </div>
        
        <div>
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredWorkflows.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <span className="material-icons text-4xl text-gray-400 mb-2">search_off</span>
              <h3 className="text-lg font-medium">No workflows found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4">
                {searchTerm 
                  ? "Try adjusting your search or filter criteria" 
                  : "Get started by creating your first workflow"}
              </p>
              
              {!searchTerm && (
                <Link href="/create" className="inline-block">
                  <Button>Create Workflow</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredWorkflows.map(workflow => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))
        )}
      </div>
    </div>
  );
}

interface WorkflowCardProps {
  workflow: {
    id: number;
    name: string;
    description: string;
    status: string;
    engineType: string;
    createdAt: string;
    runs: number;
    lastRun: string | null;
  };
}

function WorkflowCard({ workflow }: WorkflowCardProps) {
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    draft: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/workflows/${workflow.id}`} className="text-lg font-medium hover:text-primary">
                {workflow.name}
              </Link>
              <Badge className={statusColors[workflow.status] || statusColors.inactive}>
                {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{workflow.description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <span className="material-icons text-sm mr-1">event</span>
                Created: {formatDate(workflow.createdAt)}
              </span>
              <span className="flex items-center">
                <span className="material-icons text-sm mr-1">
                  {workflow.engineType === "n8n" ? "sync_alt" : "integration_instructions"}
                </span>
                {workflow.engineType === "n8n" ? "n8n" : "Make.com"}
              </span>
              <span className="flex items-center">
                <span className="material-icons text-sm mr-1">play_arrow</span>
                {workflow.runs} runs
              </span>
              <span className="flex items-center">
                <span className="material-icons text-sm mr-1">update</span>
                Last run: {formatDate(workflow.lastRun)}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2 self-end sm:self-auto">
            {workflow.status === "active" && (
              <Button size="sm" variant="outline">
                Run Now
              </Button>
            )}
            
            <Link href={`/workflows/${workflow.id}`} className="inline-block">
              <Button size="sm">Edit</Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <span className="material-icons">more_vert</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Export</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 dark:text-red-400">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
