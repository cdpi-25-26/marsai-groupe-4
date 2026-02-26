import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { google } from "googleapis";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import YoutubeToken from "../models/YoutubeTokens.js";
import path from "path"

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

let lastOAuthState = null;


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
    await YoutubeToken.upsert({
      id: 1, 
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
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
  lastOAuthState = state;

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

  if (!state || state !== lastOAuthState) {
    return res.status(400).json({ error: "Invalid state parameter" });
  }

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    await saveTokens(tokens);

    res.redirect("/admin"); 
  } catch (error) {
    console.error("Erreur auth callback:", error);
    res.status(500).send("Erreur lors de l'authentification");
  }
}

async function uploadVideoToYoutubeInternal(filePath, metadata = {}) {
  try {
    const tokens = await loadTokens(); 
    if (!tokens) throw new Error("Aucun token YouTube trouvé. Connectez la chaîne d'abord.");

    oauth2Client.setCredentials(tokens);
    await oauth2Client.getAccessToken(); 

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: metadata.title || "Vidéo sans titre",
          description: metadata.description || "",
          tags: metadata.tags || [],
          categoryId: "22", // People & Blogs
        },
        status: {
          privacyStatus: "private", // ou "public" / "unlisted" si tu veux
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    return {
      success: true,
      videoId: response.data.id,
    };
  } catch (error) {
    console.error("Erreur upload interne YouTube:", error);
    throw error; // laisse l'erreur remonter pour gestion dans createUpload
  }
}

// Configuration du client S3 pour Scaleway
const s3Client = new S3Client({
  region: "fr-par",
  endpoint: "https://s3.fr-par.scw.cloud",
  credentials: {
    accessKeyId: process.env.SCW_ACCESS_KEY,
    secretAccessKey: process.env.SCW_SECRET_KEY ,
  },
});

const BUCKET_NAME = "can";
const BASE_FOLDER = "grp4";

// Fonction qui upload un fichier local vers S3
 async function uploadToS3(localFilePath, subFolder = "videos") {
  try {
    const fileContent = fs.readFileSync(localFilePath);
    const fileName = path.basename(localFilePath);

    // Clé S3 : on garde la même structure que local + prefix grp4
const s3Key = `${BASE_FOLDER}/${subFolder}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: getContentType(fileName),
    });

    await s3Client.send(command);

    console.log(`[S3] Upload OK : ${s3Key}`);
    return s3Key; // retourne "grp4/videos/nom-du-fichier"
  } catch (err) {
    console.error("[S3] Échec :", err);
    throw err;
  }
}



// Détection mime-type basique 
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const types = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.srt': 'text/plain',
  };
  return types[ext] || 'application/octet-stream';
}

async function deleteFileFromS3(s3Key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,  
      Key: s3Key,
    });

    await s3Client.send(command);
    
    console.log(`[S3] Suppression réussie : ${s3Key}`);
    return true;
  } catch (err) {
    console.error(`[S3] Échec suppression de ${s3Key} :`, err.message);
    return false;
  }
} 

export { googleAuth, googleAuthCallback, uploadVideoToYoutubeInternal, loadTokens,uploadToS3,getContentType,deleteFileFromS3 };