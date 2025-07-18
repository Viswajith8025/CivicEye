import mongoose from "mongoose";
import user from "../model/UserSchema.js";
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';



export async function register(req, res) {
  try {
    const { name, email, age, mobile, password } = req.body;

    if (!name || !email || !age || !mobile || !password) {
      return res.status(400).json({ message: "data missing" })

    }

    let existinguser = await user.findOne({ email })

    if (existinguser) {
      return res.status(409).json({ message: "username already exists try another username" })
    }

    const salt = parseInt(process.env.SALT) || 10
    const hashedpassword = await bcrypt.hash(password, salt)

    await user.create({ name, email, age, mobile, password: hashedpassword })
    return res.status(201).json({ message: "user created" })
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "db error", error: error })

  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let users = await user.findOne({ email });
    if (!users) {
      return res.status(400).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, users.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    // Include role in the token
    const token = jwt.sign(
      { userid: users._id, email: users.email, role: users.role },
      process.env.KEY,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      id: users._id,
      role: users.role,
      name: users.name,
    });
  } catch (error) {
    return res.status(500).json({ message: "Database error", error: error });
  }
}

export async function viewuser(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const userRecord = await user.findById(id);

    if (!userRecord) {
      return res.status(404).json({ message: "User Not Found" });
    }

    return res.status(200).json(userRecord);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateuserprofile(req, res) {
  try {
    // Get user ID from auth middleware
    const userId = req.user.userid;

    // Extract fields from request body
    const {
      name,
      mobile,
      email,
      dob,
      state,
      address,
      idProofType,
      idProofNumber
    } = req.body;

    // Find user
    const userRecord = await user.findById(userId);

    if (!userRecord) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) userRecord.name = name;
    if (mobile) userRecord.mobile = mobile;
    if (email) userRecord.email = email;
    if (dob) userRecord.dob = new Date(dob);
    if (state) userRecord.state = state;
    if (address) userRecord.address = address;
    if (idProofType) userRecord.idProofType = idProofType;
    if (idProofNumber) userRecord.idProofNumber = idProofNumber;

    // Save updated user
    const updatedUser = await userRecord.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
}

export async function viewUserProfile(req, res) {
  try {
    // Get user ID from auth middleware
    const userId = req.user.userid;

    // Fetch user details (excluding password)
    const userRecord = await user.findById(userId).select("-password");

    if (!userRecord) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userRecord);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await user.find({ role: { $ne: "admin" } }).select("-password"); // Exclude password field for security
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userDetails = await user.findById(id).select('-password'); // Exclude password
    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Find the user to delete
    const userToDelete = await user.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting admin users
    if (userToDelete.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    // Check if the requesting user is authorized (assuming req.user is set by auth middleware)
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized to delete this user" });
    }

    // Perform soft delete by updating the deletestate field
    const updatedUser = await user.findByIdAndUpdate(
      id,
      { deletestate: true },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to soft delete user" });
    }

    return res.status(200).json({ message: "User soft deleted successfully", userId: id });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}