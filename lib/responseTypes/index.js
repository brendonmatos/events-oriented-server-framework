const shoio = require('../../index')
const app = new shoio();

app.actions = Object.assign(app.actions, {
    responseSendHtml : 'response:sendHtml', 
    responseSendText : 'response:sendText', 
    responseSendJson: 'response:sendJson',
    responseSendError: 'response:sendError',
})

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
    dispatch( app.actions.responseSendBuffer,  new Buffer(JSON.stringify(data)) )
    dispatch( app.actions.responseEnd );
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