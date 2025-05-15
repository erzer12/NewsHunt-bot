import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  users, User, InsertUser, 
  workflows, Workflow, InsertWorkflow, UpdateWorkflow,
  templates, Template, InsertTemplate
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User>;
  updateSubscriptionStatus(userId: number, status: string): Promise<User>;
  
  // Workflow methods
  getWorkflow(id: number): Promise<Workflow | undefined>;
  getWorkflowsByUserId(userId: number): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, workflow: UpdateWorkflow): Promise<Workflow>;
  deleteWorkflow(id: number): Promise<void>;
  
  // Template methods
  getTemplate(id: number): Promise<Template | undefined>;
  listTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: InsertTemplate): Promise<Template>;
  deleteTemplate(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workflows: Map<number, Workflow>;
  private templates: Map<number, Template>;
  private userId: number;
  private workflowId: number;
  private templateId: number;

  constructor() {
    this.users = new Map();
    this.workflows = new Map();
    this.templates = new Map();
    this.userId = 1;
    this.workflowId = 1;
    this.templateId = 1;
    
    // Create some initial template data
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const templateData: InsertTemplate[] = [
      {
        name: "Lead Generation",
        description: "Scrape contacts from company websites and add to CRM.",
        category: "Lead Generation",
        engineType: "n8n",
        workflowData: {
          nodes: [
            {
              id: "trigger1",
              type: "trigger",
              name: "Website Scraper",
              description: "Scrape contact information from target websites",
              service: "http",
              icon: "search"
            },
            {
              id: "action1",
              type: "action",
              name: "Extract Information",
              description: "Extract names, emails, and positions",
              service: "function",
              icon: "transform"
            },
            {
              id: "action2",
              type: "action",
              name: "CRM Integration",
              description: "Add new leads to CRM system",
              service: "salesforce",
              icon: "person_add"
            }
          ],
          connections: [
            {
              id: "conn1",
              sourceId: "trigger1",
              targetId: "action1"
            },
            {
              id: "conn2",
              sourceId: "action1",
              targetId: "action2"
            }
          ]
        },
        mermaidDefinition: "graph TD;\ntrigger1([Website Scraper])-->action1([Extract Information]);\naction1-->action2([CRM Integration]);",
        isPublic: true
      },
      {
        name: "Email Campaign",
        description: "Send personalized emails to contacts based on triggers.",
        category: "Email Campaigns",
        engineType: "n8n",
        workflowData: {
          nodes: [
            {
              id: "trigger1",
              type: "trigger",
              name: "Time Trigger",
              description: "Send emails at scheduled time",
              service: "schedule",
              icon: "schedule"
            },
            {
              id: "action1",
              type: "action",
              name: "Fetch Contacts",
              description: "Get contacts from database",
              service: "database",
              icon: "storage"
            },
            {
              id: "loop1",
              type: "loop",
              name: "Loop Through Contacts",
              description: "Process each contact",
              icon: "loop"
            },
            {
              id: "action2",
              type: "action",
              name: "Send Email",
              description: "Send personalized email",
              service: "email",
              icon: "email"
            }
          ],
          connections: [
            {
              id: "conn1",
              sourceId: "trigger1",
              targetId: "action1"
            },
            {
              id: "conn2",
              sourceId: "action1",
              targetId: "loop1"
            },
            {
              id: "conn3",
              sourceId: "loop1",
              targetId: "action2"
            }
          ]
        },
        mermaidDefinition: "graph TD;\ntrigger1([Time Trigger])-->action1([Fetch Contacts]);\naction1-->loop1([Loop Through Contacts]);\nloop1-->action2([Send Email]);",
        isPublic: true
      },
      {
        name: "Social Media Monitor",
        description: "Track mentions and engage with followers automatically.",
        category: "Social Media",
        engineType: "make",
        workflowData: {
          nodes: [
            {
              id: "trigger1",
              type: "trigger",
              name: "Social Media Webhook",
              description: "Listen for new mentions or comments",
              service: "twitter",
              icon: "public"
            },
            {
              id: "condition1",
              type: "condition",
              name: "Sentiment Analysis",
              description: "Determine if mention is positive or negative",
              service: "ai",
              icon: "psychology"
            },
            {
              id: "action1",
              type: "action",
              name: "Reply Positive",
              description: "Send thank you reply",
              service: "twitter",
              icon: "thumb_up"
            },
            {
              id: "action2",
              type: "action",
              name: "Alert Support",
              description: "Create ticket for negative comments",
              service: "zendesk",
              icon: "support_agent"
            }
          ],
          connections: [
            {
              id: "conn1",
              sourceId: "trigger1",
              targetId: "condition1"
            },
            {
              id: "conn2",
              sourceId: "condition1",
              targetId: "action1",
              label: "Positive"
            },
            {
              id: "conn3",
              sourceId: "condition1",
              targetId: "action2",
              label: "Negative"
            }
          ]
        },
        mermaidDefinition: "graph TD;\ntrigger1([Social Media Webhook])-->condition1{{Sentiment Analysis}};\ncondition1-->|Positive|action1([Reply Positive]);\ncondition1-->|Negative|action2([Alert Support]);",
        isPublic: true
      },
      {
        name: "LinkedIn Lead Generation",
        description: "Automatically connect with new prospects on LinkedIn and send personalized messages",
        category: "Lead Generation",
        engineType: "n8n",
        workflowData: {
          nodes: [
            {
              id: "trigger1",
              type: "trigger",
              name: "LinkedIn Profile Search",
              description: "Search for profiles matching criteria",
              service: "linkedin",
              icon: "person_search"
            },
            {
              id: "action1",
              type: "action",
              name: "Send Connection Request",
              description: "Send connection request with note",
              service: "linkedin",
              icon: "person_add"
            },
            {
              id: "delay1",
              type: "delay",
              name: "Wait for Connection",
              description: "Wait 2 days for connection acceptance",
              icon: "timer"
            },
            {
              id: "condition1",
              type: "condition",
              name: "Check Connection Status",
              description: "Verify if connection was accepted",
              icon: "call_split"
            },
            {
              id: "action2",
              type: "action",
              name: "Send Follow-up Message",
              description: "Send personalized follow-up message",
              service: "linkedin",
              icon: "message"
            }
          ],
          connections: [
            {
              id: "conn1",
              sourceId: "trigger1",
              targetId: "action1"
            },
            {
              id: "conn2",
              sourceId: "action1",
              targetId: "delay1"
            },
            {
              id: "conn3",
              sourceId: "delay1",
              targetId: "condition1"
            },
            {
              id: "conn4",
              sourceId: "condition1",
              targetId: "action2",
              label: "Connected"
            }
          ]
        },
        mermaidDefinition: "graph TD;\ntrigger1([LinkedIn Profile Search])-->action1([Send Connection Request]);\naction1-->delay1([Wait for Connection]);\ndelay1-->condition1{{Check Connection Status}};\ncondition1-->|Connected|action2([Send Follow-up Message]);",
        isPublic: true
      },
      {
        name: "Web Scraping & CRM Update",
        description: "Scrape website data and update CRM records automatically",
        category: "Web Scraping",
        engineType: "n8n",
        workflowData: {
          nodes: [
            {
              id: "trigger1",
              type: "trigger",
              name: "Schedule Trigger",
              description: "Run daily at specified time",
              service: "schedule",
              icon: "schedule"
            },
            {
              id: "action1",
              type: "action",
              name: "Fetch Target URLs",
              description: "Get list of websites to scrape",
              service: "database",
              icon: "list"
            },
            {
              id: "loop1",
              type: "loop",
              name: "Loop Through URLs",
              description: "Process each website",
              icon: "loop"
            },
            {
              id: "action2",
              type: "action",
              name: "Web Scraper",
              description: "Extract data from website",
              service: "http",
              icon: "search"
            },
            {
              id: "action3",
              type: "action",
              name: "Data Processing",
              description: "Clean and format scraped data",
              service: "function",
              icon: "transform"
            },
            {
              id: "action4",
              type: "action",
              name: "CRM Update",
              description: "Update records in CRM",
              service: "hubspot",
              icon: "update"
            }
          ],
          connections: [
            {
              id: "conn1",
              sourceId: "trigger1",
              targetId: "action1"
            },
            {
              id: "conn2",
              sourceId: "action1",
              targetId: "loop1"
            },
            {
              id: "conn3",
              sourceId: "loop1",
              targetId: "action2"
            },
            {
              id: "conn4",
              sourceId: "action2",
              targetId: "action3"
            },
            {
              id: "conn5",
              sourceId: "action3",
              targetId: "action4"
            }
          ]
        },
        mermaidDefinition: "graph TD;\ntrigger1([Schedule Trigger])-->action1([Fetch Target URLs]);\naction1-->loop1([Loop Through URLs]);\nloop1-->action2([Web Scraper]);\naction2-->action3([Data Processing]);\naction3-->action4([CRM Update]);",
        isPublic: true
      },
      {
        name: "Email Response Automation",
        description: "Monitor inbox and send automated responses based on content",
        category: "Email Campaigns",
        engineType: "make",
        workflowData: {
          nodes: [
            {
              id: "trigger1",
              type: "trigger",
              name: "Email Monitor",
              description: "Check for new emails",
              service: "email",
              icon: "email"
            },
            {
              id: "action1",
              type: "action",
              name: "Extract Content",
              description: "Parse email subject and body",
              service: "tools",
              icon: "text_format"
            },
            {
              id: "action2",
              type: "action",
              name: "Categorize Email",
              description: "Analyze content and categorize",
              service: "ai",
              icon: "category"
            },
            {
              id: "condition1",
              type: "condition",
              name: "Route by Category",
              description: "Direct to appropriate response handler",
              icon: "call_split"
            },
            {
              id: "action3",
              type: "action",
              name: "Send Support Response",
              description: "Reply with support information",
              service: "email",
              icon: "support"
            },
            {
              id: "action4",
              type: "action",
              name: "Send Sales Response",
              description: "Reply with sales information",
              service: "email",
              icon: "sell"
            },
            {
              id: "action5",
              type: "action",
              name: "Create Task",
              description: "Create follow-up task in task manager",
              service: "asana",
              icon: "task"
            }
          ],
          connections: [
            {
              id: "conn1",
              sourceId: "trigger1",
              targetId: "action1"
            },
            {
              id: "conn2",
              sourceId: "action1",
              targetId: "action2"
            },
            {
              id: "conn3",
              sourceId: "action2",
              targetId: "condition1"
            },
            {
              id: "conn4",
              sourceId: "condition1",
              targetId: "action3",
              label: "Support"
            },
            {
              id: "conn5",
              sourceId: "condition1",
              targetId: "action4",
              label: "Sales"
            },
            {
              id: "conn6",
              sourceId: "action3",
              targetId: "action5"
            },
            {
              id: "conn7",
              sourceId: "action4",
              targetId: "action5"
            }
          ]
        },
        mermaidDefinition: "graph TD;\ntrigger1([Email Monitor])-->action1([Extract Content]);\naction1-->action2([Categorize Email]);\naction2-->condition1{{Route by Category}};\ncondition1-->|Support|action3([Send Support Response]);\ncondition1-->|Sales|action4([Send Sales Response]);\naction3-->action5([Create Task]);\naction4-->action5;",
        isPublic: true
      }
    ];
    
    // Add templates to storage
    templateData.forEach(template => {
      this.createTemplate(template);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    
    // Create a properly typed user object
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      apiKeys: insertUser.apiKeys || null,
      role: insertUser.role || "user",
      email: insertUser.email || null,
      fullName: insertUser.fullName || null,
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: null,
      createdAt: new Date()
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUserStripeInfo(userId: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      stripeCustomerId: stripeInfo.stripeCustomerId,
      stripeSubscriptionId: stripeInfo.stripeSubscriptionId,
      subscriptionStatus: 'active',
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateSubscriptionStatus(userId: number, status: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      subscriptionStatus: status,
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Workflow methods
  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }

  async getWorkflowsByUserId(userId: number): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).filter(
      (workflow) => workflow.userId === userId
    );
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const id = this.workflowId++;
    const createdAt = new Date();
    const updatedAt = createdAt;
    const workflow: Workflow = { 
      ...insertWorkflow, 
      id, 
      createdAt, 
      updatedAt,
      userId: insertWorkflow.userId || null,
      description: insertWorkflow.description || null,
      prompt: insertWorkflow.prompt || null,
      engineType: insertWorkflow.engineType || "n8n",
      status: insertWorkflow.status || "draft",
      mermaidDefinition: insertWorkflow.mermaidDefinition || null
    };
    this.workflows.set(id, workflow);
    return workflow;
  }

  async updateWorkflow(id: number, updateData: UpdateWorkflow): Promise<Workflow> {
    const workflow = this.workflows.get(id);
    if (!workflow) {
      throw new Error(`Workflow with ID ${id} not found`);
    }

    const updatedWorkflow: Workflow = {
      ...workflow,
      ...updateData,
      updatedAt: new Date()
    };
    this.workflows.set(id, updatedWorkflow);
    return updatedWorkflow;
  }

  async deleteWorkflow(id: number): Promise<void> {
    this.workflows.delete(id);
  }

  // Template methods
  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async listTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.templateId++;
    const createdAt = new Date();
    const template: Template = { 
      ...insertTemplate, 
      id, 
      createdAt,
      description: insertTemplate.description || null,
      mermaidDefinition: insertTemplate.mermaidDefinition || null,
      isPublic: insertTemplate.isPublic ?? true
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: number, updateData: InsertTemplate): Promise<Template> {
    const template = this.templates.get(id);
    if (!template) {
      throw new Error(`Template with ID ${id} not found`);
    }

    const updatedTemplate: Template = {
      ...template,
      ...updateData
    };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<void> {
    this.templates.delete(id);
  }
}

// Database storage implementation using Drizzle ORM
export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize templates if they don't exist
    this.initializeTemplates();
  }
  
  private async initializeTemplates() {
    try {
      // Check if templates exist
      const existingTemplates = await db.select().from(templates).limit(1);
      
      // If no templates, add initial ones
      if (existingTemplates.length === 0) {
        console.log("No templates found, initializing default templates...");
        
        // Get template data from memory storage to maintain consistency
        const memStorage = new MemStorage();
        const templateData = await memStorage.listTemplates();
        
        // Insert all templates
        for (const template of templateData) {
          // Remove the id as it will be auto-generated
          const { id, ...templateWithoutId } = template;
          await db.insert(templates).values(templateWithoutId);
        }
      }
    } catch (error) {
      console.error("Failed to initialize templates:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    // Ensure required fields are set with proper defaults
    const userToInsert = {
      username: insertUser.username,
      password: insertUser.password,
      apiKeys: insertUser.apiKeys || null,
      role: insertUser.role || "user",
      email: insertUser.email || null,
      fullName: insertUser.fullName || null,
      isActive: insertUser.isActive !== undefined ? insertUser.isActive : true,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: null,
      createdAt: new Date()
    };
    
    const [user] = await db.insert(users).values(userToInsert).returning();
    return user;
  }
  
  async updateUserStripeInfo(userId: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: stripeInfo.stripeCustomerId,
        stripeSubscriptionId: stripeInfo.stripeSubscriptionId,
        subscriptionStatus: 'active'
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    return user;
  }
  
  async updateSubscriptionStatus(userId: number, status: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ subscriptionStatus: status })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    return user;
  }
  
  async getWorkflow(id: number): Promise<Workflow | undefined> {
    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    return workflow;
  }
  
  async getWorkflowsByUserId(userId: number): Promise<Workflow[]> {
    return await db.select().from(workflows).where(eq(workflows.userId, userId));
  }
  
  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    // Ensure required fields are set
    const workflowToInsert = {
      ...insertWorkflow,
      userId: insertWorkflow.userId || null,
      description: insertWorkflow.description || null,
      prompt: insertWorkflow.prompt || null,
      engineType: insertWorkflow.engineType || "n8n",
      status: insertWorkflow.status || "draft",
      mermaidDefinition: insertWorkflow.mermaidDefinition || null
    };
    
    const [workflow] = await db.insert(workflows).values(workflowToInsert).returning();
    return workflow;
  }
  
  async updateWorkflow(id: number, updateData: UpdateWorkflow): Promise<Workflow> {
    const [updatedWorkflow] = await db
      .update(workflows)
      .set({
        ...updateData,
        updatedAt: new Date() // Use Date object directly
      })
      .where(eq(workflows.id, id))
      .returning();
    
    if (!updatedWorkflow) {
      throw new Error(`Workflow with id ${id} not found`);
    }
    
    return updatedWorkflow;
  }
  
  async deleteWorkflow(id: number): Promise<void> {
    await db.delete(workflows).where(eq(workflows.id, id));
  }
  
  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }
  
  async listTemplates(): Promise<Template[]> {
    return await db.select().from(templates);
  }
  
  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    // Ensure required fields are set
    const templateToInsert = {
      ...insertTemplate,
      description: insertTemplate.description || null,
      mermaidDefinition: insertTemplate.mermaidDefinition || null,
      isPublic: insertTemplate.isPublic ?? true
    };
    
    const [template] = await db.insert(templates).values(templateToInsert).returning();
    return template;
  }
  
  async updateTemplate(id: number, updateData: InsertTemplate): Promise<Template> {
    const [updatedTemplate] = await db
      .update(templates)
      .set(updateData)
      .where(eq(templates.id, id))
      .returning();
    
    if (!updatedTemplate) {
      throw new Error(`Template with id ${id} not found`);
    }
    
    return updatedTemplate;
  }
  
  async deleteTemplate(id: number): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }
}

// Export an instance of DatabaseStorage to be used throughout the application
export const storage = new DatabaseStorage();
