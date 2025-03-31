const { google } = require('googleapis');

async function testCalendarAccess() {
  try {
    // Initialize auth client
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    
    // Initialize calendar client
    const calendar = google.calendar({ version: 'v3', auth });
    
    console.log('Attempting to access Google Calendar...');
    
    // Test listing events
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    console.log('Calendar access successful! ✅');
    console.log(`Found ${response.data.items.length} upcoming events:`);
    
    // List the events
    if (response.data.items.length) {
      response.data.items.forEach(event => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
    
    // Test inserting and deleting a test event
    console.log('\nTesting event creation...');
    
    // Create a test event
    const testEvent = {
      summary: 'Test Event - PLEASE DELETE',
      description: 'This is a test event created by the script to verify calendar access.',
      start: {
        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour later
        timeZone: 'Europe/Berlin',
      },
    };
    
    const createdEvent = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: testEvent,
    });
    
    console.log(`Test event created successfully with ID: ${createdEvent.data.id}`);
    
    // Delete the test event
    console.log('Cleaning up by deleting test event...');
    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: createdEvent.data.id,
    });
    
    console.log('Test event deleted successfully.');
    console.log('\nAll tests passed! Your Google Calendar integration is working correctly. ✅');
    
  } catch (error) {
    console.error('❌ Error accessing Google Calendar:');
    console.error('-'.repeat(50));
    
    if (error.code === 401) {
      console.error('Authentication failed. Check your credentials:');
      console.error('- GOOGLE_CLIENT_EMAIL is set correctly');
      console.error('- GOOGLE_PRIVATE_KEY is properly formatted (with newlines)');
      console.error('- Ensure your service account has access to the calendar');
    } else if (error.code === 404) {
      console.error('Calendar not found. Check:');
      console.error('- GOOGLE_CALENDAR_ID is correct');
      console.error('- The calendar exists and is accessible to your service account');
    } else if (error.code === 403) {
      console.error('Permission denied. Check:');
      console.error('- Your service account has proper permissions');
      console.error('- The calendar has been shared with your service account email');
    } else {
      console.error('Unexpected error:');
      console.error(error.message);
      console.error('\nFull error details:');
      console.error(JSON.stringify(error, null, 2));
    }
    
    console.error('-'.repeat(50));
    console.error('\nTIP: If you need to share your calendar with the service account, go to');
    console.error('your Google Calendar, find Calendar Settings, and share with:');
    console.error(process.env.GOOGLE_CLIENT_EMAIL || 'YOUR_SERVICE_ACCOUNT_EMAIL');
  }
}

// Run the test
testCalendarAccess(); 