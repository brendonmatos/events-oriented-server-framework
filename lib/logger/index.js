const shoio = require('../../index')

const app = new shoio()

app.on('request:logger', (requestData, dispatch) => {
    console.log("Request in path", requestData.url, "at:", new Date())
    dispatch('request', requestData);
})

module.exports = app;