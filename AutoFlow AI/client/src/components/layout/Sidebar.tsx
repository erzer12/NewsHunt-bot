import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function Sidebar() {
  return (
    <aside className="w-16 md:w-64 bg-background border-r border-border shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-border hidden md:block">
        <h2 className="font-heading text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Workflows</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 md:px-4 space-y-2">
        <Link href="/create" className="flex items-center p-2 md:px-3 md:py-2.5 text-primary-foreground font-medium bg-gradient-to-r from-primary to-primary-light rounded-lg hover:shadow-md transition-shadow duration-200 group">
          <span className="material-icons mr-0 md:mr-3">add_circle</span>
          <span className="hidden md:block">New Workflow</span>
        </Link>
        
        <div className="h-3"></div>
        
        <Link href="/workflows" className="flex items-center p-2 md:px-3 md:py-2 text-foreground hover:bg-muted rounded-md transition-all duration-200 group">
          <span className="material-icons mr-0 md:mr-3 text-primary">folder</span>
          <span className="hidden md:block font-medium">My Workflows</span>
        </Link>
        <Link href="/workflows?filter=recent" className="flex items-center p-2 md:px-3 md:py-2 text-foreground hover:bg-muted rounded-md transition-all duration-200 group">
          <span className="material-icons mr-0 md:mr-3 text-accent">history</span>
          <span className="hidden md:block font-medium">Recent</span>
          <Badge className="ml-auto bg-primary text-primary-foreground hidden md:flex">3</Badge>
        </Link>
        <Link href="/workflows?filter=favorites" className="flex items-center p-2 md:px-3 md:py-2 text-foreground hover:bg-muted rounded-md transition-all duration-200 group">
          <span className="material-icons mr-0 md:mr-3 text-secondary">star</span>
          <span className="hidden md:block font-medium">Favorites</span>
        </Link>
        
        <hr className="my-3 border-border" />
        
        <Link href="/templates" className="flex items-center p-2 md:px-3 md:py-2 text-foreground hover:bg-muted rounded-md transition-all duration-200 group">
          <span className="material-icons mr-0 md:mr-3 text-primary">auto_awesome</span>
          <span className="hidden md:block font-medium">Templates</span>
        </Link>
        
        <Link href="/subscription" className="flex items-center p-2 md:px-3 md:py-2 text-foreground hover:bg-muted rounded-md transition-all duration-200 group">
          <span className="material-icons mr-0 md:mr-3 text-yellow-500">workspace_premium</span>
          <span className="hidden md:block font-medium">Upgrade to Pro</span>
        </Link>
        
        <Link href="/settings" className="flex items-center p-2 md:px-3 md:py-2 text-foreground hover:bg-muted rounded-md transition-all duration-200 group">
          <span className="material-icons mr-0 md:mr-3 text-muted-foreground">settings</span>
          <span className="hidden md:block font-medium">Settings</span>
        </Link>
        
        <hr className="my-3 border-border" />
        
        <div className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:block">
          Recent Workflows
        </div>
        <RecentWorkflowsList />
      </nav>
      
      <div className="p-4 border-t border-border bg-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 relative">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
            </div>
            <span className="hidden md:block text-sm font-medium text-foreground">n8n Connected</span>
          </div>
          <button className="hidden md:block text-sm text-primary hover:text-primary-light transition-colors">
            Switch
          </button>
        </div>
      </div>
    </aside>
  );
}

function RecentWorkflowsList() {
  // This would usually come from an API call or state
  const recentWorkflows = [
    { id: 1, name: "Lead Generation", status: "active" },
    { id: 2, name: "Email Campaign", status: "draft" }
  ];
  
  return (
    <>
      {recentWorkflows.map(workflow => (
        <Link 
          key={workflow.id} 
          href={`/workflows/${workflow.id}`}
          className="flex items-center p-2 md:px-3 md:py-2 text-foreground hover:bg-muted hover:shadow-sm rounded-md transition-all duration-200 group"
        >
          <span className="material-icons mr-0 md:mr-3 text-sm text-muted-foreground">description</span>
          <span className="hidden md:block truncate">{workflow.name}</span>
          {workflow.status === "active" && (
            <span className="hidden md:block w-1.5 h-1.5 ml-auto rounded-full bg-green-500"></span>
          )}
        </Link>
      ))}
    </>
  );
}
