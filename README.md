# 💳 Offline Payment Links – Insurance Application

> A secure, streamlined web application that enables call center agents or internal users to generate and share payment links with customers for various insurance scenarios such as Renewal, Rollover, and New Business.

---

## 🚀 Purpose

The **Offline Payment Links** project was built to simplify and secure the payment collection process for insurance policies. It provides:

- A structured web form for collecting customer, policy, and payment details.
- Generation of short, shareable payment URLs.
- Options to send links via Email and/or SMS.
- Auto-renewal handling, including mandatory document uploads when auto-renewal is stopped.
- Dashboard to monitor and access payment links based on user roles.
- Real-time feedback and validations for a smooth user experience.

---

## 🔐 Dashboard & Role-Based Access

### 🧑‍💼 SuperAdmin & Admin Roles
The application implements **ASP.NET Core Identity**-based role management with the following access control:

| Role        | Access Rights |
|-------------|----------------|
| **SuperAdmin** | Can create new Admins and access the entire system dashboard |
| **Admin**      | Can view payment link logs and access management dashboard |
| **User/CEM**   | Directly redirected to the payment form to generate links |

### 🔧 Dashboard Highlights
- **Dashboard URL**: `/Dashboard/Index`
- Filter/search for existing payment links
- Role-based routing:  
   - `SuperAdmin` → Admin Panel  
   - `Admin` → Payment Link Logs  
   - `User` or `CEM` → Payment Form (skips dashboard)

> Dashboard also displays summary reports and quick actions based on roles.

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
├── Areas/
│   ├── Identity/
│   └── Admin/
│       ├── Controllers/
│       │   ├── AdminController.cs
│       │   ├── DashboardController.cs
│       │   └── RoleController.cs
│       └── Views/
│           ├── Dashboard/
│           │   ├── AccessRequests.cshtml
│           │   ├── AddAdmin.cshtml
│           │   ├── AdminAdded.cshtml
│           │   ├── CreateRole.cshtml
│           │   └── ViewUsers.cshtml
│           └── Shared/
│
├── Controllers/
│   ├── HomeController.cs
│   ├── PaymentFormController.cs
│   └── SendPaymentLinkController.cs
│
├── Data/
│   ├── Migrations/
│   └── ApplicationDbContext.cs
│
├── Helpers/
│   ├── ShortCodeGenerator.cs
│   └── PaymentUtilityService.cs
│
├── Models/
│   ├── AddAdminViewModel.cs
│   ├── ApplicationUser.cs
│   ├── CreateRoleViewModel.cs
│   ├── ErrorViewModel.cs
│   ├── KYCInformation.cs
│   ├── PaginatedList.cs
│   ├── PaymentFormModel.cs
│   ├── PaymentLinkRequest.cs
│   ├── PinCodeData.cs
│   ├── PolicyInformation.cs
│   ├── PrePaymentData.cs
│   ├── UrlMapping.cs
│   ├── UrlResponse.cs
│   └── UserWithRoleViewModel.cs
│
├── Repositories/
│   ├── GenericPaymentsFetchRepository.cs
│   └── GenericPaymentsFetchService.cs
│
├── Services/
│   └── PaymentUtilityService.cs
│
├── Views/
│   ├── Home/
│   │   ├── Contact.cshtml
│   │   ├── Index.cshtml
│   │   └── Privacy.cshtml
│   ├── PaymentForm/
│   │   ├── Section1.cshtml
│   │   ├── Section2.cshtml
│   │   ├── Section3.cshtml
│   │   ├── Section4.cshtml
│   │   └── Index.cshtml
│   ├── SendPaymentLink/
│   │   └── Index.cshtml
│   └── Shared/
│       ├── _Layout.cshtml
│       ├── _ViewImports.cshtml
│       └── _ViewStart.cshtml
│
├── wwwroot/
│   ├── css/
│   │   ├── login.css
│   │   ├── register.css
│   │   ├── section1.css
│   │   ├── section2.css
│   │   ├── section3.css
│   │   ├── section4.css
│   │   ├── sendpayment-success.css
│   │   └── site.css
│   ├── js/
│   │   ├── paymentButton.js
│   │   ├── section1.js
│   │   ├── section2.js
│   │   ├── section3.js
│   │   ├── section4.js
│   │   └── site.js
│   └── images/
│
├── UploadedFiles/
│   └── {InvoiceNo}.zip
│
├── README.md
└── .gitignore

---

## 📸 UI Snapshot

![image](https://github.com/user-attachments/assets/66735a97-6a3f-4518-9442-b961026b602b)

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
