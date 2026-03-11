// Newsletter.route.js
import express from "express";
import SibApiV3Sdk from "sib-api-v3-sdk";

const router = express.Router();

// 1️⃣ Configurer Brevo
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; 
const contactsApi = new SibApiV3Sdk.ContactsApi();

// 2️⃣ Route POST pour ajouter un email
router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, error: "Email invalide" });
  }

  try {
    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = email;
    createContact.listIds = [2]; // ⚠️ ID de ta liste newsletter dans Brevo

    await contactsApi.createContact(createContact);

    res.json({ success: true, message: "Email ajouté à la newsletter !" });
  } catch (error) {
    if (error.response && error.response.body.code === "duplicate_parameter") {
      return res.json({ success: false, error: "Email déjà inscrit" });
    }
    console.error(error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;