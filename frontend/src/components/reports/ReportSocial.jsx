import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ThumbsUp } from "lucide-react";
import api from "../../lib/apiClient";
import { formatDate } from "../../lib/utils";
import { SeverityBadge, StatusBadge } from "../ui/Badge";

export function CommentSection({ reportId, isOwner }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const load = () => {
    api.get(`/complaint/detail/${reportId}/comments`).then((res) => setComments(res.data)).catch(() => {});
  };

  useEffect(() => { load(); }, [reportId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await api.post(`/complaint/detail/${reportId}/comments`, { text });
      setText("");
      load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="governance-card p-6">
      <h3 className="font-semibold flex items-center gap-2 mb-4">
        <MessageCircle size={18} /> Discussion ({comments.length})
      </h3>
      <form onSubmit={submit} className="flex gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isOwner ? "Add an update or reply..." : "Ask a question or add info..."}
          className="input-field flex-1"
        />
        <button type="submit" disabled={loading} className="btn-primary shrink-0">Post</button>
      </form>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">No comments yet. Be the first to respond.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold shrink-0">
                {c.userId?.name?.charAt(0) || "?"}
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3">
                <div className="flex justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold">{c.userId?.name}</span>
                  <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function UpvoteButton({ reportId, initialCount = 0, initialHasUpvoted = false }) {
  const [count, setCount] = useState(initialCount);
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);

  const toggle = async () => {
    const res = await api.post(`/complaint/${reportId}/upvote`);
    setCount(res.data.upvoteCount);
    setHasUpvoted(res.data.hasUpvoted);
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
        hasUpvoted
          ? "bg-teal-50 border-teal-300 text-teal-700 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-300"
          : "border-slate-200 dark:border-slate-700 text-slate-600 hover:border-teal-300"
      }`}
    >
      <ThumbsUp size={16} className={hasUpvoted ? "fill-current" : ""} />
      {count} {count === 1 ? "Support" : "Supports"}
    </button>
  );
}
