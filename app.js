const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const dotenv = require("dotenv"); // Add dotenv for environment variables

dotenv.config(); // Load environment variables from a .env file

const app = express();

// Middleware to parse JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the API endpoint
app.post("/api/send-email", (req, res) => {
  const { fullName, email, cardType, address } = req.body;

  // Create a transporter object using your email credentials
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MYEMAIL, // Use environment variable for email
      pass: process.env.MYEMAILPASSWORD, // Use environment variable for password
    },
    secure: false, // Set secure to false if you're using a non-secure connection
  });

  // Create an HTML-formatted message with CSS styles
  const htmlMessage = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
          h2 {
            color: #333;
          }
          p {
            margin-bottom: 10px;
          }
          strong {
            color: #007bff;
          }
        </style>
      </head>
      <body>
        <h2>Order Details for ${fullName}</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Card Type:</strong> ${cardType}</p>
        <p><strong>Address:</strong> ${address}</p>
      </body>
    </html>
  `;

  // Set up email data
  const mailOptions = {
    from: process.env.MYEMAIL, // Use environment variable for sender email
    to: "echinedu007@gmail.com",
    subject: "Order Details for " + fullName,
    html: htmlMessage, // Set the email content to the HTML-formatted message
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Error sending email" });
    } else {
      console.log("Email sent: " + info.response);
      res.json({ email: "Email sent successfully" });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
