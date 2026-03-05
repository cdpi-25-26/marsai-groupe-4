mport { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMe, updateMe } from "../../api/profile";
import { User, Mail, Phone, MapPin, Briefcase, Globe, Save } from "lucide-react";

export default function Profile() {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getMe().then((res) => res.data),
    onSuccess: (data) => setForm(data),
  });

  // sync form when user loads
  if (user && !form.email) {
    setForm(user);
  }

  const mutation = useMutation({
    mutationFn: (data) => updateMe(data),
    onSuccess: () => {
      setEditing(false);
      setSuccess(true);
      refetch();
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-red-400">Please log in to view your profile</div>;
  if (!user) return null;

  const initials = `${(user.first_name || "?")[0]}${(user.last_name || "?")[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-3xl mx-auto">

        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold mb-4">
            {initials}
          </div>
          <h1 className="text-3xl font-bold">{user.first_name} {user.last_name}</h1>
          <p className="text-gray-400 mt-1">{user.role}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/20 text-green-400 text-center">
            Profile updated successfully!
          </div>
        )}

        {/* Info card / Edit form */}
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">
              {editing ? "Edit Profile" : "Profile Information"}
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition text-sm"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
                <Field label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
                <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                <Field label="Mobile" name="mobile" value={form.mobile} onChange={handleChange} />
                <Field label="Birth Date" name="birth_date" value={form.birth_date} onChange={handleChange} type="date" />
                <Field label="Current Job" name="current_job" value={form.current_job} onChange={handleChange} />
              </div>

              <Field label="Biography" name="biography" value={form.biography} onChange={handleChange} textarea />

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Street" name="street" value={form.street} onChange={handleChange} />
                <Field label="Postal Code" name="postal_code" value={form.postal_code} onChange={handleChange} />
                <Field label="City" name="city" value={form.city} onChange={handleChange} />
                <Field label="Country" name="country" value={form.country} onChange={handleChange} />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Portfolio URL" name="portfolio_url" value={form.portfolio_url} onChange={handleChange} />
                <Field label="YouTube URL" name="youtube_url" value={form.youtube_url} onChange={handleChange} />
                <Field label="Instagram URL" name="instagram_url" value={form.instagram_url} onChange={handleChange} />
                <Field label="LinkedIn URL" name="linkedin_url" value={form.linkedin_url} onChange={handleChange} />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:opacity-90 transition"
                >
                  <Save size={18} />
                  {mutation.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setForm(user); }}
                  className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              </div>

              {mutation.isError && (
                <p className="text-red-400 text-sm mt-2">Failed to update profile</p>
              )}
            </form>
          ) : (
            <div className="space-y-6">
              <InfoRow icon={<User size={18} />} label="Name" value={`${user.first_name} ${user.last_name}`} />
              <InfoRow icon={<Mail size={18} />} label="Email" value={user.email} />
              <InfoRow icon={<Phone size={18} />} label="Phone" value={user.phone || user.mobile} />
              <InfoRow icon={<Briefcase size={18} />} label="Job" value={user.current_job} />
              <InfoRow icon={<MapPin size={18} />} label="Location" value={[user.city, user.country].filter(Boolean).join(", ")} />
              {user.biography && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Biography</p>
                  <p className="text-white/80">{user.biography}</p>
                </div>
              )}
              {user.portfolio_url && (
                <InfoRow icon={<Globe size={18} />} label="Portfolio" value={user.portfolio_url} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", textarea = false }) {
  const cls = "w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white";
  return (
    <div className="flex flex-col">
      <label className="text-gray-400 text-xs mb-1">{label}</label>
      {textarea ? (
        <textarea name={name} value={value || ""} onChange={onChange} rows={3} className={cls} />
      ) : (
        <input type={type} name={name} value={value || ""} onChange={onChange} className={cls} />
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-4">
      <div className="text-purple-400">{icon}</div>
      <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-white">{value}</p>
      </div>
    </div>
  );
}
