
# Ecommerce Shipping API

An API designed to streamline the logistics of e-commerce platforms by efficiently calculating the nearest warehouse, shipping charges, and handling delivery speed options.

## Prerequisites

- Node.js (v14 or later)
- MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   
## Install dependencies:
npm install
Set up environment variables: Copy the .env.example file to .env and update the values as needed.
## Running the Application
To start the server in development mode:
npm run dev
## Project Structure

Ecommerce-Shipping/
├── node_modules/
├── src/
│   ├── config/
│   │   └── db.config.js
│   ├── controllers/
│   │   ├── calculateShipping.controller.js
│   │   ├── shipping.controller.js
│   │   └── warehouse.controller.js
│   ├── models/
│   │   ├── customers.model.js
│   │   ├── deliverySpeedCharges.model.js
│   │   ├── sellers.model.js
│   │   ├── transportRate.model.js
│   │   └── warehouses.model.js
│   ├── routes/
│   │   └── api.routes.js
│   ├── utils/
│   │   └── redisClient.utils.js
│   └── server.js
├── .env
├── .gitignore
├── LICENSE
├── README.md
├── package-lock.json
└── package.json


## API Endpoints

### 1. Get the Nearest Warehouse for a Seller

**Endpoint**: `GET /api/v1/warehouse/nearest`

**Description**: Retrieve the nearest warehouse for a seller based on their location.

#### Sample Request:

```http
GET /api/v1/warehouse/nearest?sellerId=123&productId=456
Sample Response:
{
  "warehouseId": 789,
  "warehouseLocation": {
    "lat": 12.99999,
    "long": 37.923273
  }
}

2. Get the Shipping Charge for a Customer from a Warehouse
Endpoint: GET /api/v1/shipping-charge

Description: Calculate the shipping charge based on warehouse ID, customer ID, and delivery speed.

Sample Request:
GET /api/v1/shipping-charge?warehouseId=789&customerId=456&deliverySpeed=standard

Sample Response:
{
  "shippingCharge": 150.00
}

3. Calculate Shipping Charges for a Seller and Customer
Endpoint: POST /api/v1/shipping-charge/calculate

Description: Combine nearest warehouse retrieval and shipping charge calculation.

Sample Request:
{
  "sellerId": "6739f878bc97fef1ddb8c1cb",
  "customerId": "Cust-123",
  "deliverySpeed": "express"
}

Sample Response:
{
  "shippingCharge": 180.00,
  "nearestWarehouse": {
    "warehouseId": 789,
    "warehouseLocation": {
      "lat": 12.99999,
      "long": 37.923273
    }
  }
}

