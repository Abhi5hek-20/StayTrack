import Complaint from "../../models/user/complaint.model.js";
import User from "../../models/user/user.model.js";

// Get all complaints for admin dashboard
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .populate('user', 'fullName email roomNo')
      .sort({ createdAt: -1 }); // Most recent first

    // Transform data to match frontend format
    const transformedComplaints = complaints.map(complaint => ({
      id: complaint._id,
      title: complaint.complaint.substring(0, 50) + (complaint.complaint.length > 50 ? '...' : ''),
      description: complaint.complaint,
      status: complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1), // Capitalize first letter
      studentName: complaint.user.fullName,
      roomNumber: complaint.user.roomNo.toString(),
      submittedAt: complaint.createdAt,
      updatedAt: complaint.updatedAt
    }));

    res.status(200).json({
      success: true,
      complaints: transformedComplaints
    });
  } catch (error) {
    console.error('Error fetching complaints for admin:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints"
    });
  }
};

// Update complaint status (admin specific)
export const updateComplaintStatusAdmin = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    // Convert frontend status to backend format
    const backendStatus = status.toLowerCase();

    // Validate status
    if (!['pending', 'resolved', 'rejected'].includes(backendStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'pending', 'resolved', or 'rejected'"
      });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status: backendStatus },
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
      complaint: {
        id: updatedComplaint._id,
        title: updatedComplaint.complaint.substring(0, 50) + (updatedComplaint.complaint.length > 50 ? '...' : ''),
        description: updatedComplaint.complaint,
        status: updatedComplaint.status.charAt(0).toUpperCase() + updatedComplaint.status.slice(1),
        studentName: updatedComplaint.user.fullName,
        roomNumber: updatedComplaint.user.roomNo.toString(),
        submittedAt: updatedComplaint.createdAt,
        updatedAt: updatedComplaint.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update complaint status"
    });
  }
};

// Get complaint statistics for admin dashboard
export const getComplaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const totalResolved = await Complaint.countDocuments({ status: 'resolved' });
    const rejected = await Complaint.countDocuments({ status: 'rejected' });

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        resolved: totalResolved, // Now shows cumulative total resolved
        rejected
      }
    });
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaint statistics"
    });
  }
};
