# Deployment Guide: WhatsApp Sales & Inventory Tracker

This guide covers deploying the application to Render.com, the recommended hosting platform.

## Prerequisites

- GitHub account with the repository pushed
- Twilio account with WhatsApp Business API access
- Render.com account

## Step 1: Prepare Your GitHub Repository

1. Ensure your repository includes:
   - All source code files (`index.js`, `db.js`, `commands.js`)
   - `package.json` with dependencies
   - `.gitignore` (already configured to exclude `.env` and `database.sqlite`)
   - `README.md` with setup instructions
   - `.env.example` as template

2. Commit and push everything except `.env`:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

## Step 2: Set Up Twilio WhatsApp

### For WhatsApp Sandbox (Testing):
1. Go to [Twilio Console](https://console.twilio.com/)
2. Select "Messaging" → "WhatsApp" → "Sandbox"
3. Confirm your phone number to join the sandbox
4. Note your sandbox number (e.g., `+14155238886`)

### For Production:
1. Request WhatsApp Business API access
2. Verify your business phone number
3. Use your verified number instead

## Step 3: Deploy to Render.com

### Create a New Web Service:

1. **Sign in to Render.com**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your code

3. **Configure Build Settings**
   - **Name**: `whatsapp-sales-tracker` (or your choice)
   - **Environment**: Node.js
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Configure Environment Variables**
   - Add the following environment variables in the Render dashboard:

   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_FROM_WHATSAPP=whatsapp:+14155238886
   PORT=3000
   ```

   Replace values with your Twilio credentials.

5. **Deploy**
   - Click "Deploy Web Service"
   - Wait for deployment to complete (typically 2-3 minutes)
   - Note your Render URL (e.g., `https://whatsapp-sales-tracker.onrender.com`)

## Step 4: Configure Twilio Webhook

1. **In Twilio Console**:
   - Go to WhatsApp → Sandbox (or your WhatsApp Business number)
   - Find the "When a message comes in" webhook URL field
   - Set it to: `https://your-render-url.onrender.com/whatsapp/webhook`
   - Method: POST
   - Save

2. **Test the Webhook**:
   - Send a test message from your WhatsApp to the sandbox number
   - You should receive a response from your application

## Step 5: Monitor and Test

### Monitor Logs:
- In Render dashboard, select your service
- Click "Logs" to view real-time application logs

### Test Commands:
Send these messages via WhatsApp to your bot number:

1. **Help**
   ```
   Help
   ```

2. **Add Product**
   ```
   AddProduct Sugar 100
   ```

3. **Check Stock**
   ```
   Stock
   ```

4. **Record Sale**
   ```
   Sold Sugar 5 2000
   ```

5. **Get Summary**
   ```
   Summary
   ```

## Important Notes

### Database Persistence
SQLite uses a local file (`database.sqlite`) that **will be deleted** when:
- Render restarts your service
- You redeploy your application
- The service goes to sleep (on free tier)

**Solutions**:
1. Upgrade to paid plan for persistent disk storage
2. Implement automatic database backup to cloud storage
3. Use Render's PostgreSQL database instead

### Performance Considerations
- **Free Tier**: Service spins down after 15 minutes of inactivity
  - First request after inactivity takes 30-60 seconds to respond
  - Plan accordingly for user experience

- **Paid Tier**: Always running, better for production

### Scaling
- Current implementation supports multi-tenant usage
- Each shop is identified by phone number
- Database queries are indexed by shop_phone for efficiency

## Troubleshooting

### "Twilio credentials not configured"
- Verify `TWILIO_ACCOUNT_SID` starts with "AC"
- Check for typos in environment variables
- Render might have space/newline issues - copy from dashboard carefully

### "Webhook not responding"
- Check Render logs for errors
- Verify webhook URL is correct in Twilio console
- Test with cURL:
  ```bash
  curl -X POST https://your-url.onrender.com/whatsapp/webhook \
    -d "From=whatsapp:+256700000000&Body=Help"
  ```

### "No messages received"
- Verify Twilio webhook is configured
- Confirm method is POST
- Check that phone number is registered with Twilio
- Review Render logs for incoming requests

## Database Backup Strategy

For production, implement regular backups:

```bash
# Manual backup (local development)
cp database.sqlite database-backup-$(date +%Y%m%d).sqlite

# Automated (use Render's PostgreSQL)
# See Render docs for connecting PostgreSQL database
```

## Monitoring in Production

Recommended setup:
1. Enable error logging
2. Set up alerts for failed deployments
3. Monitor Twilio message logs in Twilio console
4. Use Render's error notification features

## Updating the Application

To deploy updates:

1. Make changes and test locally:
   ```bash
   npm test
   npm start
   ```

2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update: description"
   git push
   ```

3. **Option A**: Auto-deploy from Render
   - Render auto-deploys on push to main branch (if enabled)
   - Check Render dashboard for build status

4. **Option B**: Manual deploy
   - Go to Render dashboard
   - Click "Manual Deploy" on your service
   - Select branch and deploy

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to repository
   - Use Render's environment variables feature
   - Rotate Twilio credentials periodically

2. **Database**
   - Consider using PostgreSQL for sensitive data
   - Implement backups for data recovery
   - Monitor database growth

3. **API Security**
   - Webhook is open to all requests (Twilio handles auth)
   - Consider adding request validation
   - Rate limit if needed

## Costs

**Twilio**:
- WhatsApp messages: ~$0.003-0.01 per message (varies by direction)
- Monthly minimum: Check current pricing

**Render.com**:
- Free tier: Limited, service sleeps after inactivity
- Starter: $7/month (minimum, always running)
- Professional: $12/month+ (advanced features)

## Support

- **Twilio Docs**: https://www.twilio.com/docs/whatsapp
- **Render Docs**: https://render.com/docs
- **Application Issues**: Check README.md and test files for examples

## Next Steps

1. Set up automated daily backups
2. Implement error monitoring (Sentry, LogRocket, etc.)
3. Plan migration to PostgreSQL for production data
4. Set up CI/CD pipeline for automated testing on push
