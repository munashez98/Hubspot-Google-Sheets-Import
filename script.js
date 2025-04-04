var HUBSPOT_API_URL = "https://api.hubapi.com/crm/v3/objects/deals"; //Hubspot API to import deals. If you change this you'll need to make a few tweaks
var ACCESS_TOKEN = "";  // Actual OAuth access token from your private app - add between the quotes

// Function to be triggered when the sheet is opened
function onOpen() {
  // Show the loading dialog and run the import function
  var html = HtmlService.createHtmlOutput(`
    <html>
      <head>
        <script>
          function closeDialog() {
            google.script.host.close();
          }
          google.script.run.withSuccessHandler(closeDialog).importDealsFromHubSpot();
        </script>
      </head>
      <body>
        <h3>Generating, please wait...</h3>
      </body>
    </html>
  `);
  
  html.setWidth(300).setHeight(150);
  SpreadsheetApp.getUi().showModalDialog(html, 'Loading');
}

// Function to import deals from HubSpot. Add the propoerties you want
function importDealsFromHubSpot() {
  var properties = [
    "properrt1Name", //add your own
    "prroperty2Name", // add your own
    ""

  ];

  var url = HUBSPOT_API_URL + "?properties=" + properties.join("&properties=") + "&limit=100";
  var allDeals = [];
  var hasNextPage = true;

  while (hasNextPage) {
    try {
      var options = {
        "method": "get",
        "headers": {
          "Authorization": "Bearer " + ACCESS_TOKEN,
          "Content-Type": "application/json"
        }
      };

      var response = UrlFetchApp.fetch(url, options);
      var json = JSON.parse(response.getContentText());

      if (json.results) {
        allDeals = allDeals.concat(json.results);
      }

      if (json.paging && json.paging.next && json.paging.next.after) {
        url = HUBSPOT_API_URL + "?properties=" + properties.join("&properties=") + "&limit=100&after=" + json.paging.next.after;
      } else {
        hasNextPage = false;
      }

    } catch (e) {
      Logger.log("Error fetching deals: " + e.message);
      hasNextPage = false;
    }
  }

  if (allDeals.length > 0) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(""); //Sheet you want the data to be imported to should go here

    if (!sheet) {
      sheet = ss.insertSheet(""); // Sheet you want the data to be imported to should go here
    } else {
      sheet.clear();
    }

    sheet.appendRow(properties.map(function(prop) {
      return prop.replace(/_/g, ' ').toUpperCase();
    }));

    allDeals.forEach(function(deal) {
      var dealData = properties.map(function(property) {
        var value = deal.properties[property];

        if (property === 'closedate' && value) {
          value = new Date(value).toLocaleString();
        }

        return value || "N/A";
      });

      sheet.appendRow(dealData);
    });

    Logger.log("Successfully imported " + allDeals.length + " deals.");
  } else {
    Logger.log("No deals found.");
  }
}
