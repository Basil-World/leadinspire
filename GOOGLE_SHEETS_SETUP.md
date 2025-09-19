# Google Sheets API Integration Setup

This guide will help you set up Google Sheets API integration for the Inspire Pioneer Leaderboard application.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. A Google Sheets document with your leaderboard data

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to Google Sheets API for security

## Step 3: Prepare Your Google Sheet

Create a Google Sheet with the following structure:

### Sheet 1: "Plus One"

| Name       | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Total Score |
| ---------- | ------ | ------ | ------ | ------ | ------ | ----------- |
| John Doe   | 95     | 88     | 92     | 97     | 85     | 457         |
| Jane Smith | 91     | 94     | 89     | 88     | 90     | 452         |

### Sheet 2: "Plus Two"

| Name          | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Total Score |
| ------------- | ------ | ------ | ------ | ------ | ------ | ----------- |
| Alice Johnson | 98     | 95     | 94     | 96     | 92     | 475         |
| Bob Wilson    | 94     | 97     | 91     | 93     | 95     | 470         |

**Important Notes:**

- The first row should contain headers
- Names should be in column A
- Weekly scores should be in columns B-F
- Total scores should be in column G
- Make sure your sheet is publicly readable or shared with the service account

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env` in your project root
2. Fill in the required values:

```env
# Google Sheets API Configuration
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SHEET_ID=your_google_sheet_id_here
VITE_GOOGLE_SHEET_PLUS_ONE_RANGE=Plus One!A1:G20
VITE_GOOGLE_SHEET_PLUS_TWO_RANGE=Plus Two!A1:G20
```

### How to get your Google Sheet ID:

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
3. Copy the `SHEET_ID_HERE` part

## Step 5: Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. The application should now load data from your Google Sheet
3. Use the refresh button to sync with the latest data
4. Export functionality will work with the live data

## Troubleshooting

### Common Issues:

1. **"Google Sheets Not Configured" Error**

   - Check that all environment variables are set correctly
   - Restart your development server after adding environment variables

2. **"Failed to fetch data from Google Sheets" Error**

   - Verify your API key is correct
   - Check that the Google Sheets API is enabled
   - Ensure your sheet ID is correct
   - Make sure your sheet is publicly readable

3. **"No data found" Error**

   - Check that your sheet has data in the specified range
   - Verify the range format (e.g., "Plus One!A1:G20")
   - Ensure the sheet names match exactly (case-sensitive)

4. **CORS Errors**
   - This is normal for development. The Google Sheets API handles CORS properly in production.

### Security Considerations:

- Never commit your `.env` file to version control
- Consider using a service account for production
- Restrict your API key to specific APIs and domains
- Use environment-specific configuration for different deployments

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform
2. Consider using a service account for better security
3. Implement proper error handling and logging
4. Add rate limiting to prevent API quota exhaustion

## Support

If you encounter issues:

1. Check the browser console for detailed error messages
2. Verify your Google Sheets API quota and usage
3. Ensure your sheet structure matches the expected format
4. Test with a simple sheet first to isolate issues
