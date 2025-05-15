import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

// Sample template categories and data
const templateCategories = [
  "All",
  "Lead Generation",
  "Email Campaigns",
  "Social Media",
  "CRM Integration",
  "Data Processing",
];

const templates = [
  {
    id: 1,
    name: "Lead Generation",
    description: "Scrape contacts from company websites and add to CRM.",
    category: "Lead Generation",
    icon: "people",
    color: "blue"
  },
  {
    id: 2,
    name: "Email Campaign",
    description: "Send personalized emails to contacts based on triggers.",
    category: "Email Campaigns",
    icon: "mail",
    color: "purple"
  },
  {
    id: 3,
    name: "Data Dashboard",
    description: "Collect data and generate reports automatically.",
    category: "Data Processing",
    icon: "dashboard",
    color: "green"
  },
  {
    id: 4,
    name: "Social Media Monitor",
    description: "Track mentions and engage with followers automatically.",
    category: "Social Media",
    icon: "public",
    color: "red"
  },
  {
    id: 5,
    name: "CRM Sync",
    description: "Keep your CRM data in sync across multiple platforms.",
    category: "CRM Integration",
    icon: "sync",
    color: "yellow"
  },
  {
    id: 6,
    name: "Event Registration",
    description: "Automate event registrations and follow-ups.",
    category: "Email Campaigns",
    icon: "event",
    color: "indigo"
  }
];

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [, navigate] = useLocation();

  const filteredTemplates = templates.filter(template => 
    (selectedCategory === "All" || template.category === selectedCategory) &&
    (searchTerm === "" || template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     template.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUseTemplate = (templateId: number) => {
    // In a real app, this would load the template data
    navigate(`/create?template=${templateId}`);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-heading">Workflow Templates</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Start with a pre-built template to create your workflow faster.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-light bg-white dark:bg-neutral-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <span className="material-icons text-lg">search</span>
          </span>
        </div>
      </div>
      
      <div className="mb-6 overflow-x-auto">
        <div className="inline-flex space-x-2 pb-2">
          {templateCategories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onUse={() => handleUseTemplate(template.id)}
          />
        ))}
        
        {filteredTemplates.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <span className="material-icons text-4xl text-gray-400 mb-2">search_off</span>
            <h3 className="text-lg font-medium">No templates found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: {
    id: number;
    name: string;
    description: string;
    category: string;
    icon: string;
    color: string;
  };
  onUse: () => void;
}

function TemplateCard({ template, onUse }: TemplateCardProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-500",
    green: "bg-green-50 dark:bg-green-900/20 text-green-500",
    red: "bg-red-50 dark:bg-red-900/20 text-red-500",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500"
  };
  
  const colorClass = colorMap[template.color] || colorMap.blue;
  
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-32 p-4 flex items-center justify-center ${colorClass}`}>
        <span className="material-icons text-5xl">{template.icon}</span>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium">{template.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
            {template.category}
          </span>
          <Button size="sm" onClick={onUse}>Use Template</Button>
        </div>
      </CardContent>
    </Card>
  );
}
