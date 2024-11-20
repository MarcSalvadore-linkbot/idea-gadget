//retrieve the token from local storage
const getAuthToken = () => {
  let result = tt.getStorageSync("authToken") ;
  console.log(`Retrieved token: ${result ? result : 'No token found'}`);
  return result;
};

//save the token to local storage
const saveAuthToken = (token) => {
  console.log("Saving token...");

  const tokenData = {
    token
  };

  tt.setStorageSync('authToken', JSON.stringify(tokenData)); //save
  console.log('Token successfully saved');
};

const login = async () => {
  return new Promise ((resolve, reject) => {
    tt.request({
      url: "https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal",
      header: {
        'content-type' : 'application/json'
      },
      method: 'POST',
      data: {
        app_id: 'cli_a79d57693538502f',
        app_secret: '4BHANDGXeGfL9DJXKLJeGcy8Dd6MDl7M'
      },
      success: (res) => {
        console.log('Token request response:', res); //log the response
        if(res.statusCode === 200 && res.data.tenant_access_token) {
          console.log('Token successfully received:', res.data.tenant_access_token);
          saveAuthToken(res.data.tenant_access_token); //save the token to local storage
          resolve(res.data.tenant_access_token); //resolve with the token
        } else {
          console.error('Login failed with response:', res);
          reject("Login failed: " + (res.data.message || 'No token returned'));
        }
      },
      fail: (error) => {
        console.error('Request failed:', JSON.stringify(error)); //log the full error object
        reject('Request failed: ' + JSON.stringify(error)); //reject with full error details
      }
    });
  });
};

//function to check for the token, and log in if not found
const checkToken = async () => {
  console.log("Checking for existing token...");
  const token = getAuthToken(); //retrieve the token
  if(!token) {
    console.log("No token found, logging in...");
    //if no token is found, log in and get a new token
    return await login();
  }
  console.log("Token found:", token);
  //if token exist, return it
  return token;
};

module.exports = {
  checkToken,
  login,
  getAuthToken
};