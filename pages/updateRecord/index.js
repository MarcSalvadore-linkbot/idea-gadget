import i18n from '../i18n/index'
const iAPI = i18n.api
const eventEmitter = require('../../util/events');

const { getAuthToken } = require('../../util/util');

const tokenData = getAuthToken();
const tokenValue = JSON.parse(tokenData).token;

Page({
  data: {
    recordId: '', // Store the record ID
    name: '',
    attempts: '',
    text: '',
  },

  onLoad(options) {
    const { id, name, attempts, text } = options; // Get data passed from the previous page
    this.setData({
      recordId: id,
      name,
      attempts,
      text,
    });
  },

  handleInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [field]: event.detail.value });
  },

  submitRecord() {
    const { recordId, name, attempts, text } = this.data;

    // Validate inputs
    if (!name || !attempts || !text) {
      wx.showToast({
        title: 'Please fill all fields',
        icon: 'none',
      });
      return;
    }

    // Prepare data payload
    const dataPayload = {
      records: [
        {
          id: recordId, // Include the record ID for updating
          fields: {
            Name: name,
            Attempts: parseInt(attempts, 10), // Ensure it's an integer
            Text: text,
            Status: "Updated" // Mark as updated
          },
        },
      ],
    };

    // Send the update request
    wx.request({
      url: `https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records/batch_update`, // Use the batch_update endpoint
      method: 'POST',
      header: {
        'Authorization': `Bearer ${tokenValue}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      data: dataPayload,
      success: (res) => {
        if (res.data.code === 0) {
          eventEmitter.emit('recordUpdated');
          wx.showToast({
            title: 'Record updated successfully!',
            icon: 'success',
          });
          wx.navigateBack(); // Navigate back to the previous page
        } else {
          console.error('Failed to update record:', res.data.msg);
          wx.showToast({
            title: 'Failed to update record',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        console.error('Update request failed:', err);
        wx.showToast({
          title: 'Request failed',
          icon: 'none',
        });
      },
    });

    console.log(`Attempting to update record with data: ${JSON.stringify(dataPayload)}`);
  },
});
