import Department from "../model/DepartmentSchema.js";

export async function listDepartments(_req, res) {
  try {
    const departments = await Department.find().sort({ name: 1 });
    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function listActiveDepartments(_req, res) {
  try {
    const departments = await Department.find({ isActive: true }).select("name reportTypes").sort({ name: 1 });
    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function createDepartment(req, res) {
  try {
    const { name, description, contactEmail, reportTypes } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });

    const department = await Department.create({
      name: name.trim(),
      description: description?.trim() || "",
      contactEmail: contactEmail?.trim() || "",
      reportTypes: Array.isArray(reportTypes) ? reportTypes : [],
    });

    return res.status(201).json({ message: "Department created", department });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Department name already exists" });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function updateDepartment(req, res) {
  try {
    const { name, description, contactEmail, reportTypes, isActive } = req.body;
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    if (name?.trim()) department.name = name.trim();
    if (description !== undefined) department.description = description;
    if (contactEmail !== undefined) department.contactEmail = contactEmail;
    if (Array.isArray(reportTypes)) department.reportTypes = reportTypes;
    if (isActive !== undefined) department.isActive = isActive;

    await department.save();
    return res.status(200).json({ message: "Department updated", department });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function deactivateDepartment(req, res) {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!department) return res.status(404).json({ message: "Department not found" });
    return res.status(200).json({ message: "Department deactivated", department });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
