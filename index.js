
function events() {
    let listeners = []
    
    this.on = ( eventname, action ) => {
        listeners[eventname] = action
    }
    
    this.emit = (eventname, payload) => {
        //console.log(payload)
        if( listeners[eventname] ) {
            listeners[eventname]( payload, this.emit )    
        } else {
            console.trace(`Listener is not defined to action '${eventname}'`)
        }
    }
    
    this.attachEvents  = (toAttachEvents) => {
        listeners = Object.assign(listeners, toAttachEvents);
    }

    this.listenerExists = (name) => {
        return listeners.indexOf(name) >= 0 || listeners[name]
    }
    
    this.list = () => listeners
    
    return this;
}

function App (config) {

    const app = new events()

    app.requestEventName =  (
        config ? ( typeof config == "string" )
            ? config
            : config.requestEventName
        : "request"
    );


    app.actions = {
        response: 'response',
        responseEnd: 'response:end',
        responseSend: 'response:send',
        responseSendBuffer: 'response:sendBuffer',
        responseSetHeader: 'response:setHeader'
    }

    app.createServer = () => {
        
        return require('http').createServer( (request, response) => {

            const onResponseSetHeader = (header) => {
                console.log(header)
                response.setHeader(header[0], header[1])
            }

            const onResponseEnd = (data, encoding) => {
                response.end(data, encoding)
            }

            const onResponseBuffer = (buffer) => {
                response.write( buffer )
            }

            app.on(app.actions.response, onResponseEnd)
            app.on(app.actions.responseEnd, onResponseEnd)
            app.on(app.actions.responseSendBuffer, onResponseBuffer)
            app.on(app.actions.responseSetHeader, onResponseSetHeader)

            app.emit(app.requestEventName, request) 
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
