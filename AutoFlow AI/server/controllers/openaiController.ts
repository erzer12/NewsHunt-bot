import { Request, Response } from "express";
import openaiService from "../services/openaiService";
import { workflowGenerationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Set up multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(import.meta.dirname, "../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = uuidv4();
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    const filetypes = /jpeg|jpg|png|svg|bmp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

// Helper to handle zod validation errors
const validateRequest = (schema: any, data: any) => {
  try {
    return { data: schema.parse(data), error: null };
  } catch (error) {
    if (error instanceof ZodError) {
      return { data: null, error: fromZodError(error).message };
    }
    return { data: null, error: "Invalid request data" };
  }
};

const openaiController = {
  async generateWorkflow(req: Request, res: Response) {
    try {
      const { data, error } = validateRequest(workflowGenerationSchema, req.body);
      if (error) {
        return res.status(400).json({ message: error });
      }

      const result = await openaiService.generateWorkflow(data.prompt, data.engineType);
      return res.json(result);
    } catch (error) {
      console.error("Error generating workflow:", error);
      return res.status(500).json({ message: `Failed to generate workflow: ${(error as Error).message}` });
    }
  },

  processMindMap(req: Request, res: Response) {
    const uploadMiddleware = upload.single("mindmap");
    
    return uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: "No mind map file uploaded" });
      }
      
      try {
        const filePath = req.file.path;
        // Convert mind map to a prompt using OpenAI's vision capabilities
        const result = await openaiService.processMindMap(filePath);
        
        // Clean up the uploaded file
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
        
        return res.json(result);
      } catch (error) {
        console.error("Error processing mind map:", error);
        return res.status(500).json({ message: `Failed to process mind map: ${(error as Error).message}` });
      }
    });
  },

  async refineWorkflow(req: Request, res: Response) {
    try {
      const { workflow, feedback } = req.body;
      
      if (!workflow || !feedback) {
        return res.status(400).json({ message: "Workflow data and feedback are required" });
      }
      
      const result = await openaiService.refineWorkflow(workflow, feedback);
      return res.json(result);
    } catch (error) {
      console.error("Error refining workflow:", error);
      return res.status(500).json({ message: `Failed to refine workflow: ${(error as Error).message}` });
    }
  }
};

export default openaiController;
