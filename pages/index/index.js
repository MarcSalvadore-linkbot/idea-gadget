const eventEmitter = require('../../util/events');
const { checkToken, getAuthToken } = require('../../util/util');

Page({
  data: {
    activityLog: [],
    totalRecords: 0,
    token: null, // Store the token here
  },

  navigateToAddRecord() {
    wx.navigateTo({
      url: '/pages/addRecord/index',
    });
  },

  navigateToUpdateRecord(e) {
    const recordId = e.currentTarget.dataset.id; // Get record ID from button's data
    const record = this.data.activityLog.find(item => item.record_id === recordId); // Find the full record details
  
    if (record) {
      wx.navigateTo({
        url: `/pages/updateRecord/index?id=${record.record_id}&name=${record.name}&attempts=${record.attempts}&text=${record.text}`,
      });
    } else {
      console.error('Record not found.');
    }
  },

  onLoad: async function () {
    console.log('Page Loaded');

    // Ensure the token is retrieved or initialized before fetching activity logs
    try {
      const token = await checkToken(); // Ensure the token is available
      console.log('Token retrieved in onLoad:', token);

      this.setData({token}); // Store the token in the page data
      this.fetchActivityLog();

      // Listen for the "recordAdded" and "recordUpdated" event
      eventEmitter.on('recordAdded', this.fetchActivityLog.bind(this));
      eventEmitter.on('recordUpdated', this.fetchActivityLog.bind(this));
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  },

  // Fetch data function with Authorization Header
  fetchActivityLog: function () {
    if (!this.data.token) {
      console.error('Token is not available, cannot fetch activity log.');
      return;
    }

    const apiUrl = 'https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records';

    // Perform the API call
    wx.request({
      url: apiUrl,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${this.data.token}`, // Authorization header with Bearer token
        'Content-Type': 'application/json',
      },
      success: (res) => {
        if (res.data && res.data.code === 0) {
          const items = res.data.data.items.map((item) => ({
            id: item.id,
            record_id: item.record_id,
            name: item.fields.Name,
            attempts: item.fields.Attempts,
            status: item.fields.Status,
            text: item.fields.Text,
          }));

          // Update the activity log data in the state
          this.setData({
            activityLog: items,
            totalRecords: res.data.data.total,
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

  // Delete record function
  deleteRecord: function (e) {
    const recordId = e.currentTarget.dataset.id;

    if (!this.data.token) {
      console.error('Token is not available, cannot delete record.');
      return;
    }

    const apiUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records/${recordId}`;

    wx.request({
      url: apiUrl,
      method: 'DELETE',
      header: {
        'Authorization': `Bearer ${this.data.token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      success: (res) => {
        if (res.data.code === 0) {
          // Remove the deleted record from the activityLog array in data
          const updatedActivityLog = this.data.activityLog.filter((item) => item.record_id !== recordId);
          this.setData({
            activityLog: updatedActivityLog,
            totalRecords: this.data.totalRecords - 1,
          });
        } else {
          console.error('Failed to delete record:', res.data.msg);
        }
      },
      fail: (err) => {
        console.error('Delete request failed:', err);
      },
    });
    console.log(`Attempting to delete record with ID: ${recordId}, URL: ${apiUrl}`);
  },

  gotoPage({ currentTarget: { dataset: { url } } }) {
    if (url === '/pages/tabbar/tabbar') {
      this.setData({
        isSetTabBarPage: true,
      });
      return;
    }
    tt.navigateTo({
      url,
    });
  },

  leaveSetTabBarPage() {
    this.setData({
      isSetTabBarPage: false,
    });
  },
});
