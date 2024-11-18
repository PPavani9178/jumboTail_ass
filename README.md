# Ecommerce Shipping API

An API designed to streamline the logistics of e-commerce platforms by efficiently calculating the nearest warehouse, shipping charges, and handling delivery speed options.

---

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Collections and Data Models](#collections-and-data-models)
4. [Project Structure](#project-structure)
5. [API Endpoints](#api-endpoints)
6. [Installation](#installation)
7. [Usage](#usage)
8. [Packages Used](#packages-used)
9. [Contributing](#contributing)
10. [License](#license)

---

## Features

- Retrieve the nearest warehouse for a seller or customer.
- Calculate shipping charges based on delivery speed and transport mode.
- Seamlessly integrate with a MongoDB database for dynamic data management.

---

## Prerequisites

- **Node.js** (v14 or later)
- **MongoDB** installed and running
- A database named `Ecommerce-shipping` with the following collections:
  - `customers`
  - `sellers`
  - `warehouses`
  - `transportcosts`
  - `deliverycosts`

Ensure the collections are populated with the sample data provided below.

---

## Collections and Data Models

### Customers

```json
{
  "_id": "6739ba666788ed158344ef33",
  "customerId": "Cust-123",
  "customerName": "Shree Kirana Store",
  "phoneNumber": "9847458698",
  "location": {
    "lat": 11.232,
    "lng": 23.445495
  }
}
```

### deliverycosts
```json
{
  "_id": "deliverySpeedCharges",
  "type": "deliverySpeedCharges",
  "charges": {
    "Standard": 10,
    "Express": 1.2
  }
}
```

### sellers
```json
{
  "_id": "6739f878bc97fef1ddb8c1cb",
  "sellerName": "Nestle Seller",
  "location": {
    "lat": 13.0221,
    "lng": 77.5946
  },
  "products": [
    {
      "productId": "456",
      "productName": "Maggie 500g Packet",
      "sellingPrice": 10,
      "attributes": {
        "weight": 0.5,
        "dimensions": "10cm x 10cm x 10cm"
      }
    }
  ]
}

```

### transportcosts

```json
{
  "_id": "transportRates",
  "type": "transportRates",
  "rates": [
    {
      "mode": "Aeroplane",
      "rate": 1,
      "minDistance": 500
    },
    {
      "mode": "Truck",
      "rate": 2,
      "minDistance": 100
    },
    {
      "mode": "MiniVan",
      "rate": 3,
      "minDistance": 0
    }
  ]
}

```

### warehouses
```json
{
  "_id": "6739f8a1bc97fef1ddb8c1d1",
  "warehouseName": "BLR_Warehouse",
  "location": {
    "lat": 12.99999,
    "lng": 77.59999
  }
}
```



## Project Structure

```plaintext
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
```


## Api-endpoints

### 1. Get the Nearest Warehouse for a Seller
- **Endpoint:** `GET /api/v1/warehouse/nearest`  
- **Description:** Retrieve the nearest warehouse for a seller based on their location.  

**Sample Request:**
```http
GET /api/v1/warehouse/nearest?sellerId=123&productId=456
```

**Sample Response:**
```json
{
  "warehouseId": 789,
  "warehouseLocation": { "lat": 12.99999, "long": 37.923273 }
}
```

### 2. Get the Shipping Charge for a Customer from a Warehouse
**Endpoint:** `GET /api/v1/shipping-charge`
**Description:** Calculate the shipping charge based on warehouse ID, customer ID, and delivery speed.

**Sample Request:**`GET /api/v1/shipping-charge?warehouseId=789&customerId=456&deliverySpeed=standard`
**Sample Response:**
```json
{
  "shippingCharge": 150.00
}
```

### 3. Calculate Shipping Charges for a Seller and Customer
**Endpoint:** `POST /api/v1/shipping-charge/calculate`
**Description:** Combine nearest warehouse retrieval and shipping charge calculation.

**Sample Request:**
```json
{
  "sellerId": "6739f878bc97fef1ddb8c1cb",
  "customerId": "Cust-123",
  "deliverySpeed": "express"
}
```

**Sample Response:**
```json
{
  "shippingCharge": 180.00,
  "nearestWarehouse": {
    "warehouseId": 789,
    "warehouseLocation": { "lat": 12.99999, "long": 37.923273 }
  }
}
```

## Installation
### Clone the Repository
```bash
git clone https://github.com/your-repo/ecommerce-shipping-api.git
cd ecommerce-shipping-api
Install Dependencies
```

```bash
npm install
```

### Database Setup
Start MongoDB and create the database Ecommerce-shipping with the provided collections.
**Start the Server**
```bash
npm dev start
```


## Usage
Use tools like Postman to test the endpoints listed in the API documentation.

###Packages Used
- Express: For routing and server setup.
- Mongoose: To interact with MongoDB.
- Redis: For caching.
- Geolib: For geographical calculations (distances, coordinates).
- Haversine: For calculation of longitude and lattitude.


## Contributing
Feel free to open issues or submit pull requests for improvements and new features!

## License
This project is licensed under the MIT License.
```vbnet
This structure ensures clarity and proper formatting for your `README.md` file. Let me know if you'd like further customization!
```
