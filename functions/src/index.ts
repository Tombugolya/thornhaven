import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import {
  getRaces, getRace, getSubrace,
  getClasses, getClass, getClassSpells, getSpell,
  getSkills, getTrait,
} from "./srd";
import { getSubclassesForClass, getSubclass } from "./enrichment";
import { validateCharacter, calculateDerivedStats } from "./characters";

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://tombugolya.github.io",
  ],
  credentials: true,
}));
app.use(express.json());

// --- Auth Middleware ---
// Verifies Firebase ID token from Authorization header
async function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    (req as express.Request & { uid: string }).uid = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Apply auth to all /api routes
app.use("/api", requireAuth);

// --- SRD Proxy Endpoints ---

app.get("/api/races", async (_req, res) => {
  try {
    const races = await getRaces();
    res.json({ count: races.length, results: races });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch races" });
  }
});

app.get("/api/races/:index", async (req, res) => {
  try {
    const race = await getRace(req.params.index);
    res.json(race);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch race: ${req.params.index}` });
  }
});

app.get("/api/subraces/:index", async (req, res) => {
  try {
    const subrace = await getSubrace(req.params.index);
    res.json(subrace);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch subrace: ${req.params.index}` });
  }
});

app.get("/api/classes", async (_req, res) => {
  try {
    const classes = await getClasses();
    res.json({ count: classes.length, results: classes });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

app.get("/api/classes/:index", async (req, res) => {
  try {
    const classData = await getClass(req.params.index);
    res.json(classData);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch class: ${req.params.index}` });
  }
});

// Enriched subclasses: SRD + custom data merged
app.get("/api/classes/:index/subclasses", async (req, res) => {
  try {
    const enriched = getSubclassesForClass(req.params.index);
    res.json({ count: enriched.length, results: enriched });
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch subclasses for: ${req.params.index}` });
  }
});

app.get("/api/classes/:index/spells", async (req, res) => {
  try {
    const spells = await getClassSpells(req.params.index);
    res.json({ count: spells.length, results: spells });
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch spells for: ${req.params.index}` });
  }
});

app.get("/api/subclasses/:index", async (req, res) => {
  try {
    const subclass = getSubclass(req.params.index);
    if (!subclass) {
      res.status(404).json({ error: `Subclass not found: ${req.params.index}` });
      return;
    }
    res.json(subclass);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch subclass: ${req.params.index}` });
  }
});

app.get("/api/spells/:index", async (req, res) => {
  try {
    const spell = await getSpell(req.params.index);
    res.json(spell);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch spell: ${req.params.index}` });
  }
});

app.get("/api/skills", async (_req, res) => {
  try {
    const skills = await getSkills();
    res.json({ count: skills.length, results: skills });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

app.get("/api/traits/:index", async (req, res) => {
  try {
    const trait = await getTrait(req.params.index);
    res.json(trait);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch trait: ${req.params.index}` });
  }
});

// --- Character Operations ---

app.post("/api/characters/validate", (req, res) => {
  try {
    const result = validateCharacter(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Invalid request body" });
  }
});

app.post("/api/characters/calculate", (req, res) => {
  try {
    const stats = calculateDerivedStats(req.body);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: "Invalid request body" });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", version: "1.0.0" });
});

// Export as Firebase Cloud Function
export const api = onRequest({ cors: true, region: "europe-west1" }, app);
