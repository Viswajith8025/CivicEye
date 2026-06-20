import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Send } from "lucide-react";
import api from "./lib/apiClient";
import { CitizenLayout } from "./components/layout/CitizenLayout";

export const CivicEyeFeedback = () => {
  const [description, setDescription] = useState("");

  const mutation = useMutation({
    mutationFn: (text) => api.post("/feedback/add", { description: text }),
    onSuccess: () => {
      toast.success("Feedback submitted — thank you!");
      setDescription("");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Submission failed"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    mutation.mutate(description.trim());
  };

  return (
    <CitizenLayout title="Send Feedback" subtitle="Help us improve CivicEye">
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="governance-card p-6 space-y-4">
          <p className="text-sm text-slate-500">
            Share suggestions, report bugs, or tell us about your experience. Admins review all submissions.
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="What's on your mind?"
            className="input-field resize-none"
            maxLength={3000}
          />
          <button type="submit" disabled={mutation.isPending} className="btn-primary">
            <Send size={16} /> {mutation.isPending ? "Sending..." : "Submit feedback"}
          </button>
        </form>
      </div>
    </CitizenLayout>
  );
};
