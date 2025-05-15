import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-gradient-primary">Welcome to AutoFlow AI</h1>
        <p className="text-neutral dark:text-neutral-light mt-2 text-lg max-w-3xl">
          Build and deploy powerful automations without code. Get started by creating a workflow or exploring templates.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="card-gradient border-t-4 border-primary shadow-md hover-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center mb-1">
              <span className="material-icons text-primary mr-2">account_tree</span>
              <CardTitle>Total Workflows</CardTitle>
            </div>
            <CardDescription>All your automation workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">0</p>
          </CardContent>
          <CardFooter>
            <Link href="/workflows" className="w-full">
              <Button variant="outline" className="w-full group">
                View All
                <span className="material-icons text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="card-gradient border-t-4 border-secondary shadow-md hover-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center mb-1">
              <span className="material-icons text-secondary mr-2">play_circle</span>
              <CardTitle>Active Workflows</CardTitle>
            </div>
            <CardDescription>Running in automation engine</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary-light">0</p>
          </CardContent>
          <CardFooter>
            <Link href="/workflows?filter=active" className="w-full">
              <Button variant="outline" className="w-full group">
                View Active
                <span className="material-icons text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="card-gradient border-t-4 border-accent shadow-md hover-lift">
          <CardHeader className="pb-2">
            <div className="flex items-center mb-1">
              <span className="material-icons text-accent mr-2">dashboard_customize</span>
              <CardTitle>Templates</CardTitle>
            </div>
            <CardDescription>Pre-built workflow templates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary">6</p>
          </CardContent>
          <CardFooter>
            <Link href="/templates" className="w-full">
              <Button variant="outline" className="w-full group">
                Browse Templates
                <span className="material-icons text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-2/3 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              <span className="material-icons text-primary mr-2">rocket_launch</span>
              <div>
                <CardTitle>Quick Start</CardTitle>
                <CardDescription>Get started with AutoFlow AI</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-full w-10 h-10 flex items-center justify-center mr-4 shadow-md">
                <span className="material-icons text-white">create</span>
              </div>
              <div>
                <h3 className="font-medium text-lg">Create your first workflow</h3>
                <p className="text-sm text-neutral dark:text-neutral-light mt-1">Describe your automation in plain language or upload a mind map.</p>
                <Link href="/create" className="inline-block mt-2">
                  <Button variant="link" className="px-0 text-primary-dark dark:text-primary-light hover:text-primary hover:underline">
                    Create Workflow
                    <span className="material-icons text-sm ml-1">arrow_forward</span>
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-secondary to-secondary/70 rounded-full w-10 h-10 flex items-center justify-center mr-4 shadow-md">
                <span className="material-icons text-white">settings</span>
              </div>
              <div>
                <h3 className="font-medium text-lg">Connect your automation engine</h3>
                <p className="text-sm text-neutral dark:text-neutral-light mt-1">Connect to n8n, Make.com or another automation platform.</p>
                <Link href="/settings" className="inline-block mt-2">
                  <Button variant="link" className="px-0 text-primary-dark dark:text-primary-light hover:text-primary hover:underline">
                    Configure Settings
                    <span className="material-icons text-sm ml-1">arrow_forward</span>
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-accent to-accent/70 rounded-full w-10 h-10 flex items-center justify-center mr-4 shadow-md">
                <span className="material-icons text-white">folder_copy</span>
              </div>
              <div>
                <h3 className="font-medium text-lg">Try a template</h3>
                <p className="text-sm text-neutral dark:text-neutral-light mt-1">Start with a pre-built workflow template for common tasks.</p>
                <Link href="/templates" className="inline-block mt-2">
                  <Button variant="link" className="px-0 text-primary-dark dark:text-primary-light hover:text-primary hover:underline">
                    Browse Templates
                    <span className="material-icons text-sm ml-1">arrow_forward</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-1/3 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              <span className="material-icons text-secondary mr-2">library_books</span>
              <div>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Helpful documentation and guides</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Link href="/docs/getting-started" className="block p-3 hover:bg-neutral-lightest dark:hover:bg-neutral rounded-md transition-colors group">
              <div className="flex items-center">
                <span className="material-icons text-primary-dark dark:text-primary-light text-sm mr-2">school</span>
                <h4 className="font-medium">Getting Started Guide</h4>
                <span className="material-icons text-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </div>
              <p className="text-sm text-neutral dark:text-neutral-light mt-1 ml-6">Learn the basics of AutoFlow AI</p>
            </Link>
            
            <Link href="/docs/workflow-examples" className="block p-3 hover:bg-neutral-lightest dark:hover:bg-neutral rounded-md transition-colors group">
              <div className="flex items-center">
                <span className="material-icons text-accent text-sm mr-2">science</span>
                <h4 className="font-medium">Workflow Examples</h4>
                <span className="material-icons text-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </div>
              <p className="text-sm text-neutral dark:text-neutral-light mt-1 ml-6">See example workflows and use cases</p>
            </Link>
            
            <Link href="/docs/api-reference" className="block p-3 hover:bg-neutral-lightest dark:hover:bg-neutral rounded-md transition-colors group">
              <div className="flex items-center">
                <span className="material-icons text-secondary text-sm mr-2">code</span>
                <h4 className="font-medium">API Documentation</h4>
                <span className="material-icons text-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </div>
              <p className="text-sm text-neutral dark:text-neutral-light mt-1 ml-6">Technical documentation for developers</p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
