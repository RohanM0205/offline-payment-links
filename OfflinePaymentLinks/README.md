# 💳 Offline Payment Links – Insurance Application

> A secure, streamlined web application that enables call center agents or internal users to generate and share payment links with customers for various insurance scenarios such as Renewal, Rollover, and New Business.

---

## 🚀 Purpose

The **Offline Payment Links** project was built to simplify and secure the payment collection process for insurance policies. It provides:

- A structured web form for collecting customer, policy, and payment details.
- Generation of short, shareable payment URLs.
- Options to send links via Email and/or SMS.
- Auto-renewal handling, including mandatory document uploads when auto-renewal is stopped.
- Real-time feedback and validations for a smooth user experience.

---

## 🔧 Tech Stack

| Technology      | Role                           |
|----------------|--------------------------------|
| ASP.NET Core    | Backend API & Server-side logic |
| Entity Framework | ORM for database interaction   |
| SQL Server      | Database                        |
| React.js / HTML | Frontend rendering              |
| JavaScript (Vanilla) | Client-side interactivity    |
| CSS / SCSS      | Styling & responsive layout     |

---

## 📑 Key Features

### ✅ 1. Pre-Payment Data Collection
- Multi-section form capturing:
  - Customer Info
  - KYC & Policy Info
  - Address, Product, Amount, etc.
- Field-level validation and grouping
- Auto-complete disabled for secure input

### 🔗 2. Short Payment Link Generation
- API generates unique short payment URLs
- Auto-filled from form input
- URL expires after 24 hours

### ✉️ 3. Link Sharing Options
- Choose between Email and SMS (or both)
- Validation to ensure at least one medium is selected
- Modern feedback using toast + shake animation if not selected

### 🔁 4. Auto-Renewal Management
- Toggle between:
  - Auto-Renewal ✅
  - Stop Auto-Renewal ❌
- When stopped:
  - Upload of supporting documents (max 4 files) is mandatory
  - Files are uploaded, zipped, and saved on server with path

### 📁 5. File Upload and Zip
- Files are saved inside an `InvoiceNumber` folder
- Folder is zipped and original removed
- Path stored in the database

---

## 🧪 Validations & Feedback

- Required field checks with inline highlighting
- Custom toast-style notification with shake effect for visibility
- Disabled states and spinners for in-progress operations

---

## 🗃 Database

- **Table**: `PrePaymentData`
- Includes:
  - Full customer & transaction metadata
  - Invoice info, short URL, expiration
  - Uploaded file path if applicable
  - Flags: AutoRenewal (bool), SendEmail (bool), SendSms (bool)

---

## 📁 Folder Structure

OfflinePaymentLinks/
│
├── Controllers/
│ ├── PaymentFormController.cs
│ └── SendPaymentLinkController.cs
│
├── Views/
│ ├── PaymentForm/
│ │ └── Index.cshtml
│ └── SendPaymentLink/
│ └── Index.cshtml
│
├── Models/
│ └── PrePaymentData.cs
│
├── wwwroot/
│ ├── css/
│ ├── js/
│ └── images/
│
├── UploadedFiles/
│ └── {InvoiceNo}.zip
│
└── README.md


---

## 📸 UI Snapshot



---

## 🧰 Setup Instructions

```bash
# Clone the repo
git clone https://github.com/RohanM0205/offline-payment-links.git
cd offline-payment-links

# Open in Visual Studio
# Run DB migrations if applicable (optional)
# Start the application

---

👨‍💻 Author
Rohan More
🔗 GitHub - https://github.com/RohanM0205/offline-payment-links.git
📧 Feel free to reach out for collaboration!

---

📄 License
This project is licensed under the MIT License.