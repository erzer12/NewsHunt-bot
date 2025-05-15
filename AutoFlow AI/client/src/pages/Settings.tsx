import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const [activeEngine, setActiveEngine] = useState("n8n");
  
  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-heading">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Configure your automation engines and account settings.
        </p>
      </div>
      
      <Tabs defaultValue="automation-engines">
        <TabsList className="mb-6">
          <TabsTrigger value="automation-engines">Automation Engines</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="automation-engines" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AutomationEngineCard
              name="n8n"
              title="n8n"
              description="Open-source workflow automation"
              url="https://n8n.io"
              isActive={activeEngine === "n8n"}
              onSetActive={() => setActiveEngine("n8n")}
            />
            
            <AutomationEngineCard
              name="make"
              title="Make.com"
              description="Formerly Integromat"
              url="https://make.com"
              isActive={activeEngine === "make"}
              onSetActive={() => setActiveEngine("make")}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Engine Configuration</CardTitle>
              <CardDescription>
                Settings for {activeEngine === "n8n" ? "n8n" : "Make.com"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="engine-url">Base URL</Label>
                <Input
                  id="engine-url"
                  placeholder={activeEngine === "n8n" ? "https://n8n.yourdomain.com" : "https://eu1.make.com"}
                  defaultValue={activeEngine === "n8n" ? "https://n8n.example.com" : ""}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {activeEngine === "n8n" 
                    ? "The URL of your n8n instance" 
                    : "Leave empty to use the default Make.com service"}
                </p>
              </div>
              
              <div>
                <Label htmlFor="engine-api-key">API Key</Label>
                <Input
                  id="engine-api-key"
                  type="password"
                  placeholder="Enter your API key"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="default-engine">Set as Default Engine</Label>
                  <p className="text-xs text-gray-500">New workflows will use this engine</p>
                </div>
                <Switch id="default-engine" defaultChecked={activeEngine === "n8n"} />
              </div>
              
              <div className="pt-2">
                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party API Keys</CardTitle>
              <CardDescription>
                Configure API keys for external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Required for AI workflow generation
                </p>
              </div>
              
              <div>
                <Label htmlFor="hunter-key">Hunter.io API Key</Label>
                <Input
                  id="hunter-key"
                  type="password"
                  placeholder="Enter API key"
                />
              </div>
              
              <div>
                <Label htmlFor="linkedin-key">LinkedIn API Credentials</Label>
                <Input
                  id="linkedin-key"
                  type="password"
                  placeholder="Enter client ID"
                  className="mb-2"
                />
                <Input
                  type="password"
                  placeholder="Enter client secret"
                />
              </div>
              
              <div className="pt-2">
                <Button>Save API Keys</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your profile and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="user-name">Name</Label>
                <Input
                  id="user-name"
                  defaultValue="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  defaultValue="john.doe@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="user-password">Password</Label>
                <Input
                  id="user-password"
                  type="password"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to keep current password
                </p>
              </div>
              
              <div className="pt-2">
                <Button>Update Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Theme</Label>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" className="flex-1">Light</Button>
                  <Button variant="outline" className="flex-1">Dark</Button>
                  <Button className="flex-1">System</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-xs text-gray-500">Use a more dense layout</p>
                </div>
                <Switch id="compact-mode" />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="animations">Interface Animations</Label>
                  <p className="text-xs text-gray-500">Enable motion effects</p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AutomationEngineCardProps {
  name: string;
  title: string;
  description: string;
  url: string;
  isActive: boolean;
  onSetActive: () => void;
}

function AutomationEngineCard({
  name,
  title,
  description,
  url,
  isActive,
  onSetActive
}: AutomationEngineCardProps) {
  return (
    <Card className={isActive ? "border-primary dark:border-primary-light" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="material-icons">{name === "n8n" ? "sync_alt" : "integration_instructions"}</span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">{title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary dark:text-primary-light hover:underline"
              >
                Visit website
              </a>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={`px-2 py-1 text-xs rounded-full ${isActive 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }`}>
              {isActive ? "Active" : "Inactive"}
            </span>
            <Button 
              variant="link" 
              size="sm" 
              className="mt-2"
              onClick={onSetActive}
            >
              {isActive ? "Configure" : "Set Active"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
