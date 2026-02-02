import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to, subject, html) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM || "noreply@marsai-festival.com",
    to,
    subject,
    html,
  });
}

export async function sendRegistrationEmail(user) {
  const html = `
    <h1>Bienvenue sur MARS'AI Festival, ${user.first_name} !</h1>
    <p>Votre compte a été créé avec succès.</p>
    <p>Vous pouvez dès maintenant soumettre vos films sur notre plateforme.</p>
    <p>À bientôt,<br>L'équipe MARS'AI Festival</p>
  `;
  return sendEmail(user.email, "Bienvenue sur MARS'AI Festival", html);
}

export async function sendFilmSubmissionEmail(user, film) {
  const html = `
    <h1>Film soumis avec succès</h1>
    <p>Bonjour ${user.first_name},</p>
    <p>Votre film <strong>${film.title}</strong> a bien été soumis et est en cours d'examen.</p>
    <p>Vous recevrez une notification lorsque son statut sera mis à jour.</p>
    <p>À bientôt,<br>L'équipe MARS'AI Festival</p>
  `;
  return sendEmail(user.email, `Film soumis : ${film.title}`, html);
}

const STATUS_LABELS = {
  pending: "En attente",
  under_review: "En cours d'examen",
  selected: "Sélectionné",
  finalist: "Finaliste",
  rejected: "Refusé",
};

export async function sendFilmStatusEmail(user, film, newStatus) {
  const label = STATUS_LABELS[newStatus] || newStatus;
  const html = `
    <h1>Mise à jour du statut de votre film</h1>
    <p>Bonjour ${user.first_name},</p>
    <p>Le statut de votre film <strong>${film.title}</strong> a été mis à jour :</p>
    <p style="font-size: 1.2em; font-weight: bold;">${label}</p>
    <p>À bientôt,<br>L'équipe MARS'AI Festival</p>
  `;
  return sendEmail(user.email, `Mise à jour : ${film.title} — ${label}`, html);
}
