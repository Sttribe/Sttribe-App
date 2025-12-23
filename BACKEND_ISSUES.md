# Backend Issues Found

This document lists all backend issues identified in the codebase that need to be fixed.

## 🔴 Critical Issues

### 1. **Malformed API URLs**
**Location:** Multiple files
- `app/(tabs)/index.tsx:65` - `https/api/tribes` (missing base URL)
- `app/(tabs)/groups.tsx:48` - `https/api/tribes` (missing base URL)
- `app/group-details.tsx:72` - `https/api/tribes/${id}` (missing base URL)
- `app/(tabs)/discover.tsx:62` - `https/api/free-streams` (missing base URL)

**Issue:** URLs are malformed and will cause 404 errors. Should be `${API_BASE_URL}/api/tribes` or similar.

---

### 2. **Undefined API_BASE_URL Variable**
**Location:** Multiple files
- `app/(tabs)/index.tsx:54, 110` - Uses `API_BASE_URL` but import is commented out
- `app/create-group.tsx:162` - Uses `API_BASE_URL` but import is commented out
- Other files also reference this undefined variable

**Issue:** `API_BASE_URL` is used but never defined, causing runtime errors. The import from `@env` is commented out.

---

### 3. **Razorpay Payment Verification Not Implemented**
**Location:** `app/api/razorpay+api.ts:48-80` and `supabase/functions/process-payment/index.ts:31`

**Issue:** Payment signature verification always returns `true` (hardcoded). This is a security vulnerability.

```typescript
// Current (WRONG):
const isSignatureValid = true // Replace with actual signature verification

// Should implement:
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', RAZORPAY_SECRET);
hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
const generated_signature = hmac.digest('hex');
const isSignatureValid = generated_signature === razorpay_signature;
```

---

### 4. **Razorpay Order Creation Not Using Real API**
**Location:** `app/api/razorpay+api.ts:19-32`

**Issue:** Creating mock orders instead of calling actual Razorpay API. Should use Razorpay SDK to create real orders.

---

## 🟠 High Priority Issues

### 5. **Missing Wallet Balance Updates**
**Location:** `supabase/functions/process-payment/index.ts`

**Issue:** After payment is processed, the `group_wallets` table is not updated with the new payment amount. Payment is recorded but wallet balance doesn't increase.

**Fix needed:** Update `available_balance` and `total_collected` in `group_wallets` after successful payment.

---

### 6. **Missing Wallet Balance Deduction on Withdrawal**
**Location:** `supabase/functions/withdraw-funds/index.ts`

**Issue:** When funds are withdrawn, the withdrawal record is created but `group_wallets.available_balance` is not decremented.

**Fix needed:** Decrement wallet balance after successful withdrawal.

---

### 7. **Missing Group Wallet Creation**
**Location:** `supabase/functions/create-group/index.ts`

**Issue:** When a group is created, no `group_wallets` record is created. This will cause issues when trying to track payments.

**Fix needed:** Create a `group_wallets` record with initial balance 0 when group is created.

---

### 8. **Missing Owner as Group Member**
**Location:** `supabase/functions/create-group/index.ts`

**Issue:** When creating a group, the owner is not automatically added to `group_members` table. This means owner won't appear in member lists.

**Fix needed:** Insert owner into `group_members` with role 'owner' after group creation.

---

### 9. **Missing Group Code Generation**
**Location:** `supabase/functions/create-group/index.ts`

**Issue:** Group is created without a `group_code` field, but `joinGroup` function in `lib/api.ts` queries by `group_code`. This will prevent users from joining groups.

**Fix needed:** Generate unique `group_code` when creating group.

---

### 10. **Missing Authentication in process-payment**
**Location:** `supabase/functions/process-payment/index.ts:14-18`

**Issue:** Uses `SUPABASE_SERVICE_ROLE_KEY` but doesn't verify the user's JWT token. Should extract and verify the Authorization header.

**Fix needed:** Add authentication check like in other edge functions.

---

### 11. **Missing Current Members Count Update**
**Location:** `supabase/functions/create-group/index.ts` and joinGroup in `lib/api.ts`

**Issue:** When members join a group, `groups.current_members` count is not incremented. This will cause issues with the `max_members` check.

**Fix needed:** Update `current_members` count when members join.

---

## 🟡 Medium Priority Issues

### 12. **Recharge API Using Mock Data**
**Location:** `app/api/recharge+api.ts`

**Issue:** 
- POST endpoint simulates recharge instead of calling real API
- GET endpoint returns hardcoded mock data instead of querying database
- No actual integration with recharge service provider

**Fix needed:** Integrate with actual recharge API or use Supabase function properly.

---

### 13. **WhatsApp API Not Actually Sending Messages**
**Location:** `app/api/whatsapp+api.ts:19-23`

**Issue:** Just logs to console instead of actually sending WhatsApp messages.

**Fix needed:** Integrate with actual WhatsApp Business API (which is done in Supabase function, so maybe remove this local route or use Supabase function instead).

