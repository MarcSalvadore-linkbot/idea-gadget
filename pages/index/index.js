import i18n from '../i18n/index'
const iAPI = i18n.api

const {getAuthToken} = require('../../util/util');

const tokenData = getAuthToken();
const tokenValue = JSON.parse(tokenData).token;

Page({
  data: {
    activityLog: [],
    totalRecords: 0
  },

  onLoad: function () {
    this.fetchActivityLog();
  },

  // Fetch data function with Authorization Header
  fetchActivityLog: function () {
    const apiUrl = 'https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records';

    // Perform the API call
    wx.request({
      url: apiUrl,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${tokenValue}`, // Authorization header with Bearer token
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data && res.data.code === 0) {
          const items = res.data.data.items.map(item => ({
            id: item.id,
            record_id: item.record_id,
            name: item.fields.Name,
            attempts: item.fields.Attempts,
            status: item.fields.Status,
            text: item.fields.Text
          }));

          // Update the activity log data in the state
          this.setData({
            activityLog: items,
            totalRecords: res.data.data.total
          });
        } else {
          console.error('Failed to fetch data:', res.data.msg);
        }
      },
      fail: (err) => {
        console.error('Request failed:', err);
      }
    });
  },

  // Delete record function
  deleteRecord: function (e) {
    const recordId = e.currentTarget.dataset.id;
    const apiUrl = `https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records/${recordId}`;

    wx.request({
      url: apiUrl,
      method: 'DELETE',
      header: {
        'Authorization': `Bearer ${tokenValue}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      success: (res) => {
        if (res.data.code === 0) {
          // Remove the deleted record from the activityLog array in data
          const updatedActivityLog = this.data.activityLog.filter(item => item.record_id !== recordId);
          this.setData({
            activityLog: updatedActivityLog,
            totalRecords: this.data.totalRecords - 1
          });
        } else {
          console.error('Failed to delete record:', res.data.msg);
        }
      },
      fail: (err) => {
        console.error('Delete request failed:', err);
      }
    });
    console.log(`Attempting to delete record with ID: ${recordId}, URL: ${apiUrl}`);
  },
  
  gotoPage({ currentTarget: { dataset: { url } } }) {
    if (url === 'pages/tabbar/tabbar') {
      this.setData({
        isSetTabBarPage: true
      })
      return;
    }
    tt.navigateTo({
      url
    })
  },
  leaveSetTabBarPage() {
    this.setData({
      isSetTabBarPage: false
    });
  }
})
