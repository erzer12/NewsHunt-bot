import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table definition
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Register schema with validation
export const registerUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    email: true,
    fullName: true,
  })
  .extend({
    password: z.string().min(6, "Password must be at least 6 characters"),
    email: z.string().email("Please enter a valid email"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Login schema with validation
export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// User profile schema
export const userProfileSchema = createInsertSchema(users)
  .pick({
    fullName: true,
    email: true,
  })
  .extend({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New passwords do not match",
      path: ["confirmNewPassword"],
    }
  );

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Types
export type InsertUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type User = typeof users.$inferSelect;
