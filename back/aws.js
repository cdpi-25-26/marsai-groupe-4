import {
  S3Client,
  ListObjectsCommand
 
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
