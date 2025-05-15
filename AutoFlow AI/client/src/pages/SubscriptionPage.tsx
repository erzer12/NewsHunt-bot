import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const isPro = user?.role === "pro";

  const handleUpgrade = async () => {
    if (!user) return;

    setIsUpgrading(true);
    try {
      // Attempt upgrade through our backend API
      const response = await apiRequest("POST", "/api/upgrade-to-pro", {});
      
      if (response.ok) {
        // Update the user in the cache with the new role
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        
        toast({
          title: "Upgrade Successful",
          description: "You now have access to all premium features!",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upgrade");
      }
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast({
        title: "Upgrade Failed",
        description: error.message || "There was an error upgrading your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <Card className={user?.role === "user" ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Free Plan
              {user?.role === "user" && (
                <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">Current Plan</span>
              )}
            </CardTitle>
            <CardDescription>Basic workflow creation</CardDescription>
            <div className="text-3xl font-bold mt-2">$0 <span className="text-base font-normal">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check size={18} className="text-green-500" />
                <span>Create up to 5 workflows</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={18} className="text-green-500" />
                <span>Basic workflow templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={18} className="text-green-500" />
                <span>Standard support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button disabled className="w-full" variant="outline">
              Current Plan
            </Button>
          </CardFooter>
        </Card>
        
        {/* Pro Plan */}
        <Card className={isPro ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Pro Plan
              {isPro && (
                <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">Current Plan</span>
              )}
            </CardTitle>
            <CardDescription>Advanced automation for professionals</CardDescription>
            <div className="text-3xl font-bold mt-2">$19 <span className="text-base font-normal">/month</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check size={18} className="text-green-500" />
                <span>Unlimited workflows</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={18} className="text-green-500" />
                <span>All premium templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={18} className="text-green-500" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={18} className="text-green-500" />
                <span>Advanced workflow analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={18} className="text-green-500" />
                <span>Team collaboration features</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {isPro ? (
              <Button disabled className="w-full" variant="outline">
                Current Plan
              </Button>
            ) : (
              <Button onClick={handleUpgrade} disabled={isUpgrading} className="w-full">
                {isUpgrading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  "Upgrade to Pro"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Why Upgrade to Pro?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-lg mb-2">Unlimited Workflows</h3>
            <p>Create and deploy as many automated workflows as you need without any restrictions.</p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">Premium Templates</h3>
            <p>Access our library of professional templates to save time and implement best practices.</p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">Advanced Analytics</h3>
            <p>Gain insights into your automation performance with detailed analytics and reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
}