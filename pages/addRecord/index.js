import i18n from '../i18n/index'
const iAPI = i18n.api
const eventEmitter = require('../../util/events');

const {getAuthToken} = require('../../util/util');

const tokenData = getAuthToken();

Page({
  data: {
    name: '',
    attempts: '',
    text: '',
  },

  handleInput: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  submitRecord() {
    const { name, attempts, text } = this.data;
  
    // Validate inputs
    console.log(`Inputs - Name: ${name}, Attempts: ${attempts}, Text: ${text}`);
    if (!name || !attempts || !text) {
      wx.showToast({
        title: 'Please fill all fields',
        icon: 'none',
      });
      return;
    }
  
    const dataPayload = {
      records: [
        {
          fields: {
            Name: name,
            Attempts: parseInt(attempts, 10),
            Text: text,
            Status: "Created",
          },
        },
      ],
    };
  
    console.log(`Payload: ${JSON.stringify(dataPayload)}`);
  
    wx.request({
      url: "https://open.larksuite.com/open-apis/bitable/v1/apps/LAJOb2ldbayRZxsVkg8lLjXugie/tables/tblKCbqgoxD8H5UW/records/batch_create",
      method: 'POST',
      header: {
        'Authorization': `Bearer ${tokenData}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      data: dataPayload,
      success: (res) => {
        console.log('API Success Response:', res);
        if (res.data.code === 0) {
          eventEmitter.emit('recordAdded');
          wx.showToast({
            title: 'Record created successfully!',
            icon: 'success',
          });
          wx.navigateBack();
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
  }  
});
