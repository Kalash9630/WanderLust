# WanderLust – Vacation Rental & Property Booking Platform

WanderLust is a full-stack web application inspired by Airbnb that allows users to explore properties, create listings, write reviews, manage their accounts, and book accommodations. It provides a complete booking experience with availability checking, dynamic pricing, email verification, and booking confirmation.

The application is built using Node.js, Express.js, MongoDB, and EJS, following the MVC (Model-View-Controller) architecture.

---

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Core Functionalities](#core-functionalities)
  - [Property Listings Management](#1-property-listings-management)
  - [Reviews and Ratings](#2-reviews-and-ratings)
  - [User Authentication and Authorization](#3-user-authentication-and-authorization)
  - [Property Image Upload](#4-property-image-upload)
  - [Interactive Maps](#5-interactive-maps)
  - [Search, Filters and Sorting](#6-property-search-filters-and-sorting)
  - [Booking System](#7-booking-and-reservation-system)
  - [User Account Management](#8-user-account-management)
  - [Contact and About Pages](#9-contact-and-about-pages)
  - [Email Verification and Notifications](#10-email-verification-and-notifications)
  - [Country and City Selection](#11-country-and-city-selection)
- [Booking Workflow](#booking-workflow)
- [Email Delivery Architecture](#email-delivery-architecture)
- [Database Models](#database-models)
- [Validation and Error Handling](#validation-and-error-handling)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)

---

## Features

- User registration with email OTP verification.
- Secure login, logout, authentication, and authorization.
- Create, view, edit, and delete property listings.
- Upload and manage property images.
- Add and delete property reviews.
- Interactive maps displaying property locations.
- Search properties by country or city.
- Filter properties using minimum and maximum prices.
- Sort properties by price.
- Check property availability for selected dates.
- Dynamic booking price calculation.
- Complete booking and confirmation workflow.
- Booking confirmation emails.
- Downloadable booking confirmation PDF.
- Personal account dashboard.
- Manage profile, bookings, wishlist, listings, and reviews.
- Change password and permanently delete account.
- Contact form with FAQ section.
- Persistent user sessions using MongoDB.

---

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- EJS (Embedded JavaScript Templates)
- Bootstrap
- EJS-Mate
- Flatpickr

### Backend
- Node.js
- Express.js
- Express Router
- MVC Architecture
- Passport.js
- Passport Local Mongoose
- Express Session
- Connect-Mongo
- Connect-Flash

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### Validation and Security
- Joi
- Express Middleware
- Password Hashing and Salting
- Passport Authentication
- Session-based Authentication and Authorization

### APIs and Integrations
- Mapbox Geocoding API
- Mapbox Maps
- Cloudinary
- Gmail API
- Google OAuth 2.0

### Additional Libraries
- Multer
- Country-State-City
- PDFKit
- Google APIs

### Deployment and Development Tools
- Git
- GitHub
- Render
- MongoDB Atlas
- dotenv
- Nodemon

---

## Project Architecture

The application follows the **MVC (Model-View-Controller)** architecture to maintain a structured and organized codebase.

- **Models:** Define database schemas and handle database operations using Mongoose.
- **Views:** Render the user interface using EJS templates.
- **Controllers:** Handle application logic and coordinate between models and views.
- **Routes:** Define application endpoints and connect incoming requests to their respective controllers.
- **Middleware:** Handle authentication, authorization, validation, and error handling.
- **Public:** Stores static assets such as CSS, JavaScript, and images.
- **Utils:** Contains reusable utility functions, including email authentication and delivery.

---

## Core Functionalities

### 1. Property Listings Management

Users can explore available properties and manage their own listings.

- Display all available properties on the home page.
- View individual property details.
- Create new property listings.
- Edit existing listing information.
- Delete property listings.
- Associate each listing with its owner.
- Automatically delete associated reviews and bookings when a listing is deleted.

**RESTful Routes:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/listings` | Display all listings |
| GET | `/listings/:id` | Display an individual listing |
| GET | `/listings/new` | Display the new listing form |
| POST | `/listings` | Create a listing |
| GET | `/listings/:id/edit` | Display the edit form |
| PUT | `/listings/:id` | Update a listing |
| DELETE | `/listings/:id` | Delete a listing |

### 2. Reviews and Ratings

Users can share their experiences by reviewing properties.

- Add reviews and ratings to individual listings.
- Display reviews on the property details page.
- Associate each review with its author and listing.
- Delete individual reviews.
- Automatically remove associated reviews when a listing is deleted.
- Restrict review deletion to authorized users.

### 3. User Authentication and Authorization

Passport.js and Passport Local Mongoose are used to implement user authentication.

- User registration and login.
- Secure password hashing and salting.
- User logout functionality.
- Persistent login sessions.
- Authentication middleware to protect restricted routes.
- Authorization checks for listing and review operations.
- Listing ownership verification before editing or deleting listings.
- Review ownership verification before deleting reviews.

### 4. Property Image Upload

Multer and Cloudinary are integrated to manage property images.

- Upload images while creating a listing.
- Store uploaded images using Cloudinary.
- Save image information in the MongoDB listing document.
- Replace or update images when editing listings.

### 5. Interactive Maps

Mapbox is integrated to display the geographical location of each property.

- Convert location names into geographical coordinates using the Mapbox Geocoding API.
- Retrieve latitude and longitude.
- Display an interactive map on the individual listing page.
- Add markers, map controls, and location information.

### 6. Property Search, Filters and Sorting

Users can discover properties using different search and filtering options without logging in.

**Price Filters**
- Filter listings using a minimum price.
- Filter listings using a maximum price.
- Apply both price conditions together.

**Country and Location Filter**
- Search for a country or city.
- Retrieve matching locations dynamically from MongoDB.
- Filter listings based on their location or country.

**Sorting**
- Price: Low to High.
- Price: High to Low.

**Filter Controls**
- Apply Filters to display matching properties.
- Clear Filters to restore the original listing results.

### 7. Booking and Reservation System

A complete multi-step booking workflow allows users to reserve properties.

**Booking Features**
- Collect guest information.
- Select check-in and check-out dates.
- Check property availability.
- Calculate the number of nights.
- Calculate accommodation charges, taxes, fees, and total pricing.
- Review booking information before confirmation.
- Save confirmed bookings in MongoDB.
- Generate a unique booking reference.
- Send booking confirmation emails.
- Generate downloadable booking confirmation PDFs.

### 8. User Account Management

The account section provides a centralized dashboard for managing user information and activities.

**My Profile**
- Display username, email, date of birth, calculated age, mobile number, and gender.
- Edit personal information.
- Validate updated information before saving.

**My Bookings**
- Display all bookings made by the logged-in user.
- Separate upcoming and completed bookings.
- View property details, booking reference, dates, and pricing.
- Delete bookings after confirmation.

**My Wishlist**
- Save properties to a personal wishlist.
- Add or remove properties.
- Display saved properties.
- Navigate to individual property details.

**My Listings**
- Display properties created by the logged-in user.
- View, edit, and delete owned listings.

**My Reviews**
- Display reviews written by the logged-in user.
- Show the associated property information.
- Delete personal reviews.

**Account Settings**
- Change password after verifying the current password.
- Confirm the new password.
- Permanently delete the user account after password verification.
- Remove associated user data, including owned listings, reviews, and bookings.

### 9. Contact and About Pages

**Contact Page**
- Contact form with name, email, subject, and message fields.
- FAQ section.
- Backend validation using Joi.
- Store submitted contact information in MongoDB.

**About Page**
- Display information about the WanderLust platform.
- Inform users about the purpose and vision of the application.

### 10. Email Verification and Notifications

Email functionality is integrated into the registration and booking workflows.

**Email Verification**
- Check username availability.
- Check email availability.
- Generate a one-time password (OTP).
- Send OTP to the user's email address.
- Verify the submitted OTP.
- Allow registration after successful verification.

**Booking Confirmation**
- Send a confirmation email after a booking is successfully saved.
- Include booking reference, property details, stay dates, and pricing information.
- Generate a booking confirmation PDF for download.

### 11. Country and City Selection

The Country-State-City package is used to provide dynamic country and city suggestions in the listing form.

**Workflow:**
1. The user opens the new listing form.
2. The frontend requests available countries from the backend.
3. The backend retrieves country information using `Country.getAllCountries()`.
4. The user selects a country.
5. The frontend retrieves its ISO country code.
6. The frontend requests cities using the selected country code.
7. The backend retrieves cities using `City.getCitiesOfCountry()`.
8. The city suggestions are displayed dynamically.
9. The submitted listing information is validated and stored in MongoDB.

---

## Booking Workflow

The booking process is divided into five main frontend stages, followed by backend booking creation and confirmation.

### 1. Guest Details (`guest-details`)

- Collect guest information, including name, email, date of birth, mobile number, and other required details.
- Validate information on the frontend.
- Send the submitted data to the backend.
- Validate the information using Joi.
- Store guest details temporarily in the Express session.

### 2. Stay Details (`stay-details`)

- Select check-in and check-out dates using Flatpickr.
- Calculate the duration of the stay using frontend JavaScript.
- Check property availability for the selected dates.
- Send availability requests to the backend.
- Validate dates using Joi.
- Store check-in date, check-out date, and duration in the booking session.

### 3. Pricing Details (`pricing-details`)

- Display accommodation charges.
- Calculate the total price based on the number of nights.
- Calculate taxes and additional fees.
- Display the complete pricing breakdown.
- Send pricing information to the backend.
- Store pricing details in the existing booking session.

### 4. Review and Confirm (`review-details`)

- Display guest information.
- Display check-in and check-out details.
- Display the total booking price.
- Allow users to review and edit stay details.
- Provide options to confirm or cancel the booking.
- Clear temporary booking information if the user cancels.

### 5. Booking Creation and Confirmation

After the user confirms the booking:

- Validate that all required information exists in the session.
- Verify that the listing still exists and the selected dates are valid.
- Create a booking document in MongoDB.
- Generate a unique booking reference.
- Store guest, stay, and pricing information.
- Associate the booking with the logged-in user and the selected listing.
- Add the booking ID to `User.bookings` and `Listing.bookings`.
- Clear temporary booking session data.
- Send the booking confirmation email.
- Generate the booking confirmation PDF.

### 6. Booking Success Page

- Display the booking reference number.
- Display guest information.
- Display stay details.
- Display the pricing breakdown.
- Automatically redirect the user to the listings page after 60 seconds.

**Booking Implementation Approach:** The booking workflow was developed using a frontend-first approach. The UI and interactions were implemented and tested first, followed by backend routes, controllers, validation, and database integration. Frontend JavaScript uses asynchronous requests to communicate with backend endpoints.

---

## Email Delivery Architecture

WanderLust uses the Gmail API with OAuth 2.0 for email delivery.

**Why Gmail API?**

The initial implementation used Nodemailer with Gmail SMTP. However, Render Free hosting restricts outbound SMTP connections, so the email delivery system was migrated to the Gmail API.

**Implementation:**
- Create a Google Cloud project and enable the Gmail API.
- Configure OAuth 2.0 in Personal mode.
- Generate a Client ID, Client Secret, and Refresh Token.
- Create `googleAuth.js` inside the `utils` folder to initialize the OAuth2 client.
- Configure credentials using environment variables.
- Update `mailer.js` to send emails through the Gmail API.
- Encode email messages using Base64 URL-safe encoding.
- Use `gmail.users.messages.send()` to send emails.

The existing email functions are retained:

- `sendVerificationEmail()` – OTP verification.
- `sendBookingConfirmationEmail()` – booking confirmation.

The OAuth refresh token allows the application to obtain new access tokens without requiring repeated user authorization. The refresh token does not have the seven-day expiration associated with External OAuth applications in Testing mode, although Google can still revoke tokens under certain conditions.

---

## Database Models

The application uses MongoDB and Mongoose to manage its data.

| Model | Purpose |
|---|---|
| User | Stores user account details, authentication information, bookings, wishlist, and owned listings |
| Listing | Stores property information, owner, images, reviews, and bookings |
| Review | Stores user reviews and ratings associated with properties |
| Booking | Stores guest details, stay information, pricing, booking status, and booking reference |
| Contact | Stores contact form submissions |
| Session | Stores persistent Express session information in MongoDB |

The models maintain relationships through MongoDB ObjectIds and references. Related records are updated or deleted when their associated user, listing, review, or booking is removed.

---

## Validation and Error Handling

The application implements both client-side and server-side validation.

**Client-Side Validation**
- Validate form fields before submission.
- Check required fields and input formats.
- Provide immediate feedback to users.
- Handle frontend interactions and edge cases.

**Server-Side Validation**
- Use Joi schemas to validate incoming request data.
- Implement reusable validation middleware.
- Validate listing, review, contact, profile, guest, stay, and booking information.
- Protect database operations from invalid input.

**Error Handling**
- Centralized error-handling middleware.
- Custom error classes.
- Dedicated error page (`error.ejs`).
- Flash messages for user feedback.
- Try-catch handling for asynchronous operations.

---

## Deployment

WanderLust is deployed using Render, with MongoDB Atlas as the cloud database.

**Deployment Workflow:**
1. Set up a MongoDB Atlas cluster.
2. Configure the cloud database connection.
3. Configure persistent session storage using Connect-Mongo.
4. Push the application source code to GitHub.
5. Connect the GitHub repository to Render.
6. Configure the required environment variables in Render.
7. Configure MongoDB Atlas network access for the deployed application.
8. Deploy the application through Render.

**Hosting Components:**
- Render – Application hosting.
- MongoDB Atlas – Cloud database.
- GitHub – Source code repository.
- Cloudinary – Property image storage.
- Gmail API – Email delivery.

---

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
ATLASDB_URL=your_mongodb_atlas_connection_string

SECRET=your_session_secret

MAP_TOKEN=your_mapbox_access_token

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_google_oauth_refresh_token
GOOGLE_REDIRECT_URI=your_google_oauth_redirect_uri
GMAIL_USER=your_sender_gmail_address

NODE_ENV=development
```

**Important:** Never commit your `.env` file or expose API keys, OAuth credentials, database connection strings, or other secrets in a public repository.

For production, configure these environment variables directly in the Render dashboard.

---

## Installation and Setup

### Prerequisites

- Node.js and npm installed.
- MongoDB database or MongoDB Atlas account.
- Required API credentials for Mapbox, Cloudinary, and Gmail API.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to the Project Directory

```bash
cd WanderLust
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add the required configuration values.

### 5. Start the Application

```bash
npm start
```

If the project uses Nodemon for development:

```bash
nodemon app.js
```

### 6. Open the Application

Visit:

```text
http://localhost:8080
```

---

## Future Enhancements

Potential improvements for future development include:

- Online payment gateway integration.
- Advanced property recommendations.
- Enhanced search and filtering.
- Improved booking management.
- Additional user profile features.
- Performance optimization and scalability improvements.

---

**WanderLust – Explore. Discover. Stay.**