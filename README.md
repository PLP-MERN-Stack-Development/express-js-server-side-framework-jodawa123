# 🧸 Plushies API

A RESTful API for managing plushies/stuffies inventory built with Express.js and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd express-plushies-api

## API Documentation
1.Authentication
2.Include an API key in the request header:

- http
x-api-key: plushies-123
Valid API keys: plushies-123, stuffies-456, admin-789

3.Endpoints
- Root
GET / - API information

- Products
Get All Products

http
GET /api/products
Query Parameters:

page - Page number (default: 1)

limit - Items per page (default: 10)

category - Filter by category

inStock - Filter by stock status

minPrice, maxPrice - Price range filter

Response:

json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20,
    "pages": 2
  }
}
Get Single Product

http
GET /api/products/:id
Create Product (Protected)

http
POST /api/products
Headers: 
  x-api-key: your-api-key
  Content-Type: application/json

Body:
{
  "name": "Product Name",
  "description": "Product description",
  "price": 100,
  "category": "animal",
  "inStock": true
}
Update Product (Protected)

http
PUT /api/products/:id
Headers: 
  x-api-key: your-api-key
  Content-Type: application/json
Delete Product (Protected)

http
DELETE /api/products/:id
Headers: x-api-key: your-api-key
Search Products

http
GET /api/products/search?q=search+term
Get Statistics

http
GET /api/products/stats
Product Categories
animal - Animal plushies

food - Food-themed plushies

item - Object plushies

fantasy - Fantasy creatures

cartoon - Cartoon characters

🗄️ Data Model
javascript
{
  "name": "String (required)",
  "description": "String (required)",
  "price": "Number (required, min: 0)",
  "category": "String (enum: animal,food,item,fantasy,cartoon)",
  "inStock": "Boolean (default: true)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
🛠️ Development
Scripts
npm start - Start production server

npm run dev - Start development server with nodemon

npm run seed - Populate database with sample data

Sample Data
The seed script creates 20 sample plushies including:

Tobby (brown monkey)

Fifi (pink flower vase)

BunBun (hamburger bun)

And many more!

🧪 Testing
Use tools like:

Postman

Insomnia

curl

Example curl commands:
Get all products:

bash
curl http://localhost:3000/api/products
Create a product:

bash
curl -X POST http://localhost:3000/api/products \
  -H "x-api-key: plushies-123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Plush",
    "description": "A test plushie",
    "price": 299,
    "category": "animal",
    "inStock": true
  }'
🤝 Error Handling
The API returns standardized error responses:

json
{
  "success": false,
  "message": "Error description",
  "details": ["Additional error details"] // Optional
}
Common HTTP Status Codes
200 - Success

201 - Created

400 - Validation error

401 - Unauthorized (invalid API key)

404 - Resource not found

500 - Internal server error

📦 Dependencies
Production
express - Web framework

mongoose - MongoDB ODM

body-parser - Request parsing

dotenv - Environment variables

uuid - ID generation

Development
nodemon - Development server

🐛 Troubleshooting
MongoDB Connection Issues:

Ensure MongoDB is running

Check connection string in .env

Verify database permissions

API Key Errors:

Include x-api-key header for protected routes

Use valid API keys from .env

Validation Errors:

Check required fields

Ensure price is a positive number

Use valid categories

📄 License
MIT License - feel free to use this project for learning purposes!