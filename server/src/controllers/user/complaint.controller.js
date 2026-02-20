import Complaint from "../../models/user/complaint.model.js";
import User from "../../models/user/user.model.js";

// Create a new complaint
export const createComplaint = async (req, res) => {
  try {
    const { complaint } = req.body;
    const userId = req.user._id;

    // Validate complaint text
    if (!complaint || complaint.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Complaint must be at least 10 characters long"
      });
    }

    // Create new complaint
    const newComplaint = await Complaint.create({
      user: userId,
      complaint: complaint.trim(),
      status: 'pending'
    });

    // Populate user details for response
    const populatedComplaint = await Complaint.findById(newComplaint._id)
      .populate('user', 'fullName email roomNo');

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint: populatedComplaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({
      success: false,
      message: "Failed to submit complaint"
    });
  }
};



// Update complaint status (admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'pending', 'resolved', or 'rejected'"
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    ).populate('user', 'fullName email roomNo');

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update complaint status"
    });
  }
};

// Get user's own complaints
export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all complaints for the current user
    const complaints = await Complaint.find({ user: userId })
      .populate('user', 'fullName email roomNo')
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      complaints: complaints
    });
  } catch (error) {
    console.error('Error getting user complaints:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints"
    });
  }
};

// Check complaint status by ID
export const checkComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    res.status(200).json({
      success: true,
      status: complaint.status
    });
  } catch (error) {
    console.error('Error checking complaint status:', error);
    res.status(500).json({
      success: false,
      message: "Failed to check complaint status"
    });
  }
};
