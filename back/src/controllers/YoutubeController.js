import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { google } from "googleapis";
import YoutubeToken from "../models/YoutubeTokens.js";

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  throw new Error("Missing Google API credentials in environment variables");
}

const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// Store OAuth states with expiration (5 min) to support concurrent users
const pendingOAuthStates = new Map();
const OAUTH_STATE_TTL = 5 * 60 * 1000;

async function loadTokens() {
  try {
    const tokenRecord = await YoutubeToken.findOne();
    if (!tokenRecord) return null;

    return {
      access_token: tokenRecord.access_token,
      refresh_token: tokenRecord.refresh_token,
      scope: tokenRecord.scope,
      token_type: tokenRecord.token_type,
      expiry_date: tokenRecord.expiry_date,
    };
  } catch (err) {
    console.error("Erreur loadTokens:", err);
    return null;
  }
}

async function saveTokens(tokens) {
  try {
    const existing = await YoutubeToken.findOne();
    const refreshToken = tokens.refresh_token || existing?.refresh_token || null;

    await YoutubeToken.upsert({
      id: 1,
      access_token: tokens.access_token,
      refresh_token: refreshToken,
      scope: tokens.scope || null,
      token_type: tokens.token_type || null,
      expiry_date: tokens.expiry_date || null,
    });
  } catch (err) {
    console.error("Erreur saveTokens:", err);
    throw err;
  }
}

async function googleAuth(req, res) {
  const state = crypto.randomBytes(16).toString("hex");
  pendingOAuthStates.set(state, Date.now());

  // Clean up expired states
  for (const [key, timestamp] of pendingOAuthStates) {
    if (Date.now() - timestamp > OAUTH_STATE_TTL) {
      pendingOAuthStates.delete(key);
    }
  }

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });

  res.redirect(url);
}

async function googleAuthCallback(req, res) {
  const { code, state } = req.query;

  if (!state || !pendingOAuthStates.has(state)) {
    return res.status(400).json({ error: "Invalid or expired state parameter" });
  }

  pendingOAuthStates.delete(state);

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    const { tokens } = await oauth2Client.getToken(code);
    await saveTokens(tokens);
    res.redirect(`${frontendUrl}/admin`);
  } catch (error) {
    console.error("Erreur auth callback:", error);
    res.redirect(`${frontendUrl}/admin?youtube_error=auth_failed`);
  }
}

async function uploadVideoToYoutube(req, res) {
  const tokens = await loadTokens();
  if (!tokens) {
    return res.status(401).json({ error: "Authentification Google requise" });
  }

  if (!req.file?.path) {
    return res.status(400).json({ error: "Aucune vidéo uploadée" });
  }

  const filePath = req.file.path;

  try {
    oauth2Client.setCredentials(tokens);
    await oauth2Client.getAccessToken();

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const tags = req.body.tags
      ? req.body.tags.split(",").map(t => t.trim()).filter(Boolean)
      : undefined;

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: req.body.title || "Vidéo sans titre",
          description: req.body.description || "",
          tags,
          categoryId: "22",
        },
        status: {
          privacyStatus: req.body.privacyStatus || "private",
        },
      },
      media: { body: fs.createReadStream(filePath) },
    });

    // Clean up local file after successful upload
    fs.unlink(filePath, (err) => {
      if (err) console.error("Erreur suppression fichier local:", err);
    });

    res.json({
      success: true,
      videoId: response.data.id,
    });
  } catch (error) {
    console.error("Erreur upload YouTube:", error);

    // Clean up local file on error too
    fs.unlink(filePath, () => {});

    res.status(500).json({
      error: "Échec upload YouTube",
      details: error.message || "Erreur inconnue",
    });
  }
}

export { googleAuth, googleAuthCallback, uploadVideoToYoutube, loadTokens };