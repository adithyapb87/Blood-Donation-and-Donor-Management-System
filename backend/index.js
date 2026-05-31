var express = require("express");
var cors = require("cors");
var nodemailer = require("nodemailer");
require("./db"); // Database connection file
var donor = require("./model");

var app = express();
app.use(express.json());
app.use(cors());

// API to add a new donor (Register)
app.post("/add", async (req, res) => {
  try {
    await new donor(req.body).save();
    res.send("Donor registered successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving donor record");
  }
});

// API to get all donors (View/Search)
app.get("/view", async (req, res) => {
  try {
    var data = await donor.find();
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching donor records");
  }
});

// API to delete a donor
app.delete("/delete/:id", async (req, res) => {
  try {
    await donor.findByIdAndDelete(req.params.id);
    res.send("Donor record deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting donor record");
  }
});

// Automated Email Request Configured with your updated Gmail App Password
app.post("/send-request-email", async (req, res) => {
  const { email, ename, bloodGroup } = req.body;

  if (!email) {
    return res.status(400).send("Donor email is required");
  }

  // 1. Configure the SMTP Transporter with your updated credentials
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gopikag.info@gmail.com",       // Your Gmail
      pass: "oafb vkic qtxw xujm"            // Your updated 16-character App Password
    }
  });

  // 2. Formulate the official BloodSystem template
  var mailOptions = {
    from: '"Admin, BloodSystem Portal" <gopikag.info@gmail.com>',
    to: email,
    subject: "Urgent: Blood Donation Request - BloodSystem Management System",
    text: `Dear ${ename},

We hope this email finds you well.

There is an urgent requirement for your blood group (${bloodGroup}) at our affiliated hospital. Because you are registered as an eligible donor in our BloodSystem, we are reaching out to ask if you are currently available to donate.

If you are able to assist, please visit the hospital at your earliest convenience or reply to this email to coordinate your arrival. Your contribution can save a life today.

Thank you for your continued support and generosity.

Best regards,
Admin, BloodSystem Management System`
  };

  // 3. Send the message
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Email error: ", error);
      return res.status(500).send("Failed to send email alert");
    } else {
      console.log("Email sent successfully: " + info.response);
      return res.status(200).send("Request email sent successfully!");
    }
  });
});

app.listen(3002, () => {
  console.log("Server running on port 3002");
});