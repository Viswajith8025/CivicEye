import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Camera, Loader2, MapPin, Navigation, Upload, AlertTriangle } from "lucide-react";
import api from "../lib/apiClient";
import { SEVERITY_LEVELS } from "../constants/categories";
import { CitizenLayout } from "../components/layout/CitizenLayout";
import { MapPicker } from "../components/map/ReportMap";

const SEVERITY_HINTS = {
  Pothole: "High", "Water Leakage": "High", "Streetlight Failure": "Medium",
  "Waste Dumping": "Medium", "Traffic Violation": "Medium",
};

const DRAFT_KEY = "civiceye-report-draft";

export const CivicEyeRegisterComplaint = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [form, setForm] = useState({
    type: "", severity: "Medium", location: "", description: "", lat: "", lng: "", isAnonymous: false,
  });
  const draftLoaded = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm((f) => ({ ...f, ...parsed, isAnonymous: Boolean(parsed.isAnonymous) }));
        toast.success("Draft restored");
      }
    } catch { /* ignore */ }
    draftLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!draftLoaded.current) return;
    const { type, severity, location, description, lat, lng, isAnonymous } = form;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ type, severity, location, description, lat, lng, isAnonymous }));
  }, [form]);

  const { data: categoryData } = useQuery({
    queryKey: ["report-categories"],
    queryFn: () => api.get("/category").then((r) => r.data),
  });

  const reportCategories = categoryData?.grouped || [];

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: type === "checkbox" ? checked : value };
      if (name === "type" && SEVERITY_HINTS[value]) next.severity = SEVERITY_HINTS[value];
      return next;
    });
  };

  const fetchNearby = (lat, lng) => {
    api.get("/complaint/nearby", { params: { lat, lng, radius: 1 } })
      .then((res) => setNearby(res.data))
      .catch(() => {});
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { toast.error("Max 50MB"); return; }
    setProofFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview({ type: "image", src: ev.target.result });
      reader.readAsDataURL(file);
    } else {
      setPreview({ type: "video", src: URL.createObjectURL(file) });
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) { toast.error("GPS not supported"); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setForm((f) => ({ ...f, lat: lat.toFixed(6), lng: lng.toFixed(6), location: f.location || `Near ${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
        fetchNearby(lat, lng);
        toast.success("Location pinned");
        setLocating(false);
      },
      () => { toast.error("Enable location access"); setLocating(false); },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofFile) { toast.error("Photo/video proof required"); return; }
    if (!form.lat) { toast.error("Pin location on the map or use GPS"); return; }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      data.append("proof", proofFile);
      await api.post("/complaint/register", data);
      localStorage.removeItem(DRAFT_KEY);
      toast.success("Report submitted!");
      navigate("/complaintlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CitizenLayout title="Report an Issue" subtitle="Pin it on the map, add proof, and we'll take it from there">
      <div className="max-w-3xl mx-auto space-y-6">
        {nearby.length > 0 && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 text-sm">
            <AlertTriangle className="text-amber-600 shrink-0" size={18} />
            <div>
              <p className="font-semibold text-amber-800">{nearby.length} similar open report{nearby.length > 1 ? "s" : ""} nearby</p>
              <p className="text-amber-700/80 text-xs mt-0.5">Orange dots on the map show existing reports. You can still submit yours.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="governance-card p-6 sm:p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">What's the problem? *</label>
            <select name="type" value={form.type} onChange={update} className="input-field" required>
              <option value="">Select issue type</option>
              {reportCategories.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((item) => <option key={item} value={item}>{item}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">How urgent? *</label>
            <div className="grid grid-cols-4 gap-2">
              {SEVERITY_LEVELS.map((s) => (
                <button key={s} type="button" onClick={() => setForm({ ...form, severity: s })}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${form.severity === s ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pin on map *</label>
            <MapPicker
              lat={form.lat ? parseFloat(form.lat) : null}
              lng={form.lng ? parseFloat(form.lng) : null}
              nearby={nearby}
              onLocationChange={(lat, lng) => {
                setForm((f) => ({ ...f, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
                fetchNearby(lat, lng);
              }}
              height="280px"
            />
            <div className="flex gap-2 mt-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input name="location" value={form.location} onChange={update} className="input-field pl-10" placeholder="Street, landmark, area" required />
              </div>
              <button type="button" onClick={useMyLocation} disabled={locating} className="btn-secondary !px-4 shrink-0">
                {locating ? <Loader2 className="animate-spin" size={18} /> : <Navigation size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Describe the issue *</label>
            <textarea name="description" value={form.description} onChange={update} rows={4} className="input-field resize-none" placeholder="When did you notice it? How bad is it?" required />
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
            <input type="checkbox" name="isAnonymous" checked={form.isAnonymous} onChange={update} className="mt-1" />
            <div>
              <p className="text-sm font-medium">Report anonymously</p>
              <p className="text-xs text-slate-500">Your name won&apos;t appear in the community feed. Officials still see your identity.</p>
            </div>
          </label>

          <div>
            <label className="block text-sm font-medium mb-2">Photo / video proof *</label>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-teal-400 transition-all text-center">
              {preview ? (
                preview.type === "image"
                  ? <img src={preview.src} alt="" className="max-h-40 mx-auto rounded-xl" />
                  : <video src={preview.src} controls className="max-h-40 mx-auto rounded-xl" />
              ) : (
                <div className="text-slate-500 flex flex-col items-center gap-2"><Upload size={28} /><span className="text-sm">Tap to upload</span></div>
              )}
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <><Loader2 className="animate-spin" size={18} /> Submitting...</> : <><Camera size={18} /> Submit Report</>}
          </button>
        </form>
      </div>
    </CitizenLayout>
  );
};
