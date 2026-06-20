import path from "path";
import complaint from "../model/ComplaintSchema.js";
import { getProofReadStream } from "../utilies/storage.js";

export async function serveUpload(req, res) {
  try {
    const filename = path.basename(req.params.filename);
    if (!filename || filename.includes("..")) {
      return res.status(400).json({ message: "Invalid filename" });
    }

    const proofPath = `/uploads/${filename}`;
    const report = await complaint.findOne({ proof: proofPath });
    if (!report) {
      return res.status(404).json({ message: "File not found" });
    }

    const isOwner = report.userId.toString() === req.user.userid;
    const isAdmin = req.user.role === "admin";
    const canViewPublic = report.isPublic !== false;

    if (!isAdmin && !isOwner && !canViewPublic) {
      return res.status(403).json({ message: "You do not have access to this file" });
    }

    const file = await getProofReadStream(proofPath);
    if (!file?.stream) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.contentType) {
      res.setHeader("Content-Type", file.contentType);
    }

    file.stream.pipe(res);
  } catch (error) {
    return res.status(500).json({ message: "Error serving file", error: error.message });
  }
}
