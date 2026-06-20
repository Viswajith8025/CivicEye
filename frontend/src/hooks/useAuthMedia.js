import { useEffect, useState } from "react";
import api from "../lib/apiClient";

export function useAuthMedia(proofPath) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(Boolean(proofPath));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!proofPath) {
      setBlobUrl(null);
      setLoading(false);
      return;
    }

    let objectUrl;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(proofPath, { responseType: "blob" });
        if (cancelled) return;
        objectUrl = URL.createObjectURL(res.data);
        setBlobUrl(objectUrl);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [proofPath]);

  return { blobUrl, loading, error };
}
