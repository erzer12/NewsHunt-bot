import { users, type User, type InsertUser, type ContactForm } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

// Helper functions for password hashing
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Contact form
  saveContactMessage(message: ContactForm): Promise<void>;
  
  // Session storage
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contactMessages: ContactForm[];
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.contactMessages = [];
    this.currentId = 1;
    
    // Create demo user with hashed password 'demo123'
    this.createInitialUser();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  private async createInitialUser() {
    const hashedPassword = await hashPassword("demo123");
    const demoUser: User = {
      id: this.currentId++,
      username: "demo",
      password: hashedPassword,
      email: "demo@example.com",
      fullName: "Demo User",
      role: "user",
      createdAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);
    console.log("Demo user created with username: demo, password: demo123");
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: any): Promise<User> {
    const id = this.currentId++;
    // Remove confirmPassword as it's not part of the User type
    const { confirmPassword, ...userData } = insertUser;
    
    const user: User = { 
      ...userData, 
      id,
      role: "user",
      createdAt: new Date()
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) {
      return undefined;
    }
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async saveContactMessage(message: ContactForm): Promise<void> {
    this.contactMessages.push(message);
    // In a real app, you might send an email or save to a database
    console.log("Contact message received:", message);
  }
}

export const storage = new MemStorage();
