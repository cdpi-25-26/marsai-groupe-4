import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";


// Configuration du client S3 pour Scaleway
const s3Client = new S3Client({
  region: "fr-par",
  endpoint: `https://s3.fr-par.scw.cloud`,
  credentials: {
    accessKeyId: "SCW3MFQBR803FXZS4N33",
    secretAccessKey: "c64db8bf-f541-478d-aa6a-cbcb8c7be2ae",
  },
});

const BUCKET_NAME = "can";
const FOLDER = "grp4";

listFiles() // Juste pour faire la commande node aws.js

// Liste des fichiers dans le dossier "grp3"
async function listFiles() {
  const command = new ListObjectsCommand({
    Bucket: BUCKET_NAME,
    Prefix: FOLDER + "/",
  });
  const response = await s3Client.send(command);
  console.log(response.Contents);
}

// Uploader un fichier dans le dossier "grp3"
async function uploadFile() {
  const fileContent = "Hello, this is a test file!";
  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `${FOLDER}/test-file.txt`,
    Body: fileContent,
  });
  await s3Client.send(uploadCommand);
  console.log("File uploaded successfully!");
}

// Télécharger un fichier depuis le dossier "grp3"
async function downloadFile() {
  const downloadCommand = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `${FOLDER}/test-file.txt`,
  });
  const downloadResponse = await s3Client.send(downloadCommand);
  const downloadedContent = await streamToString(downloadResponse.Body);
  console.log("Downloaded content:", downloadedContent);
}

// Supprimer un fichier du dossier "grp3"
async function deleteFile() {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `${FOLDER}/test-file.txt`,
  });
  await s3Client.send(deleteCommand);
  console.log("File deleted successfully!");
}