const User = require("../models/User");
const Request = require("../models/Request");
const sendEmail = require("../services/emailService");

async function sendConfirmationEmail(
  requesterEmail,
  requesterName,
  requestDetails
) {
  const subject = "Request Received ✅";
  const message = `
   <h3>Dear ${requesterName},</h3>

<p>Thank you for submitting your request for a ${requestDetails} at <strong>Tech for Diversity</strong>.</p>

<p>We’ve received your application and our team will review it carefully. If we require any additional information, we’ll be in touch shortly.</p>

<p>We’re committed to bridging the digital divide and helping individuals and families gain access to the technology they need. If your request is approved, we’ll arrange for a refurbished device to be delivered at no cost to you.</p>

<p>We appreciate your patience and will get back to you as soon as possible.</p>

<p>Warm regards,<br>
The Tech for Diversity Team</p>
  `;
  await sendEmail(requesterEmail, subject, message);
  await sendEmail(
    process.env.ADMIN_EMAIL,
    "New Request Received",
    `A new request was received from ${requesterName}. Details: ${requestDetails}`
  );
}
async function createRequest(req, res) {
  try {
    const { user, request } = req.body;

    if (!user) {
      return res.status(400).json({ error: "User details are required!" });
    }

    // Step 1: Check if the user already exists
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      // Step 2: Create a new user
      existingUser = await User.create(user);
    }

    // Step 3: Create a request entry in the Request collection
    const newRequest = await Request.create({
      ...request,
      userId: existingUser._id,
    });

    await sendConfirmationEmail(
      existingUser.email,
      existingUser.firstName + " " + existingUser.lastName,
      request.deviceType
    );

    // Step 5: Respond with success
    res.status(201).json({
      message: "User and request saved successfully!",
      userId: existingUser._id,
      requestId: newRequest._id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate(
      "userId",
      "firstName lastName email phone"
    );
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Failed to retrieve requests." });
  }
};
const updateRequest = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedRequest = await Request.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Failed to update the request." });
  }
};

const deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRequest = await Request.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    res.status(200).json({ message: "Request deleted successfully." });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: "Failed to delete the request." });
  }
};
module.exports = {
  createRequest,
  getAllRequests,
  updateRequest,
  deleteRequest,
};
