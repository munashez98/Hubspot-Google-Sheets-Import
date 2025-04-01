# Hubspot-Google-Sheets-Import
A script for Google Apps Script to import your HubSpot deals

# What you will need:
1. An active HubSpot account
2. [An OAuth token for Hubspot](https://developers.hubspot.com/docs/guides/apps/authentication/working-with-oauth)
3. A Google Sheet document with [Scripts enabled](https://developers.google.com/workspace/sheets/api/quickstart/apps-script)
4. To create a HubSpot [Private App](https://developers.hubspot.com/docs/guides/apps/private-apps/overview#create-a-private-app) with the scopes:

   - crm.objects.contacts.read
   - crm.objects.custom.read
   - crm.objects.custom.write
   - crm.objects.deals.read
   - crm.objects.deals.write

# What you should know:
- This script is designed to run upon opening, you can disable it by removing lines 5 and 104 which should disable the function meaning you'll have to run it manually.
- The script might take a couple of seconds to run depending on the amount of data
  
