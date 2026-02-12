// test-login.js

const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post(
      'https://flight.yonashalefom.com/api/v1/public/auth/login/credential',
      {
        "email": "admin@mail.com",
        "password": "Marshal@1111"
      },
      {
        headers: {
          'x-api-key': 'v8VB0yY887lMpTA2VJMV:zeZbtGTugBTn3Qd5UXtSZBwt7gn3bg',
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("✅ SUCCESS:");
    console.log(response.data);

  } catch (error) {
    console.log("❌ ERROR:");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

testLogin();

