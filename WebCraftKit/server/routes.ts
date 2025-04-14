import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { contactFormSchema } from "@shared/schema";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes and middleware
  setupAuth(app);
  
  // Contact form submission endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      // Validate the request body against the schema
      const validatedData = contactFormSchema.parse(req.body);
      
      // Save the contact message
      await storage.saveContactMessage(validatedData);
      
      return res.status(200).json({ 
        success: true, 
        message: 'Contact form submitted successfully' 
      });
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message || 'Invalid form data' 
      });
    }
  });

  // Add route to check authentication status
  app.get('/api/auth/status', (req, res) => {
    res.json({ 
      isAuthenticated: req.isAuthenticated(),
      user: req.user ? req.user : null
    });
  });

  // Example protected API route
  app.get('/api/dashboard/stats', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // In a real application, you would fetch real data based on the user
    const stats = {
      activeProjects: 3,
      pendingTasks: 7,
      completedTasks: 12,
      recentActivities: [
        {
          type: 'create',
          title: 'New project created',
          timestamp: new Date()
        },
        {
          type: 'complete',
          title: 'Task "Update homepage design" completed',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // yesterday
        }
      ]
    };
    
    return res.json({ 
      success: true, 
      stats 
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
