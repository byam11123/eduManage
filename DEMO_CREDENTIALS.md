# Demo Credentials

## 📋 Login Information

```
Email: demo@coaching.com
Password: Demo123!@#
```

## 🚀 Quick Start

1. Go to the application URL
2. Enter the credentials above
3. Click "Sign In"
4. You'll be redirected to the Dashboard
5. Click "Organization Settings" to configure your organization

## ✨ Demo Account Features

- ✅ Pre-verified email (no OTP verification needed)
- ✅ Full Name: Demo Coaching Center
- ✅ Ready to use all features

## 🎯 What You Can Do

1. **View Dashboard** - See your profile, email, and join date
2. **Organization Settings** - Create or update your organization
   - Upload logo
   - Set organization name
   - Add contact information
   - Provide address details
   - Select industry and company size
3. **Logout** - Sign out securely when done

## 🔄 Reset Demo User

To reset the demo user, you can:

```bash
# Delete the demo user from database
bun run db:reset

# Then create a new demo user
bun run demo
```

## 📝 Development Notes

- This demo user is for **development and testing only**
- Email sending is disabled (no Resend API key required)
- All authentication features work normally with this demo account
