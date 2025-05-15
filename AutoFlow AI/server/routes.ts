import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import workflowController from "./controllers/workflowController";
import openaiController from "./controllers/openaiController";
import { setupAuth } from "./auth";
import { createCustomer, createSubscription, mockUpgradeToPro } from "./stripe";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // Middleware to check if user is authenticated
  const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    next();
  };
  
  // API Routes
  
  // Workflow routes - Protected by authentication
  app.get("/api/workflows", checkAuth, workflowController.listWorkflows);
  app.get("/api/workflows/:id", checkAuth, workflowController.getWorkflow);
  app.post("/api/workflows", checkAuth, workflowController.createWorkflow);
  app.put("/api/workflows/:id", checkAuth, workflowController.updateWorkflow);
  app.delete("/api/workflows/:id", checkAuth, workflowController.deleteWorkflow);
  
  // Workflow generation and operations - Protected by authentication
  app.post("/api/workflow/generate", checkAuth, openaiController.generateWorkflow);
  app.post("/api/workflow/process-mindmap", checkAuth, openaiController.processMindMap);
  app.post("/api/workflow/refine", checkAuth, openaiController.refineWorkflow);
  app.post("/api/workflow/deploy", checkAuth, workflowController.deployWorkflow);
  app.post("/api/workflow/test", checkAuth, workflowController.testWorkflow);
  
  // Template routes - Public
  app.get("/api/templates", workflowController.listTemplates);
  app.get("/api/templates/:id", workflowController.getTemplate);
  
  // n8n specific routes - Protected by authentication
  app.post("/api/n8n/deploy", checkAuth, workflowController.deployToN8n);
  app.post("/api/n8n/test", checkAuth, workflowController.testN8nWorkflow);
  app.get("/api/n8n/workflows", checkAuth, workflowController.listN8nWorkflows);
  app.get("/api/n8n/workflows/:id", checkAuth, workflowController.getN8nWorkflow);
  
  // Make.com specific routes - Protected by authentication
  app.post("/api/make/deploy", checkAuth, workflowController.deployToMake);
  app.post("/api/make/test", checkAuth, workflowController.testMakeWorkflow);
  app.get("/api/make/workflows", checkAuth, workflowController.listMakeWorkflows);
  app.get("/api/make/workflows/:id", checkAuth, workflowController.getMakeWorkflow);
  
  // Subscription routes
  app.post("/api/upgrade-to-pro", checkAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const userId = req.user.id;
      
      // If we have Stripe keys, create a real subscription
      if (process.env.STRIPE_SECRET_KEY && req.user.email) {
        // Create a Stripe customer if needed
        if (!req.user.stripeCustomerId) {
          const customer = await createCustomer(
            req.user.email, 
            req.user.fullName || req.user.username
          );
          
          // Update the user with Stripe customer ID
          await storage.updateUserStripeInfo(userId, {
            stripeCustomerId: customer.id,
            stripeSubscriptionId: '',
          });
        }
        
        // Note: In a real production app, you would want to create a subscription
        // with a trial period or handle the payment process properly here
        
        // For this demo, we'll just update the user role directly
        const updatedUser = await storage.updateSubscriptionStatus(userId, 'active');
        
        // Update user to pro role
        await db.update(users)
          .set({ role: 'pro' })
          .where(eq(users.id, userId));
          
        return res.status(200).json({ 
          success: true, 
          message: "Upgraded to Pro successfully!" 
        });
      } else {
        // Use mock upgrade for development without Stripe integration
        await mockUpgradeToPro(userId);
        
        // Update user to pro role directly in DB
        await db.update(users)
          .set({ role: 'pro' })
          .where(eq(users.id, userId));
          
        return res.status(200).json({ 
          success: true, 
          message: "Upgraded to Pro successfully (development mode)" 
        });
      }
    } catch (error: any) {
      console.error("Error upgrading to pro:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
