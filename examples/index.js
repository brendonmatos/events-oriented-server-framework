
const shoio = require('../index')

const app = new shoio({
    requestListenerName: 'request:logger', 
    otherwise: 'PageNotFound'
});

app.use(require('../lib/logger'))
app.use(require('../lib/responseTypes'))
app.use(require('../lib/pug')(__dirname + '/views/'))

app.on('request', (req, dispatch) => {
    if( req.url.indexOf('api') >= 0 ){
        dispatch('MainApi', req )
    } else {
        dispatch('response:sendText', 'Hello world')
    }
});

app.on('MainApi', (req, dispatch) => {
    if( req.url.indexOf('users') >= 0 ){
        dispatch('MainApi:users', req) 
    } else if( req.url.indexOf('user') >= 0 ) {
        dispatch('MainApi:user', req)
    } else {
        dispatch('PageNotFound')
    }
})

const users = [
    {name : 'Josh'},
    {name : 'Daniel'},
    {name : 'Karen'}
]

app.on('MainApi:users', (req, dispatch) => {
    dispatch('response:sendJson', {'docs': users})
})

app.on('MainApi:user', (req, dispatch) => {
    dispatch('response:sendJson', users[0])
})

app.on('PageNotFound', (req, dispatch) => {
    dispatch('render:pug', {template: 'not_found.pug', options: {}})
})

app.listen(3000, () => console.log('Server listening at port 3000'))