# Sariee API Integration Guide

This document explains how the Sariee API is integrated with the Aurealis Cosmetics website.

## Overview

The Sariee API integration provides:
- User authentication (login/register)
- Product management
- Category management
- Cart and checkout functionality
- Order management
- Address management

## API Endpoints

### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `POST /forget-password` - Password reset request
- `POST /reset-password` - Password reset confirmation

### User Management
- `GET /user/profile` - Get user profile
- `POST /user/change-profile` - Update user profile
- `POST /user/change-password` - Change password

### Address Management
- `POST /user/store-address` - Add new address
- `POST /user/update-address` - Update existing address
- `GET /user/list-address` - Get user addresses

### Products
- `GET /all-products` - Get all products with filtering
- `GET /featured-products` - Get featured products
- `GET /single-product` - Get single product details
- `GET /list-categories` - Get product categories

### Cart & Checkout
- `GET /cart/get-cart` - Get user's cart
- `POST /cart/add-update-item` - Add/update cart item
- `POST /cart/add-promocode` - Apply promo code
- `POST /cart/available-payment-methods` - Get payment methods
- `POST /cart/checkout` - Process checkout

### Orders
- `GET /user/orders` - Get user orders
- `GET /profile/orders/show` - Get single order details

## Request Format

All requests follow this format:

### Headers
```
Accept: application/json
Content-Type: application/json (for POST requests)
Authorization: Bearer {access_token} (for authenticated requests)
```

### Request Body (POST requests)
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

### Query Parameters (GET requests)
```
?param1=value1&param2=value2
```

## Response Format

All responses follow this structure:

```json
{
  "status": true,
  "internal_code": 200,
  "code": 200,
  "message": "success",
  "data": {
    // Response data here
  },
  "_meta": {
    "pagination": {
      "current_page": 1,
      "from": 1,
      "last_page": 10,
      "path": "https://api.sariee.com/api/company/public/v2/all-products",
      "per_page": 25,
      "to": 25,
      "total": 250,
      "has_more": true
    }
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "status": false,
  "internal_code": 400,
  "code": 400,
  "message": "Error description",
  "data": null
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Authentication Flow

1. **Login/Register**: User provides credentials
2. **Token Response**: API returns access token
3. **Token Storage**: Token stored in localStorage
4. **Authenticated Requests**: Token included in Authorization header
5. **Token Expiry**: Handle token expiration gracefully

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SARIEE_API_URL=https://api.sariee.com/api/company/public/v2

# Optional
NEXT_PUBLIC_SARIEE_API_KEY=your_api_key_here
```

## Usage Examples

### Login
```typescript
import sarieeApi from '@/lib/sariee-api';

const response = await sarieeApi.login('user@example.com', 'password');
if (response.status) {
  console.log('Login successful:', response.data.user);
}
```

### Get Products
```typescript
const products = await sarieeApi.getAllProducts({
  type: 'unseperated',
  per_page: 20,
  filter: [
    { name: 'product_category_pivots.product_category_id', value: 'category-id' }
  ]
});
```

### Add to Cart
```typescript
const cartResponse = await sarieeApi.addToCart({
  product_id: 'product-id',
  quantity: 2,
  product_barcode_id: 'barcode-id'
});
```

## Debugging

The integration includes comprehensive debugging tools:

### Enable Debug Logging
```typescript
import { sarieeDebugger } from '@/lib/sariee-debug';

// Enable all logging
sarieeDebugger.setConfig({
  enableLogging: true,
  logRequests: true,
  logResponses: true,
  logErrors: true
});
```

### Test Connection
```typescript
import { testSarieeConnection } from '@/lib/sariee-debug';

const isConnected = await testSarieeConnection('https://api.sariee.com/api/company/public/v2');
console.log('Connection status:', isConnected);
```

### Validate Environment
```typescript
import { validateEnvironmentVariables } from '@/lib/sariee-debug';

const validation = validateEnvironmentVariables();
if (!validation.isValid) {
  console.error('Missing environment variables:', validation.missing);
}
```

## Best Practices

1. **Error Handling**: Always check `response.status` before using data
2. **Token Management**: Store tokens securely and handle expiration
3. **Loading States**: Show loading indicators during API calls
4. **Validation**: Validate user input before sending requests
5. **Retry Logic**: Implement retry for failed requests
6. **Caching**: Cache frequently accessed data when appropriate

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure API URL is correct and CORS is configured
2. **Authentication Errors**: Check token validity and format
3. **Network Errors**: Verify internet connection and API availability
4. **Response Format Errors**: Ensure API response matches expected format

### Debug Steps

1. Check browser console for detailed error logs
2. Verify environment variables are set correctly
3. Test API endpoints directly with tools like Postman
4. Check network tab for request/response details
5. Validate request format matches API documentation

## Support

For API-related issues:
1. Check the Sariee API documentation
2. Contact Sariee support team
3. Review error logs and debug information
4. Test with minimal request examples
