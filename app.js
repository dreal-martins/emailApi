const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.post("/api/send-email", (req, res) => {
  const { fullName, email, cardType, address } = req.body;

  const cardTypes = Array.isArray(cardType) ? cardType : [cardType];

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MYEMAIL,
      pass: process.env.MYEMAILPASSWORD,
    },
    secure: false,
  });

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

  const mailOptions = {
    from: process.env.MYEMAIL,
    to: "alexandermartins123@icloud.com",
    subject: "Order Details for " + fullName,
    html: htmlMessage,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ fullName: "Error sending email" });
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
