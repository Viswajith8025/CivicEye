import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localUploadsDir = path.join(__dirname, "../uploads");

const bucket = process.env.S3_BUCKET;
const region = process.env.AWS_REGION || "us-east-1";

export function isS3Enabled() {
  return Boolean(bucket && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);
}

function getS3Client() {
  return new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

export function buildProofPath(filename) {
  return `/uploads/${filename}`;
}

export function proofPathToKey(proofPath) {
  return proofPath?.replace(/^\/uploads\//, "") || "";
}

export async function uploadProofFile({ filename, buffer, contentType }) {
  if (!isS3Enabled()) {
    await fs.promises.mkdir(localUploadsDir, { recursive: true });
    const filePath = path.join(localUploadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);
    return buildProofPath(filename);
  }

  const key = `proofs/${filename}`;
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );
  return buildProofPath(filename);
}

export async function getProofReadStream(proofPath) {
  const key = proofPathToKey(proofPath);
  if (!key) return null;

  if (!isS3Enabled()) {
    const filePath = path.join(localUploadsDir, key);
    if (!fs.existsSync(filePath)) return null;
    return { stream: fs.createReadStream(filePath), contentType: null };
  }

  const s3Key = `proofs/${key}`;
  const response = await getS3Client().send(
    new GetObjectCommand({ Bucket: bucket, Key: s3Key })
  );
  return { stream: response.Body, contentType: response.ContentType };
}

export async function getProofSignedUrl(proofPath, expiresIn = 300) {
  if (!isS3Enabled()) return null;
  const key = `proofs/${proofPathToKey(proofPath)}`;
  return getSignedUrl(
    getS3Client(),
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn }
  );
}
