 # 🏪 Local Business Directory

Welcome to the **Local Business Directory** application! A modern, feature-rich mobile application designed to help users discover and connect with local businesses in their area.

![Platform](https://img.shields.io/badge/Platform-React%20Native-blue) ![Build Status](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-green)


## 🎯 Overview

The Local Business Directory is a comprehensive mobile application built with React Native and Expo that provides users with an intuitive platform to:

- **Discover** local businesses by category
- **View detailed information** about businesses including ratings, reviews, and contact information
- **Create and manage** their own business listings
- **Leave reviews** and ratings for businesses they've visited
- **Browse** through a curated collection of local services

This application leverages Firebase for authentication and backend services, ensuring secure and reliable data management.

## 🎓 Project Objectives

The Local Business Directory project aims to achieve the following goals:

### Primary Objectives

1. **Bridge Local Businesses & Customers**
   - Create a centralized platform where local businesses can list their services and reach potential customers
   - Enable customers to easily discover businesses in their area
   - Foster community engagement through ratings and reviews

2. **Empower Business Owners**
   - Provide business owners with tools to create and manage their own listings
   - Allow businesses to showcase their products and services with images and detailed information
   - Enable businesses to respond to customer feedback and build reputation

3. **Enhance User Experience**
   - Offer an intuitive mobile interface for discovering and reviewing businesses
   - Implement category-based browsing for easy navigation
   - Provide authentic reviews and ratings to help users make informed decisions

4. **Ensure Content Quality**
   - Implement admin moderation features to maintain platform integrity
   - Screen business listings and reviews for authenticity and appropriateness
   - Protect users from fraudulent or inappropriate content

5. **Support Business Growth**
   - Track business engagement metrics and views
   - Provide analytics to help businesses understand customer interests
   - Create opportunities for local businesses to gain visibility and increase revenue

## ✨ Features

### 🔍 Business Discovery
- **Category-based browsing** - Explore businesses by different categories
- **Business search** - Find specific businesses quickly
- **Detailed business profiles** - View comprehensive information about each business
- **Ratings & Reviews** - Check out what other users think about businesses

### 👤 User Management
- **Authentication** - Secure login and registration with Firebase
- **User profiles** - Manage personal profile information
- **Business ownership** - Create and manage your own business listings
- **Review history** - Track your submitted reviews and ratings

### 🏢 Business Features
- **Business listings** - Create detailed business profiles
- **Photo gallery** - Showcase business images
- **Contact information** - Display phone, email, and address
- **Business analytics** - Track views and engagement on your listing

### 📱 Admin Features
- **Admin panel** - Manage business listings and user content
- **Content moderation** - Review and approve business listings and reviews
- **Authentication guard** - Secure admin access with role-based protection

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Mobile Framework** | [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) |
| **Language** | JavaScript |
| **Backend** | [Firebase](https://firebase.google.com/) (Authentication, Realtime Database) |
| **Routing** | Expo Router (File-based routing) |
| **Styling** | React Native StyleSheet & UI Components |
| **State Management** | React Context API / Local State |
| **Development** | Node.js & npm |
| **Code Quality** | ESLint |

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Expo CLI** (optional but recommended)
  ```bash
  npm install -g expo-cli
  ```

### Installation & Setup

Follow these steps to install and set up the project on your local machine:

#### Step 1: Install Node.js Dependencies

```bash
# Install all project dependencies
npm install
```

**Note:** This command reads the `package.json` file and installs all required packages in the `node_modules` directory.

#### Step 2: Configure Firebase

The app requires Firebase for authentication and backend services:

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project" and follow the setup wizard
   - Enable authentication (Email/Password and Google)
   - Create a Realtime Database

2. **Get Your Firebase Configuration**
   - In Firebase Console, go to Project Settings
   - Copy your Firebase configuration credentials

3. **Update Firebase Config File**
   ```bash
   # Open the Firebase config file
   Configs/FireBaseConfig.js
   ```
   
   Update it with your Firebase credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Configure Firebase Database Rules**
   - In Firebase Console, go to Database Rules
   - Set appropriate read/write permissions for your application


#### Step 5: Start the Development Server

```bash
# Start the Expo development server
npm start
```

After running this command, you'll see a QR code and options to:
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your phone

## 📝 Available Scripts

### `npm start`
Starts the Expo development server. Use this to run the app in development mode.

### `npm run android`
Runs the app on Android emulator or connected device.

### `npm run ios`
Runs the app on iOS simulator (macOS only).

### `npm run web`
Runs the app in web browser.

### `npm run reset-project`
Resets the project to a clean state, moving starter code to `app-example` directory.

### `npm run lint`
Runs ESLint to check code quality and identify issues.