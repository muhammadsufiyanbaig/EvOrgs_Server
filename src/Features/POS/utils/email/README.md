# Email Service Documentation

This directory contains the complete email sending functionality for EvOrgs Server using Nodemailer.

## 📁 File Structure

```
src/
├── Config/email/
│   ├── index.ts          # Email transporter configuration
│   └── templates.ts      # Template utilities
├── Features/POS/utils/email/
│   ├── index.ts          # Main email functions
│   └── test.ts           # Testing utilities
└── .env.email.example    # Environment variables example
```

## 🚀 Quick Start

### 1. Environment Configuration

Copy the example environment file and configure your email settings:

```bash
cp .env.email.example .env.local
```

Edit your `.env` file with your email credentials:

```env
# For Gmail
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_REPLY_TO=support@yourdomain.com
```

### 2. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Select app: Mail, Select device: Other (Custom name)
   - Use the generated 16-character password as `EMAIL_PASS`

### 3. Test Your Configuration

```typescript
import { sendTestEmail } from './Features/POS/utils/email/test';

// Test with your email
await sendTestEmail('your-email@example.com');
```

## 📧 Available Email Functions

### 1. Payment Reminder Email
```typescript
import { sendPaymentReminderEmail } from './Features/POS/utils/email';

await sendPaymentReminderEmail({
  to: 'customer@example.com',
  name: 'John Doe',
  amount: 250.00,
  dueDate: new Date('2024-12-31'),
  description: 'Monthly service fee' // optional
});
```

### 2. Booking Confirmation Email
```typescript
import { sendBookingConfirmationEmail } from './Features/POS/utils/email';

await sendBookingConfirmationEmail({
  to: 'customer@example.com',
  name: 'Jane Smith',
  bookingReference: 'BK-2024-001',
  serviceDate: new Date('2024-12-25'),
  serviceName: 'Wedding Photography',
  amount: 1500.00
});
```

### 3. Invoice Email
```typescript
import { sendInvoiceEmail } from './Features/POS/utils/email';

await sendInvoiceEmail({
  to: 'customer@example.com',
  name: 'Alice Johnson',
  invoiceNumber: 'INV-2024-0001',
  dueDate: new Date('2024-12-31'),
  amount: 2800.00,
  items: [
    {
      description: 'Photography Package',
      quantity: 1,
      unitPrice: 2000.00,
      totalPrice: 2000.00
    },
    {
      description: 'Additional Hours',
      quantity: 8,
      unitPrice: 100.00,
      totalPrice: 800.00
    }
  ]
});
```

### 4. Receipt Email
```typescript
import { sendReceiptEmail } from './Features/POS/utils/email';

await sendReceiptEmail({
  to: 'customer@example.com',
  name: 'Bob Wilson',
  receiptNumber: 'REC-2024-0001',
  paymentDate: new Date(),
  amount: 500.00,
  paymentMethod: 'Credit Card',
  description: 'Advance payment' // optional
});
```

## 🔧 Supported Email Providers

### Gmail (Recommended)
```env
EMAIL_PROVIDER=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Outlook/Hotmail
```env
EMAIL_PROVIDER=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Custom SMTP
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
```

## 🎨 Email Templates

All emails use professional HTML templates with:
- Responsive design
- Consistent branding
- Professional styling
- Fallback plain text versions

### Template Features:
- ✅ HTML and plain text versions
- ✅ Mobile-responsive design
- ✅ Professional styling
- ✅ Dynamic content replacement
- ✅ Structured invoice tables
- ✅ Branded headers and footers

## 🧪 Testing

### Run All Tests
```typescript
import { testAllEmailFunctions } from './Features/POS/utils/email/test';

await testAllEmailFunctions('your-test-email@example.com');
```

### Quick Test
```typescript
import { quickEmailTest } from './Features/POS/utils/email/test';

// Set TEST_EMAIL environment variable first
process.env.TEST_EMAIL = 'your-email@example.com';
await quickEmailTest();
```

## 🔒 Security Best Practices

1. **Use App Passwords**: Never use your main email password
2. **Environment Variables**: Store credentials in environment variables
3. **Email Validation**: Validate email addresses before sending
4. **Rate Limiting**: Implement rate limiting for production use
5. **Error Handling**: Always handle email sending errors gracefully

## 📊 Error Handling

All email functions return `boolean` values:
- `true` = Email sent successfully
- `false` = Email sending failed

Example error handling:
```typescript
const success = await sendPaymentReminderEmail(data);

if (!success) {
  // Handle failure (log, retry, notify admin, etc.)
  console.error('Failed to send payment reminder');
  // Maybe queue for retry or notify support team
}
```

## 🔄 Integration Examples

### With Express Route
```typescript
app.post('/send-invoice', async (req, res) => {
  try {
    const success = await sendInvoiceEmail(req.body);
    res.json({ success, message: success ? 'Invoice sent' : 'Failed to send invoice' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### With GraphQL Resolver
```typescript
const resolvers = {
  Mutation: {
    sendPaymentReminder: async (_, { input }) => {
      const success = await sendPaymentReminderEmail(input);
      return { success, message: success ? 'Reminder sent' : 'Failed to send reminder' };
    }
  }
};
```

### With Background Jobs
```typescript
// Example: Process payment reminders in background
const processPaymentReminders = async () => {
  const overduePayments = await getOverduePayments();
  
  for (const payment of overduePayments) {
    await sendPaymentReminderEmail({
      to: payment.customerEmail,
      name: payment.customerName,
      amount: payment.amount,
      dueDate: payment.dueDate
    });
  }
};

// Call this function when needed, e.g., through API endpoint
// or triggered by business logic
```

## 🚀 Production Considerations

1. **Queue System**: Use a queue system (Bull, Agenda) for high-volume emails
2. **Rate Limiting**: Implement rate limiting to avoid provider limits
3. **Monitoring**: Monitor email delivery rates and failures
4. **Logging**: Log all email activities for debugging
5. **Backup Provider**: Have a backup email provider configured
6. **Unsubscribe**: Implement unsubscribe functionality for marketing emails

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `EMAIL_PROVIDER` | Yes | Email provider type | `gmail`, `outlook`, `smtp` |
| `EMAIL_USER` | Yes | Email username/address | `your-email@gmail.com` |
| `EMAIL_PASS` | Yes | Email password/app password | `your-app-password` |
| `EMAIL_FROM` | No | From address for emails | `noreply@yourdomain.com` |
| `EMAIL_REPLY_TO` | No | Reply-to address | `support@yourdomain.com` |
| `SMTP_HOST` | SMTP only | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP only | SMTP server port | `587` |
| `SMTP_SECURE` | SMTP only | Use SSL/TLS | `false` |
| `TEST_EMAIL` | Testing | Email for testing | `test@example.com` |

## 🛠️ Troubleshooting

### Common Issues:

1. **Authentication Failed**
   - Ensure you're using an app password for Gmail
   - Check username/password are correct
   - Verify 2FA is enabled for Gmail

2. **Connection Timeout**
   - Check SMTP settings
   - Verify network connectivity
   - Try different ports (587, 465, 25)

3. **Emails Not Received**
   - Check spam/junk folders
   - Verify recipient email address
   - Check email provider delivery logs

4. **Template Not Rendering**
   - Verify template data variables
   - Check for missing template placeholders
   - Ensure proper escaping of special characters

### Debug Mode:
Set `NODE_ENV=development` to see detailed logs and debug information.
