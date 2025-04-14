import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { loginUserSchema, registerUserSchema } from "@shared/schema";
import { AnimatedInput } from "@/components/ui/animated-input";
import { AnimatedButton } from "@/components/ui/animated-button";

const LoginSchema = loginUserSchema;

// Create a registration schema
const RegisterSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  fullName: z.string().optional(),
  terms: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { user } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl">
          {/* Auth Forms */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {authMode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {authMode === "login" 
                  ? "Sign in to access your dashboard and manage your projects." 
                  : "Fill out the form below to get started with your account."}
              </p>
            </div>
            
            {authMode === "login" ? <LoginForm /> : <RegisterForm />}
            
            <div className="mt-6 text-center">
              {authMode === "login" ? (
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setAuthMode("register")}
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    Register now
                  </button>
                </p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
          
          {/* Hero Section */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-white">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-6">Your Customizable Website Template</h2>
                <p className="text-xl mb-8">
                  A powerful, flexible foundation for your next web project with comprehensive customization options.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Beautiful, responsive design</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Easily customizable components</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Authentication system included</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Dark mode support</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto">
                <p className="text-sm text-white/80">
                  © {new Date().getFullYear()} Your Company. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginForm() {
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });
  
  const onSubmit = async (data: any) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate("/");
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Login error:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="animate-fadeIn" style={{ animationDelay: '0ms' }}>
        <AnimatedInput
          id="username"
          type="text"
          label="Username"
          error={form.formState.errors.username?.message}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          {...form.register("username")}
        />
      </div>
      
      <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <AnimatedInput
          id="password"
          type="password"
          label="Password"
          error={form.formState.errors.password?.message}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          {...form.register("password")}
        />
      </div>
      
      <div className="flex items-center justify-between animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all hover:scale-110"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>
        
        <div className="text-sm">
          <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline transition-all hover:text-primary-700 dark:hover:text-primary-300">
            Forgot password?
          </a>
        </div>
      </div>
      
      <div className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
        <AnimatedButton
          type="submit"
          className="w-full py-2.5"
          disabled={loginMutation.isPending}
          loading={loginMutation.isPending}
          variant="gradient"
          size="lg"
        >
          Sign in
        </AnimatedButton>
      </div>
      
      {/* Demo credentials hint */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
        <p>Demo credentials: username: <span className="font-semibold">demo</span>, password: <span className="font-semibold">demo123</span></p>
      </div>
    </form>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      terms: false
    }
  });
  
  const onSubmit = async (data: any) => {
    try {
      await registerMutation.mutateAsync(data);
      navigate("/");
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Registration error:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="animate-fadeIn" style={{ animationDelay: '0ms' }}>
        <AnimatedInput
          id="fullName"
          type="text"
          label="Full Name"
          error={form.formState.errors.fullName?.message}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          {...form.register("fullName")}
        />
      </div>
      
      <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <AnimatedInput
          id="username"
          type="text"
          label="Username"
          error={form.formState.errors.username?.message}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          {...form.register("username")}
        />
      </div>
      
      <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
        <AnimatedInput
          id="email"
          type="email"
          label="Email Address"
          error={form.formState.errors.email?.message}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          {...form.register("email")}
        />
      </div>
      
      <div className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
        <AnimatedInput
          id="password"
          type="password"
          label="Password"
          error={form.formState.errors.password?.message}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          {...form.register("password")}
        />
      </div>
      
      <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <AnimatedInput
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          error={form.formState.errors.confirmPassword?.message}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          {...form.register("confirmPassword")}
        />
      </div>
      
      <div className="flex items-center mt-6 animate-fadeIn" style={{ animationDelay: '500ms' }}>
        <input
          id="terms"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all hover:scale-110"
          {...form.register("terms")}
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          I agree to the <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline transition-all hover:text-primary-700 dark:hover:text-primary-300">Terms of Service</a> and <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline transition-all hover:text-primary-700 dark:hover:text-primary-300">Privacy Policy</a>
        </label>
      </div>
      
      <div className="animate-fadeIn" style={{ animationDelay: '600ms' }}>
        <AnimatedButton
          type="submit"
          className="w-full py-2.5 mt-4"
          disabled={registerMutation.isPending}
          loading={registerMutation.isPending}
          variant="gradient"
          size="lg"
        >
          Create Account
        </AnimatedButton>
      </div>
    </form>
  );
}