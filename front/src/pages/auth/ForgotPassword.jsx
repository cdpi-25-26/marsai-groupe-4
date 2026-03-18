import { useState } from "react";
import { Link } from "react-router";
import { Mail, Send, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import instance from "../../api/config";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await instance.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--login-bg-main)] text-[var(--login-text-main)] pt-[154px] pb-[90px] px-6 transition-colors duration-300 min-h-screen">
      <div className="flex flex-col max-w-[500px] mx-auto p-8 sm:p-[56px] items-center uppercase bg-[var(--login-bg-card)] border border-[var(--login-border-main)] rounded-[24px] shadow-[0_0_30px_rgba(173,70,255,0.1)] transition-colors duration-300">

        <Mail className="bg-[var(--login-input-bg)] mb-[24px] border border-[var(--login-border-main)] p-6 w-[96px] h-[96px] rounded-[32px]" />

        <h2 className="text-center text-[36px] sm:text-[48px] mb-[11px] font-bold inline-block bg-[linear-gradient(to_top,rgba(152,16,250,0.6)_35%,rgba(43,127,255,1)_60%)] bg-clip-text text-transparent tracking-[-2.4px]">
          RESET
        </h2>

        <h2 className="text-center text-[10px] mb-[44px] tracking-[3px] text-[var(--login-text-muted)] font-bold">
          Réinitialisation du mot de passe
        </h2>

        {sent ? (
          <div className="w-full text-center">
            <p className="text-green-400 text-[12px] tracking-[1.5px] mb-[32px]">
              ✓ Si cet email existe, un message a été envoyé.
            </p>
            <Link
              to="/auth/login"
              className="flex justify-center items-center gap-[10px] font-bold w-full bg-[var(--login-btn-bg)] text-[var(--login-bg-main)] rounded-[28px] tracking-[2.75px] uppercase text-[11px] h-[56px]"
            >
              <ArrowLeft size={16} />
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="w-full text-[10px] mb-[12px] tracking-[2px]">
              Adresse email
            </h2>

            <div className="flex bg-[var(--login-input-bg)] border border-[var(--login-border-main)] rounded-[28px] w-full mb-[24px]">
              <Mail className="flex items-center mx-[15px] my-auto text-[var(--login-text-muted)] shrink-0" size={18} />
              <input
                type="email"
                placeholder="agent@marsai.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-[76px] outline-none bg-transparent placeholder-[var(--login-text-muted)]"
              />
            </div>

            {error && (
              <p className="text-red-400 text-[11px] tracking-[1px] mb-[16px] text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex justify-center items-center gap-[17px] font-bold w-full bg-[var(--login-btn-bg)] text-[var(--login-bg-main)] rounded-[28px] tracking-[2.75px] uppercase text-[11px] h-[76px] mb-[32px]"
            >
              <Send size={20} />
              {loading ? "Envoi..." : "Envoyer"}
            </button>

            <Link
              to="/auth/login"
              className="flex justify-center items-center gap-[10px] text-[11px] text-[var(--login-text-muted)] tracking-[2px] hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Retour à la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
