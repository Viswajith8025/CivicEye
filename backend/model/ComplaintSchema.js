import mongoose from "mongoose"
import user from "./UserSchema.js"


const complaintSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    proof: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved", "Rejected"],
        default: "Pending"
    },
    createdAt: {
        type: String,
        required: true
    },
    resolvedAt: {
        type: String,
        required: false
    },
})


const complaint = mongoose.model("complaint", complaintSchema)
export default complaint