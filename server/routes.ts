import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Create order
  const createOrderBodySchema = z.object({
    order: insertOrderSchema,
    items: z.array(z.object({
      productId: z.number(),
      productName: z.string(),
      productStrength: z.string(),
      quantity: z.number(),
      pricePerUnit: z.string(),
      totalPrice: z.string(),
    })),
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const body = createOrderBodySchema.parse(req.body);
      const order = await storage.createOrder(body.order, body.items);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // BIN Lookup for card type and bank
  app.post("/api/bin-lookup", async (req, res) => {
    try {
      const { bin } = req.body;
      
      if (!bin || bin.length < 6) {
        return res.status(400).json({ error: "BIN must be at least 6 digits" });
      }
      
      const apiKey = process.env.RAPIDAPI_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "API key not configured" });
      }
      
      const response = await fetch(`https://bin-ip-checker.p.rapidapi.com/?bin=${bin.slice(0, 6)}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'bin-ip-checker.p.rapidapi.com'
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to lookup BIN" });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error looking up BIN:", error);
      res.status(500).json({ error: "Failed to lookup BIN" });
    }
  });

  // Get order
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      const items = await storage.getOrderItems(id);
      res.json({ ...order, items });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  return httpServer;
}
