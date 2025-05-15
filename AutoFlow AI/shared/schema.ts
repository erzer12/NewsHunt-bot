import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Define table schemas first
export const userRoles = ["user", "admin", "pro"] as const;
export type UserRole = typeof userRoles[number];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  apiKeys: jsonb("api_keys"),
  role: text("role").notNull().default("user"),
  email: text("email"),
  fullName: text("full_name"),
  isActive: boolean("is_active").notNull().default(true),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  prompt: text("prompt"),
  engineType: text("engine_type").notNull().default("n8n"),
  status: text("status").notNull().default("draft"),
  workflowData: jsonb("workflow_data").notNull(),
  mermaidDefinition: text("mermaid_definition"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relationships after all tables are defined
export const usersRelations = relations(users, ({ many }) => ({
  workflows: many(workflows),
}));

export const workflowsRelations = relations(workflows, ({ one }) => ({
  user: one(users, {
    fields: [workflows.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  apiKeys: true,
  isActive: true,
});

export const insertWorkflowSchema = createInsertSchema(workflows).pick({
  userId: true,
  name: true,
  description: true,
  prompt: true,
  engineType: true,
  status: true,
  workflowData: true,
  mermaidDefinition: true,
});

export const updateWorkflowSchema = createInsertSchema(workflows).pick({
  name: true,
  description: true,
  prompt: true,
  engineType: true,
  status: true,
  workflowData: true,
  mermaidDefinition: true,
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  engineType: text("engine_type").notNull(),
  workflowData: jsonb("workflow_data").notNull(),
  mermaidDefinition: text("mermaid_definition"),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  name: true,
  description: true,
  category: true,
  engineType: true,
  workflowData: true,
  mermaidDefinition: true,
  isPublic: true,
});

// Schema for AI workflow generation
export const workflowGenerationSchema = z.object({
  prompt: z.string().min(10),
  engineType: z.enum(["n8n", "make"]).default("n8n"),
});

export const workflowTestSchema = z.object({
  workflowId: z.number(),
  testData: z.record(z.any()).optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type UpdateWorkflow = z.infer<typeof updateWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type WorkflowGeneration = z.infer<typeof workflowGenerationSchema>;
export type WorkflowTest = z.infer<typeof workflowTestSchema>;

// Workflow node types for frontend rendering
export const nodeTypes = [
  "trigger",
  "action",
  "condition",
  "loop",
  "delay",
] as const;

export type NodeType = typeof nodeTypes[number];

export type WorkflowNode = {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
  service?: string;
  icon?: string;
  config?: Record<string, any>;
  position?: { x: number; y: number };
};

export type WorkflowConnection = {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  condition?: string;
};

export type WorkflowDefinition = {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
};

// Engine types
export const engineTypes = ["n8n", "make"] as const;
export type EngineType = typeof engineTypes[number];
