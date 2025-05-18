Notification Service

Overview

This project implements a Notification Service that allows sending and retrieving notifications for users via multiple channels (Email, SMS, and In-App). The service is integrated with an authentication system supporting OTP-based signup and login, enabling secure user management and notification delivery. Notifications are processed synchronously with a retry mechanism for failed attempts.

Features





API Endpoints:
You can explore and test the API collection in this Postman workspace:  
[Postman Workspace Link](https://web.postman.co/workspace/da93cb16-ddfe-46d8-be8f-)


POST/sendotp:send otp on email to user.

To send otp to the user.
![send OTP API](https://drive.google.com/uc?export=view&id=1o1FTo9qBWVQKOhjgrCLNsIMKkHzcLvKt)
Screenshot of verification mail received with OTP
![verification mail Screenshot](https://drive.google.com/uc?export=view&id=1MtUBIG9K8dmv39ptjTUmmcz1phC0r8gy)




POST/signup:Verify otp and make user create their account

![Signup](https://drive.google.com/uc?export=view&id=1cdlcCGbfIOGzOVjUo2fD6BD6PcvSxQFU)

POST/login:user can Login using email and password.

![Notification Service Image](https://drive.google.com/uc?export=view&id=1hQHrXq4wII8gJ6AamVAcpLkWpOgTYe92)


POST /notifications: Send a notification to a user using 3 channels (Email, SMS, and In-App)

Notification Types:

1.EMAIL
![](https://drive.google.com/uc?export=view&id=1HoHdO0bMV2PG8RjErdW3Sm44qYFNkNFf)

EMAIL SENT

![](https://drive.google.com/uc?export=view&id=19DU62vJp9xMuN1J-X5gIj0jd1ptFphyL)


2.SMS
![](https://drive.google.com/uc?export=view&id=1U9LEjbupk4V_cszBWdR6P_Nhs8ay9z0u)

SMS sent on phone using twilio
![SMS SENT](https://drive.google.com/uc?export=view&id=1BsdzVegYXPldyDc-4JCxgJYf0Qr53WsZ)


3.IN-APP
![](https://drive.google.com/uc?export=view&id=1pA7-vKC27onrKvJbnRcIZ5q_3WDk-tob)



GET /notifications/users/{id}/notifications: Retrieve all notifications for a specific user.

![](https://drive.google.com/uc?export=view&id=1A2tb-ntYOQEoUzboHme34I0HY8LcLM0j)






Authentication:





OTP-based signup and login for secure user access.



Email notifications for OTP delivery during authentication.



Bonus Features:





Retry mechanism for failed notification attempts (up to 3 retries with exponential backoff).



Tech Stack:





Backend: Node.js with Express.js



Database: MongoDB (for storing users and notifications)



Authentication: JWT for session management, Nodemailer for OTP emails



Testing: Jest for unit tests



API Documentation: Postman collection (available in the repository)
[Postman Workspace](https://web.postman.co/workspace/da93cb16-ddfe-46d8-be8f-671e3e2c7d39)

Used twilio for sms notification

Prerequisites





Node.js (v16 or higher)



MongoDB (local or cloud instance, e.g., MongoDB Atlas)



Git



Postman (optional, for testing APIs)



Gmail SMTP or alternative email service (for OTP and email notifications)

Setup Instructions





Clone the Repository:

git clone <## 🔗 GitHub Repository

[Pepsales Backend Assessment](https://github.com/Balmukund02/PepsalesBackendAssesment)>
cd server



Install Dependencies:

npm install
npm i express
npm i mongoose
npm i nodemailer
npm i dotenv



Configure Environment Variables: Create a .env file in the root directory and add the following:

MAIL_HOST = smtp.gmail.com

MAIL_USER = supersharma0207@gmail.com

MAIL_PASS = pqbqhqlbvzaadeuw

JWT_SECRET = "sharma0207"

FOLDER_NAME = "sharmaFolder"

RAZORPAY_KEY = rzp_test_t4LUM04KXw6wHc

RAZORPAY_SECRET = DOdtPrjZRxQej Idj1vAzmOMY

CLOUD_NAME = dan9ajc0c

API_KEY = 249661911393522

API_SECRET =M_ZiqFputn0u2nxjDkE-t_uH1YY

DATABASE_URL=mongodb+srv://22052896:jov0jVW9M82PO03f@cluster0.cmqyuas.mongodb.net/

PORT=4000

TWILIO_ACCOUNT_SID=*******************

TWILIO_AUTH_TOKEN=0ac779f56dbef5a879baf90fa741b43f

TWILIO_PHONE_NUMBER=+1 978 718 3984



Start MongoDB:
## 🖼️ Database Design

You can view the MongoDB schema image here:  
[📂 View Database Image](https://drive.google.com/file/d/1Cq7w_Ae_wGPyVEhmWtvSzALKM2HH)






Ensure MongoDB is running locally or provide a valid MONGODB_URI.



Run the Application:

npm start

The server will start on http://localhost:4000.



Run Tests:

npm test

API Usage
## 🧪 Postman Workspace

You can explore and test the API collection in this Postman workspace:  
[Postman Workspace Link](https://web.postman.co/workspace/da93cb16-ddfe-46d8-be8f-)



Assumptions





Each user is identified by a unique userId (string) generated during signup.



Notification types (email, sms, in-app) are validated before processing.



The recipient field in the notification payload is used for email addresses or phone numbers, depending on the notification type.



Notifications are stored in MongoDB for retrieval and auditing purposes.



Notifications are processed synchronously, with immediate retries for failed attempts.



Failed notifications are retried up to 3 times with exponential backoff (1s, 2s, 4s).



External services (e.g., email or SMS providers) are mocked for SMS and In-App notifications, while email notifications use Nodemailer with Gmail SMTP for OTP and general notifications.



JWT authentication is required for notification-related endpoints to ensure only authorized users can send or retrieve notifications.

## 🗂 Project Structure

```bash
pepsaleassesment/
├── server/
│   ├── config/              # database.js
│   ├── controllers/         # API endpoint logic
│   ├── models/              # MongoDB schemas (User, Notification)
│   ├── routes/              # Route definitions
│   ├── middleware/          # Request validation and JWT authentication
│   ├── utils/               # Contains nodemailer and smssender
│   └── index.js             # Main application entry
│
├── .env.example             # Example environment variables
├── README.md                # This file
└── package.json             # Project dependencies and scripts









Retry Mechanism: Failed notifications are retried synchronously up to 3 times with exponential backoff (1s, 2s, 4s). The retry count is tracked in the notification metadata.



Authentication: OTP-based signup and login ensure secure user access, with email notifications for OTP delivery.

Deployment (Optional)

The application can be deployed to a cloud platform like Heroku or AWS. For this assignment, a deployed instance is not provided, but the code is containerized (Dockerfile included) for easy deployment. To deploy:






Future Improvements





Add a queue-based system (e.g., RabbitMQ) for asynchronous notification processing.



Integrate real SMS providers (e.g., Twilio) for SMS notifications.



Implement rate limiting to prevent abuse.



Add support for customizable notification templates.



Enhance OTP security with expiration and rate limits.

