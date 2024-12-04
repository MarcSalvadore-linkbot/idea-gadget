import i18n from '../i18n/index'
const iAPI = i18n.api
const eventEmitter = require('../../util/events');

const {getAuthToken} = require('../../util/util');

const tokenData = getAuthToken();

// Helper function to format date
function formatDate(date) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0'); // Day
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month (0-based)
  const year = d.getFullYear(); // Year
  const hours = d.getHours().toString().padStart(2, '0'); // Hours
  const minutes = d.getMinutes().toString().padStart(2, '0'); // Minutes

  return `${day}/${month}/${year} ${hours}:${minutes}`; // Format as day/month/year time
}

// Page({
//   data: {
//     groupedLogs: [], // Store grouped logs
//   },

//   // Fetch data function with Authorization Header
//   fetchActivityLog: function () {
//     if (!tokenData) {
//       console.error('Token is not available, cannot fetch activity log.');
//       return;
//     }

//     const apiUrl = 'https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblr4PYrbuMdIe3P/records';

//     // Perform the API call
//     wx.request({
//       url: apiUrl,
//       method: 'GET',
//       header: {
//         'Authorization': `Bearer ${tokenData}`, // Authorization header with Bearer token
//         'Content-Type': 'application/json',
//       },
//       success: (res) => {
//         if (res.data && res.data.code === 0) {
//           const items = res.data.data.items.map((item) => ({
//             id: item.id,
//             record_id: item.record_id,
//             name: item.fields.Name,
//             date: formatDate(item.fields.Date), // Format the date
//             action: item.fields.Action,
//           }));

//           // Group logs by date
//           const grouped = items.reduce((acc, item) => {
//             const day = item.date.split(' ')[0]; // Extract the day (day/month/year)
//             if (!acc[day]) {
//               acc[day] = []; // If no logs for this day, create a new array
//             }
//             acc[day].push(item); // Push the log to the corresponding day
//             return acc;
//           }, {});

//           // Convert grouped logs to an array
//           const groupedLogs = Object.keys(grouped).map((day) => ({
//             day,
//             logs: grouped[day],
//           }));

//           // Update the activity log data in the state
//           this.setData({
//             groupedLogs, // Set the grouped logs
//           });
//         } else {
//           console.error('Failed to fetch data:', res.data.msg);
//         }
//       },
//       fail: (err) => {
//         console.error('Request failed:', err);
//       },
//     });
//   },
// });

Page({
  data: {
    activityLog: [],
  },

  onLoad() {
    this.fetchActivityLog(); // Call fetchActivityLog when the page loads
  },

  // Fetch data function with Authorization Header
  fetchActivityLog: function () {
    if (!tokenData) {
      console.error('Token is not available, cannot fetch activity log.');
      return;
    }

    const apiUrl = 'https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblr4PYrbuMdIe3P/records';

    // Perform the API call
    wx.request({
      url: apiUrl,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${tokenData}`, // Authorization header with Bearer token
        'Content-Type': 'application/json',
      },
      success: (res) => {
        if (res.data && res.data.code === 0) {
          const items = res.data.data.items.map((item) => ({
            id: item.id,
            record_id: item.record_id,
            name: item.fields.Name,
            date: formatDate(item.fields.Date),
            action: item.fields.Action,
          }));

          // Update the activity log data in the state
          this.setData({
            activityLog: items,
          });
        } else {
          console.error('Failed to fetch data:', res.data.msg);
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
      },
    });
  },
});
