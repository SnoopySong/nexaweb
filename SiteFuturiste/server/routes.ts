import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./supabaseAuth";
import { insertMessageSchema, insertTagSchema, insertTemplateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Verify admin access with secret
  app.post('/api/auth/verify-admin', isAuthenticated, async (req: any, res) => {
    try {
      const { secret } = req.body;
      const correctSecret = "snoopy";
      if (secret === correctSecret) {
        req.session.isAdmin = true;
        res.json({ isAdmin: true });
      } else {
        res.status(403).json({ isAdmin: false });
      }
    } catch (error) {
      console.error("Error verifying admin:", error);
      res.status(500).json({ message: "Failed to verify admin" });
    }
  });

  // Check admin status
  app.get('/api/auth/admin-status', isAuthenticated, async (req: any, res) => {
    res.json({ isAdmin: req.session?.isAdmin || false });
  });

  // Track page views (public)
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const { path } = req.body;
      const userAgent = req.headers["user-agent"];
      const referrer = req.headers["referer"] || req.headers["referrer"];
      await storage.recordPageView(path, userAgent, referrer as string);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error recording page view:", error);
      res.status(500).json({ message: "Failed to record page view" });
    }
  });

  // Get analytics stats (protected - admin only)
  app.get("/api/analytics/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const stats = await storage.getPageViewStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Messages
  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating message:", error);
        res.status(500).json({ message: "Failed to create message" });
      }
    }
  });

  app.get("/api/messages", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.patch("/api/messages/:id/read", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const message = await storage.markMessageAsRead(id);
      if (!message) {
        res.status(404).json({ message: "Message not found" });
        return;
      }
      res.json(message);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  app.delete("/api/messages/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMessage(id);
      if (!deleted) {
        res.status(404).json({ message: "Message not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Message tags
  app.get("/api/messages/:id/tags", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const tags = await storage.getMessageTags(id);
      res.json(tags);
    } catch (error) {
      console.error("Error fetching message tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/messages/:id/tags", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { tagId } = req.body;
      await storage.addTagToMessage(id, tagId);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error("Error adding tag to message:", error);
      res.status(500).json({ message: "Failed to add tag" });
    }
  });

  app.delete("/api/messages/:id/tags/:tagId", isAuthenticated, async (req, res) => {
    try {
      const { id, tagId } = req.params;
      await storage.removeTagFromMessage(id, tagId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing tag from message:", error);
      res.status(500).json({ message: "Failed to remove tag" });
    }
  });

  // Tags CRUD
  app.get("/api/tags", isAuthenticated, async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/tags", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating tag:", error);
        res.status(500).json({ message: "Failed to create tag" });
      }
    }
  });

  app.delete("/api/tags/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTag(id);
      if (!deleted) {
        res.status(404).json({ message: "Tag not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ message: "Failed to delete tag" });
    }
  });

  // Templates CRUD
  app.get("/api/templates", isAuthenticated, async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getTemplate(id);
      if (!template) {
        res.status(404).json({ message: "Template not found" });
        return;
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/templates", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating template:", error);
        res.status(500).json({ message: "Failed to create template" });
      }
    }
  });

  app.patch("/api/templates/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.updateTemplate(id, req.body);
      if (!template) {
        res.status(404).json({ message: "Template not found" });
        return;
      }
      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete("/api/templates/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTemplate(id);
      if (!deleted) {
        res.status(404).json({ message: "Template not found" });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Export messages as CSV
  app.get("/api/messages/export/csv", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getMessages();
      
      const headers = ["ID", "Nom", "Email", "Téléphone", "Type de Projet", "Budget", "Message", "Lu", "Date"];
      const rows = messages.map(m => [
        m.id,
        m.name,
        m.email,
        m.phone || "",
        m.projectType || "",
        m.budget || "",
        `"${(m.message || "").replace(/"/g, '""')}"`,
        m.isRead ? "Oui" : "Non",
        m.createdAt ? new Date(m.createdAt).toISOString() : "",
      ]);

      const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename=messages-${new Date().toISOString().split('T')[0]}.csv`);
      res.send("\uFEFF" + csv); // BOM for Excel UTF-8
    } catch (error) {
      console.error("Error exporting messages:", error);
      res.status(500).json({ message: "Failed to export messages" });
    }
  });

  return httpServer;
}
