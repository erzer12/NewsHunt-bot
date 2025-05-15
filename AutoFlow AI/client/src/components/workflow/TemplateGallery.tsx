import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Template } from "@shared/schema";

interface TemplateGalleryProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateGallery({ 
  open, 
  onClose, 
  onSelectTemplate 
}: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: templates = [], isLoading, error } = useQuery<Template[]>({
    queryKey: ['/api/templates'],
    enabled: open,
  });

  if (error) {
    toast({
      title: "Failed to load templates",
      description: (error as Error).message,
      variant: "destructive"
    });
  }

  // Get unique categories from templates
  const categories = ["All", ...new Set(templates.map(t => t.category))];

  // Filter templates based on category and search term
  const filteredTemplates = templates.filter(template => 
    (selectedCategory === "All" || template.category === selectedCategory) &&
    (searchTerm === "" || 
     template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     template.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUseTemplate = (template: Template) => {
    onSelectTemplate(template);
    onClose();
  };

  const getIconByCategory = (category: string): string => {
    const categoryIconMap: Record<string, string> = {
      "Lead Generation": "people",
      "Email Campaigns": "mail",
      "Social Media": "public",
      "CRM Integration": "sync",
      "Data Processing": "dashboard",
      "Web Scraping": "search",
    };

    return categoryIconMap[category] || "description";
  };

  const getColorByCategory = (category: string): string => {
    const categoryColorMap: Record<string, string> = {
      "Lead Generation": "blue",
      "Email Campaigns": "purple",
      "Social Media": "red",
      "CRM Integration": "yellow",
      "Data Processing": "green",
      "Web Scraping": "indigo",
    };

    const colorClassMap: Record<string, string> = {
      blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
      purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-500",
      green: "bg-green-50 dark:bg-green-900/20 text-green-500",
      red: "bg-red-50 dark:bg-red-900/20 text-red-500",
      yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500",
      indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500"
    };
    
    const color = categoryColorMap[category] || "blue";
    return colorClassMap[color];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-semibold">Workflow Templates</DialogTitle>
          <DialogDescription>
            Start with a pre-built template to create your workflow faster.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 overflow-y-auto flex-1">
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
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="inline-flex">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="hover:shadow-md transition-shadow overflow-hidden animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
                  <CardContent className="p-4">
                    <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <Card key={template.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  <div className={`h-32 p-4 flex items-center justify-center ${getColorByCategory(template.category)}`}>
                    <span className="material-icons text-5xl">{getIconByCategory(template.category)}</span>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                        {template.category}
                      </span>
                      <Button size="sm" onClick={() => handleUseTemplate(template)}>Use Template</Button>
                    </div>
                  </CardContent>
                </Card>
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
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
