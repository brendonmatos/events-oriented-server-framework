Error.stackTraceLimit = Infinity;


function events() {

    let listeners = []
    
    this.on = ( eventname, action ) => {
        if( eventname && eventname != "undefined" ){
            listeners[eventname] = action
        } else {
            console.trace('Can\'t register an listener with undefined name')
        }
    }
    
    this.emit = (eventname, payload) => {
        if( eventname && eventname != "undefined" ){
            if( listeners[eventname]) {
                listeners[eventname]( payload, this.emit )    
            } else {
                this.emit('error:undefinedListener')
                console.log(`Listener is not defined to action '${eventname}'`)
            }
        } else {
            console.trace('The emit function can\'t be undefined')
        }
    }

    this.attachEvents  = (toAttachEvents) => {
        listeners = Object.assign(listeners, toAttachEvents);
    }
    
    this.list = () => listeners
    
    return this;
}

function App (config) {

    const app = new events()
    
    if( config ){
        app.defaultEventName = config.otherwise || 'page-not-found'
        app.requestListenerName = config.requestListenerName || 'request'
    }

    app.actions = {
        response: 'response',
        responseEnd: 'response:end',
        responseSend: 'response:send',
        responseSendBuffer: 'response:sendBuffer',
        responseSetHeader: 'response:setHeader',
        undefinedListenerName: 'error:undefinedListener'
    }
    app.createServer = () => {
        let qweqwe = 1
        return require('http').createServer( (request, response) => {
            const onResponseSetHeader = (header) => {
                response.setHeader(header[0], header[1])
            }
            const onResponseEnd = (data, encoding) => {
                response.end(data, encoding)
            }
            const onResponseBuffer = (buffer) => {
                response.write( buffer )
            }
            const onUndefinedListener = () => {
                app.emit(app.defaultEventName, request)
            }
            app.on(app.actions.response, onResponseEnd)
            app.on(app.actions.responseEnd, onResponseEnd)
            app.on(app.actions.responseSendBuffer, onResponseBuffer)
            app.on(app.actions.responseSetHeader, onResponseSetHeader)
            app.on(app.actions.undefinedListenerName, onUndefinedListener)
            
            app.emit(app.requestListenerName, request) 
        })
    }

    app.listen = (port, onListen) => {
        onListen();
        return app.createServer().listen(port)
    }

    app.use = (application) => {
        app.attachEvents( application.list() );
        Object.assign(app.actions, application.actions);
    }

    return app;
}

module.exports = App
