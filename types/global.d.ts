export {};

declare global {
  namespace Express {
    interface User {
      id: number;
      email?: string;
      password?: string;
      // Do I need to add anything else?
    }
  }
}

declare module "express-session" {
  interface SessionData {
    
    passport?: 
      {user?: number;}; // or number, match your serializeUser type
      messages?: string[];
    };
  }
