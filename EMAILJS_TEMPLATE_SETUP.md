# EmailJS Template Setup Guide

## Your Public Key
**Public Key:** `o1TL0rKhww3ZFclTv`

## Step 1: Create Email Service

1. Go to https://dashboard.emailjs.com/admin/integration
2. Click **"Add New Service"**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Connect your email account
5. **Name the service:** `service_gamerleech` (IMPORTANT: Must match exactly)
6. Save the service

## Step 2: Create Template 1 - Business Notification (`template_payment`)

1. Go to **Email Templates** → **Create New Template**
2. **Template Name:** `template_payment`
3. **Service:** Select `service_gamerleech`
4. **To Email:** `gamerleech2@gmail.com`
5. **Subject:** `New Order - {{order_id}}`

### Template Content:

```
New Payment Request

Order ID: {{order_id}}
Customer Email: {{customer_email}}
Total Amount: {{total_amount}}
Payment Method: {{payment_method}}
Wallet Address: {{wallet_address}}

Items Ordered:
{{cart_items}}

Please process this payment request.

---
This is an automated notification from GamerLeech Website.
```

### Template Variables (make sure these are available):
- `{{order_id}}`
- `{{customer_email}}`
- `{{total_amount}}`
- `{{payment_method}}`
- `{{wallet_address}}`
- `{{cart_items}}`
- `{{from_name}}` (optional)
- `{{from_email}}` (optional)

## Step 3: Create Template 2 - Customer Confirmation (`template_order_confirmation`)

1. Go to **Email Templates** → **Create New Template**
2. **Template Name:** `template_order_confirmation`
3. **Service:** Select `service_gamerleech`
4. **To Email:** `{{to_email}}` (this will be the customer's email)
5. **Subject:** `Order Confirmation - {{order_id}}`

### Template Content:

```
Thank you for your order with GamerLeech!

Order ID: {{order_id}}
Total Amount: {{total_amount}}
Payment Method: {{payment_method}}

Please send payment to the following address:
{{wallet_address}}

Items Ordered:
{{cart_items}}

We will process your order once payment is confirmed.

If you have any questions, please contact us.

Thank you,
GamerLeech Team
```

### Template Variables (make sure these are available):
- `{{to_email}}`
- `{{order_id}}`
- `{{total_amount}}`
- `{{payment_method}}`
- `{{wallet_address}}`
- `{{cart_items}}`
- `{{from_name}}` (optional)
- `{{message}}` (optional)

## Step 4: Verify Configuration

After creating both templates:
1. Make sure the service name is exactly: `service_gamerleech`
2. Make sure template names are exactly: `template_payment` and `template_order_confirmation`
3. Test the templates by sending a test email from the EmailJS dashboard

## Important Notes:

- The service ID and template IDs are case-sensitive
- Make sure all template variables match exactly what's in the code
- The business email (`gamerleech2@gmail.com`) is hardcoded in the code
- Customer emails will use the email address entered in the checkout form

## Testing

Once configured, test by:
1. Going to your checkout page
2. Adding items to cart
3. Entering an email address
4. Completing the checkout
5. Check both email inboxes (business and customer) for the emails