---

### 14. **Missing Input Validation**
**Location:** All API endpoints

**Issue:** No validation for:
- Required fields
- Data types
- Range/format validation (e.g., email format, phone number format, amount > 0)
- SQL injection protection (though Supabase handles this)

**Fix needed:** Add validation middleware or validate inputs in each endpoint.

---

### 15. **Missing Error Logging**
**Location:** All API endpoints

**Issue:** Errors are caught but not logged properly. Makes debugging difficult.

**Fix needed:** Add proper error logging (console.error, or logging service).

---

### 16. **Deprecated String Method**
**Location:** `supabase/functions/process-recharge/index.ts:40`

**Issue:** Uses deprecated `.substr()` method. Should use `.substring()` or `.slice()`.

```typescript
// Current:
Math.random().toString(36).substr(2, 5)

// Should be:
Math.random().toString(36).substring(2, 7)
// or
Math.random().toString(36).slice(2, 7)
```

---

### 17. **Missing RPC Function Error Handling**
**Location:** Multiple edge functions

**Issue:** Calls to `supabase.rpc('create_system_message')` and `supabase.rpc('notify_group_members')` don't check for errors. If these RPCs don't exist, silent failures occur.

**Fix needed:** Check for errors and handle gracefully (log but don't fail the entire operation).

---

### 18. **Password Stored in Plain Text**
**Location:** `supabase/functions/withdraw-funds/index.ts:92`

**Issue:** Subscription credentials password is stored in plain text. Comment says "Encrypt in production" but it's not encrypted.

**Fix needed:** Encrypt passwords before storing in database.

---

### 19. **Missing Transaction ID Update in Recharge**
**Location:** `supabase/functions/process-recharge/index.ts:96-99`

**Issue:** Transaction status is updated but transaction_id might not be returned in the response properly.

**Fix needed:** Ensure transaction data is properly returned.

---

### 20. **Missing Wallet Creation Check**
**Location:** `supabase/functions/withdraw-funds/index.ts:54-65`

**Issue:** Checks if wallet exists but doesn't create one if missing. Should either create wallet or return better error message.

---

### 21. **Missing Group Wallet Balance Update in process-payment**
**Location:** `supabase/functions/process-payment/index.ts:95-108`

**Issue:** Checks wallet balance but doesn't update it after payment. Wallet balance should increase by payment amount.

**Fix needed:**
```typescript
// After payment creation, update wallet:
await supabase
  .from('group_wallets')
  .update({ 
    available_balance: supabase.raw('available_balance + ?', [amount]),
    total_collected: supabase.raw('total_collected + ?', [amount])
  })
  .eq('group_id', groupId)
```

---

## 🔵 Low Priority / Code Quality Issues

### 22. **Inconsistent Error Response Format**
**Location:** All endpoints

**Issue:** Some return `{ success: false, error: 'message' }`, others return `{ error: 'message' }`. Should be consistent.

---

### 23. **Missing TypeScript Types**
**Location:** `lib/api.ts`

**Issue:** Functions use `any` types. Should define proper interfaces/types.

---

### 24. **Missing Request Method Validation**
**Location:** Supabase edge functions

**Issue:** Only `process-payment` doesn't validate request method. Others check for OPTIONS but not for allowed methods (POST, GET, etc.).

---

### 25. **Missing Rate Limiting**
**Location:** All endpoints

**Issue:** No rate limiting implemented. Vulnerable to abuse.

---

### 26. **CORS Headers Too Permissive**
**Location:** All Supabase edge functions

**Issue:** Uses `'Access-Control-Allow-Origin': '*'` which allows any origin. Should restrict to specific domains in production.

---

### 27. **Missing Request Body Validation**
**Location:** All endpoints

**Issue:** No validation that request body exists or is valid JSON before parsing.

---

### 28. **Missing Group Code Uniqueness Check**
**Location:** `supabase/functions/create-group/index.ts` (when implementing group_code generation)

**Issue:** Need to ensure generated group_code is unique. Should check database before assigning.

---

### 29. **Hardcoded Recharge API URL**
**Location:** `supabase/functions/process-recharge/index.ts:68`

**Issue:** Hardcoded URL `https://api.recharge-provider.com/recharge`. Should be configurable via environment variable.

---

### 30. **Missing Error Details in Responses**
**Location:** Multiple endpoints

**Issue:** Error messages are generic. Should include more details for debugging (while being careful not to expose sensitive info).

---

## Summary

**Critical Issues:** 4
**High Priority Issues:** 7
**Medium Priority Issues:** 10
**Low Priority Issues:** 9

**Total Issues:** 30

---

## Recommended Fix Priority

1. **First:** Fix Critical Issues (#1-4) - These break basic functionality
2. **Second:** Fix High Priority Issues (#5-11) - These cause data inconsistency and security issues
3. **Third:** Fix Medium Priority Issues (#12-21) - These affect reliability and best practices
4. **Fourth:** Fix Low Priority Issues (#22-30) - These improve code quality and maintainability

