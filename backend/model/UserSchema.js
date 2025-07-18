import mongoose from "mongoose";
let userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    idProofType: {
        type: String,
        required: false
    },
    idProofNumber: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    reports: {
        type: Number,
        required: true,
        default: 0,
      },
      deletestate: {
        type:Boolean,
        default: false,
      }
})
const user = mongoose.model("user", userschema);
export default user