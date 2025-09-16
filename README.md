# Product Catalog - React Router v7 

## Features

### Core Functionality
- **Product Management**: Create, read, update, and delete products
- **User Authentication**: JWT-based authentication with registration and login
- **Role-Based Access Control**: Admin, and SuperAdmin roles with different permissions
- **Responsive Design**: Tailwind CSS and DaisyUI
- **Search & Filter**: Product search with sorting capabilities

### User Roles & Permissions

#### Regular Users
- Browse and search products
- Create, edit, and delete their own products
- View product details
- User profile management

#### SuperAdmin
- All user permissions
- Block/unblock user accounts
- Edit and delete any product regardless of ownership
- Access to user management dashboard
- View all users and their status

### Authentication & Security
- Password hashing with bcrypt
- JWT tokens stored in secure HTTP-only cookies
- Server-side validation for all operations
- File upload validation (size, type, security)
- Role-based route protection
- CSRF protection

## Tech Stack

### Frontend
- **React Router v7** - Full-stack React framework
- **TypeScript** - Type safety throughout the application
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **React Hook Form** - Form management and validation
- **Zod** - Schema validation

### Backend
- **React Router v7** - Server-side rendering and API routes
- **MySQL** - Primary database
- **Drizzle ORM** - Type-safe database queries
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

## Installation & Setup

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-catalog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Usage Examples

### Creating a Product
1. Register/login as a user
2. Navigate to "Add Product" 
3. Fill in product details and upload an image
4. Submit the form
5. Get redirected to the new product page

### SuperAdmin Functions
1. Login with superadmin credentials
2. Access `/admin/users` for user management
3. Block/unblock users as needed
4. Edit or delete any product through admin interface

### Search and Filter
1. Go to the products page
2. Use the search bar to find products by name, description, or category
3. Sort by name, price, or category
4. Toggle ascending/descending order

