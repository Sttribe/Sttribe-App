# API Endpoints Documentation

This document lists all API endpoints used in the Sttribe App Web application.

## Table of Contents
1. [Local API Routes (Expo Router)](#local-api-routes-expo-router)
2. [Supabase Edge Functions](#supabase-edge-functions)
3. [External API Endpoints](#external-api-endpoints)
4. [Supabase Database Operations](#supabase-database-operations)

---

## Local API Routes (Expo Router)

These routes are defined in `/app/api/` and are served by Expo Router's API routes.

### 1. Razorpay API
**Base Path:** `/api/razorpay`

#### `POST /api/razorpay`
Create a Razorpay order.

**Request Body:**
```json
{
  "amount": number,
  "currency": "INR" (optional, default: "INR"),
  "receipt": string,
  "notes": object
}
```

**Response:**
```json
{
  "success": boolean,
  "order": {
    "id": string,
    "entity": "order",
    "amount": number,
    "currency": string,
    "receipt": string,
    "status": "created",
    "created_at": number
  },
  "key_id": string
}
```

#### `PUT /api/razorpay`
Verify Razorpay payment signature.

**Request Body:**
```json
{
  "razorpay_order_id": string,
  "razorpay_payment_id": string,
  "razorpay_signature": string
}
```

**Response:**
```json
{
  "success": boolean,
  "message": string,
  "payment_id": string
}
```

---

### 2. Recharge API
**Base Path:** `/api/recharge`

#### `POST /api/recharge`
Process a recharge transaction (Mobile, DTH, etc.).

**Request Body:**
```json
{
  "type": string,
  "number": string,
  "amount": number,
  "operator": string,
  "plan": string (optional)
}
```

**Response:**
```json
{
  "success": boolean,
  "message": string,
  "data": {
    "transaction_id": string,
    "type": string,
    "number": string,
    "amount": number,
    "operator": string,
    "status": "success",
    "timestamp": string
  }
}
```

#### `GET /api/recharge?userId={userId}`
Get recharge history for a user.

**Query Parameters:**
- `userId` (string): User ID

**Response:**
```json
{
  "success": boolean,
  "data": [
    {
      "id": number,
      "transaction_id": string,
      "type": string,
      "number": string,
      "amount": number,
      "operator": string,
      "status": string,
      "timestamp": string
    }
  ]
}
```

---

### 3. WhatsApp API
**Base Path:** `/api/whatsapp`

#### `POST /api/whatsapp`
Send a WhatsApp notification.

**Request Body:**
```json
{
  "phone": string,
  "message": string,
  "type": string
}
```

**Response:**
```json
{
  "success": boolean,
  "message": string,
  "data": {
    "id": string,
    "phone": string,
    "message": string,
    "type": string,
    "status": "sent",
    "timestamp": string
  }
}
```

#### `GET /api/whatsapp`
Get WhatsApp notification templates.

**Response:**
```json
{
  "success": boolean,
  "data": {
    "group_invite": {
      "template": string,
      "variables": string[]
    },
    "payment_reminder": {
      "template": string,
      "variables": string[]
    },
    "payment_success": {
      "template": string,
      "variables": string[]
    },
    "group_created": {
      "template": string,
      "variables": string[]
    },
    "subscription_purchased": {
      "template": string,
      "variables": string[]
    }
  }
}
```

---

## Supabase Edge Functions

These are deployed as Supabase Edge Functions and invoked via `supabase.functions.invoke()`.

### 1. Create Group
**Function:** `create-group`

**Invocation:**
```typescript
supabase.functions.invoke('create-group', { body: groupData })
```

**Request Body:**
```json
{
  "name": string,
  "description": string,
  "platform": string,
  "planName": string,
  "monthlyCost": number,
  "maxMembers": number,
  "isPrivate": boolean,
  "memberContacts": array
}
```

**Headers Required:**
- `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": boolean,
  "group": object,
  "message": string
}
```

---

### 2. Process Payment
**Function:** `process-payment`

**Invocation:**
```typescript
supabase.functions.invoke('process-payment', { body: paymentData })
```

**Request Body:**
```json
{
  "groupId": string,
  "userId": string,
  "amount": number,
  "paymentMethod": string,
  "razorpayOrderId": string,
  "razorpayPaymentId": string,
  "razorpaySignature": string
}
```

**Response:**
```json
{
  "success": boolean,
  "payment": object,
  "allPaid": boolean,
  "message": string
}
```

---

### 3. Process Recharge
**Function:** `process-recharge`

**Invocation:**
```typescript
supabase.functions.invoke('process-recharge', { body: rechargeData })
```

**Request Body:**
```json
{
  "rechargeType": string,
  "number": string,
  "amount": number,
  "operator": string,
  "razorpayPaymentId": string
}
```

**Headers Required:**
- `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": boolean,
  "transaction": object,
  "message": string
}
```

---

### 4. Send WhatsApp
**Function:** `send-whatsapp`

**Invocation:**
```typescript
supabase.functions.invoke('send-whatsapp', {
  body: { phone, message, type }
})
```

**Request Body:**
```json
{
  "phone": string,
  "message": string,
  "type": string,
  "templateData": object (optional)
}
```

**Response:**
```json
{
  "success": boolean,
  "messageId": string,
  "message": string
}
```

---

### 5. Withdraw Funds
**Function:** `withdraw-funds`

**Invocation:**
```typescript
supabase.functions.invoke('withdraw-funds', { body: withdrawalData })
```

**Request Body:**
```json
{
  "groupId": string,
  "amount": number,
  "purpose": string,
  "platform": string,
  "subscriptionDetails": {
    "email": string,
    "password": string
  }
}
```

**Headers Required:**
- `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": boolean,
  "withdrawal": object,
  "message": string
}
```

---

## External API Endpoints

These endpoints are called to external backend services (referenced in the codebase but not defined locally).

### External Backend Base URL
**Note:** `API_BASE_URL` is referenced but appears to be configured via environment variables.

### 1. Tribes API
**Base Path:** `${API_BASE_URL}/api/tribes`

#### `GET /api/tribes`
Get all tribes/groups for the authenticated user.

**Headers Required:**
- `Authorization: Bearer {idToken}`

**Response:**
```json
[
  {
    "id": string,
    "name": string,
    "platform": string,
    "members": array,
    "_count": {
      "members": number
    },
    "imageUrl": string
  }
]
```

#### `POST /api/tribes`
Create a new tribe/group.

**Headers Required:**
- `Authorization: Bearer {idToken}`

**Request Body:**
```json
{
  "name": string,
  "description": string,
  "maxMembers": number,
  "inviteEmails": array,
  "isPrivate": boolean,
  "platform": string,
  "plan": string
}
```

**Response:**
```json
{
  "id": string,
  "message": string
}
```

---

### 2. Dashboard Stats API
**Base Path:** `${API_BASE_URL}/api/dashboard/stats`

#### `GET /api/dashboard/stats`
Get dashboard statistics for the authenticated user.

**Headers Required:**
- `Authorization: Bearer {idToken}`

**Response:**
```json
{
  "activeTribes": number,
  "monthlySavings": number,
  "totalSubscriptions": number
}
```

---

### 3. Free Streams API
**Base Path:** `${API_BASE_URL}/api/free-streams`

**Alternative URL:** `https://api-s2onatgxwq-uc.a.run.app/api/free-streams`

#### `GET /api/free-streams`
Get list of free streaming content.

**Response:**
```json
[
  {
    "id": string,
    "title": string,
    "platform": string,
    "genre": string,
    "description": string,
    "imageUrl": string,
    "url": string
  }
]
```

---

### 4. Group Details API
**Referenced:** `https/api/tribes/${id}`

**Note:** This endpoint appears to be incomplete/malformed in the codebase.

---

## Supabase Database Operations

These are database operations performed via the Supabase client (defined in `/lib/api.ts`).

### Authentication
- `signUp(email, password, fullName)` - User registration
- `signIn(email, password)` - User login
- `signOut()` - User logout

### Groups
- `createGroup(groupData)` - Creates group via edge function
- `getMyGroups()` - Query groups with members and wallets
- `getGroupDetails(groupId)` - Get detailed group information
- `joinGroup(groupCode)` - Join a group by code

### Payments
- `createPayment(paymentData)` - Process payment via edge function
- `withdrawFunds(withdrawalData)` - Withdraw funds via edge function

### Recharge
- `processRecharge(rechargeData)` - Process recharge via edge function
- `getRechargeHistory()` - Query recharge transactions

### Chat
- `getGroupMessages(groupId)` - Get messages for a group
- `sendMessage(groupId, content, messageType, metadata)` - Send a message

### Notifications
- `getNotifications()` - Get user notifications
- `markNotificationAsRead(notificationId)` - Mark notification as read

### WhatsApp
- `sendWhatsAppNotification(phone, message, type)` - Send WhatsApp via edge function

---

## Notes

1. **Authentication:** Most endpoints require authentication via Firebase ID token or Supabase JWT token.

2. **CORS:** Supabase Edge Functions include CORS headers to allow cross-origin requests.

3. **Environment Variables:** Several endpoints depend on environment variables:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_SECRET`
   - `WHATSAPP_API_KEY`
   - `RECHARGE_API_KEY`
   - `API_BASE_URL` (for external endpoints)

4. **Error Handling:** All endpoints return JSON responses with `success` boolean and error messages where applicable.

5. **Status Codes:**
   - `200` - Success
   - `400` - Bad Request / Validation Error
   - `401` - Unauthorized
   - `403` - Forbidden
   - `500` - Internal Server Error

