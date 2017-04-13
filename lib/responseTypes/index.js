const shoio = require('../../index')
const app = new shoio();


const onResponseEnd = (data, dispatch) => {
    dispatch('response:buffer', new Buffer( data, 'utf8' ) )
    dispatch('response:end')
};

const onResponseSend = (data, dispatch) => {
    dispatch('response:end', data)
}

const onResponseHtml = (htmlCode, dispatch) => {
    dispatch('response:setHeader',['Content-Type', 'text/html'])
    dispatch('response:sendBuffer', htmlCode)
    dispatch('response:end');
}

const onResponseJson = (data, dispatch) => { 
    dispatch('response:sendBuffer',  new Buffer(JSON.stringify(data)) )
    dispatch('response:end')
}

const onResponseError = (error, dispatch) => {
    dispatch( 'response:setHeader', {
        'Content-Length': error.length,
        'Content-Type': 'text/plain' 
    })
    dispatch('response:sendBuffer', new Buffer(error) );
    dispatch('response:end')
}
app.on('response:sendHtml', onResponseHtml)
app.on('response:sendText', onResponseSend)
app.on('response:sendJson', onResponseJson)
app.on('response:sendError', onResponseError)

module.exports = app;