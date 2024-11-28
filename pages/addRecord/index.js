import i18n from '../i18n/index'
const iAPI = i18n.api
const eventEmitter = require('../../util/events');

const {getAuthToken} = require('../../util/util');

const tokenData = getAuthToken();
const tokenValue = JSON.parse(tokenData).token;

Page({
  data: {
    name: '',
    attempts: '',
    text: '',
  },

  handleInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [field]: event.detail.value });
  },

  submitRecord() {
    const { name, attempts, text } = this.data;

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
          fields: {
            Name: name,
            Attempts: parseInt(attempts, 10), // Ensure it's an integer
            Text: text,
            Status: "Created"
          },
        },
      ],
    };

    // Send the batch_create request
    wx.request({
      url: "https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records/batch_create",
      method: 'POST',
      header: {
        'Authorization': `Bearer ${tokenValue}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      data: dataPayload,
      success: (res) => {
        if (res.data.code === 0) {
          eventEmitter.emit('recordAdded');
          wx.showToast({
            title: 'Record created successfully!',
            icon: 'success',
          });
          wx.navigateBack(); // Navigate back to the previous page
        } else {
          console.error('Failed to create record:', res.data.msg);
          wx.showToast({
            title: 'Failed to create record',
            icon: 'none',
          });
        }
      },
      fail: (err) => {
        console.error('Create request failed:', err);
        wx.showToast({
          title: 'Request failed',
          icon: 'none',
        });
      },
    });

    console.log(`Attempting to create record with data: ${JSON.stringify(dataPayload)}`);
  },
});
