import { GridFSBucket, ObjectId } from "mongodb";
import mongoose from "mongoose";
const bucket = () => new GridFSBucket(mongoose.connection.db, { bucketName: "media" });
export function storeImage(file) { return new Promise((resolve, reject) => { const stream = bucket().openUploadStream(file.originalname, { contentType: file.mimetype }); stream.on("finish", () => resolve(`/api/uploads/${stream.id}`)); stream.on("error", reject); stream.end(file.buffer); }); }
export function streamImage(id, res) { bucket().openDownloadStream(new ObjectId(id)).on("file", (file) => res.type(file.contentType || "application/octet-stream")).on("error", () => res.status(404).end()).pipe(res); }
