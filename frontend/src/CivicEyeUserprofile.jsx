import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Award, Download, Loader2, Pencil, Save, Trash2, X, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "./lib/apiClient";
import { CitizenLayout } from "./components/layout/CitizenLayout";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

export const CivicEyeUserprofile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", mobile: "", email: "", dob: "", state: "", address: "", idProofType: "", idProofNumber: "",
  });
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get("/user/profile")
      .then((res) => {
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          mobile: res.data.mobile || "",
          email: res.data.email || "",
          dob: res.data.dob ? res.data.dob.split("T")[0] : "",
          state: res.data.state || "",
          address: res.data.address || "",
          idProofType: res.data.idProofType || "",
          idProofNumber: res.data.idProofNumber || "",
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/user/profile/update", form);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get("/user/export", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "civiceye-my-data.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Data exported");
    } catch (err) {
      toast.error(err.response?.data?.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm("Deactivate your account? You can contact support within 30 days to restore.")) return;
    setDeleting(true);
    try {
      await api.post("/user/request-deletion");
      toast.success("Account deactivation requested");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
      setDeleting(false);
    }
  };

  if (loading) {
    return <CitizenLayout title="Profile"><LoadingSpinner /></CitizenLayout>;
  }

  const fields = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "mobile", label: "Mobile", type: "tel" },
    { name: "email", label: "Email", type: "email" },
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "state", label: "State", type: "text" },
    { name: "idProofType", label: "ID Proof Type", type: "text" },
    { name: "idProofNumber", label: "ID Proof Number", type: "text" },
  ];

  return (
    <CitizenLayout title="Profile" subtitle="Manage your account and identity">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="governance-card p-6 bg-gradient-to-br from-primary/10 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold">
              {form.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold">{form.name}</h2>
              <p className="text-sm text-slate-500">{form.email}</p>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-600"><Zap size={14} />{user?.points || 0} pts</span>
                <span className="text-sm text-slate-500">{user?.reports || 0} reports</span>
              </div>
            </div>
          </div>
          {user?.achievements?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {user.achievements.map((a) => (
                <span key={a.id} className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                  <Award size={12} />{a.title}
                </span>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="governance-card p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Personal Information</h3>
            {!editing ? (
              <button type="button" onClick={() => setEditing(true)} className="btn-secondary !py-2 !px-4 text-xs">
                <Pencil size={14} /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary !py-2 !px-4 text-xs"><X size={14} /> Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary !py-2 !px-4 text-xs">
                  {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Save
                </button>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium mb-1.5">{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={update} disabled={!editing} className="input-field disabled:opacity-60" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Address</label>
              <textarea name="address" value={form.address} onChange={update} disabled={!editing} rows={3} className="input-field resize-none disabled:opacity-60" />
            </div>
          </div>
        </form>

        <div className="governance-card p-6 space-y-4">
          <h3 className="font-semibold">Privacy & data</h3>
          <p className="text-sm text-slate-500">Download a copy of your data or request account deactivation.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleExport} disabled={exporting} className="btn-secondary !py-2 !px-4 text-sm flex items-center gap-2">
              {exporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />} Export my data
            </button>
            <button type="button" onClick={handleDeleteRequest} disabled={deleting} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:underline">
              {deleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />} Request account deletion
            </button>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
};
