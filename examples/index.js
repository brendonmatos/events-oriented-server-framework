// What if server was oriented to events
const shoio = require('../index')
const app = new shoio('request:logger');
const {actions} = app;

app.use(require('../lib/logger'))
app.use(require('../lib/responseTypes'))
app.use(require('../lib/pug')(__dirname + '/views/'))

app.on('notFoundPage', (requestData, dispatch) => {
    dispatch('response', 'page not found')
})

app.on('homeRequest', (requestData, dispatch) => {
    dispatch('render:pug', {template: "index.pug", config: {}} )
})

app.on('welcomeApiRequest', (requestData, dispatch) => {
    dispatch( 'response:sendJson', {'message': 'welcome to our api'})
})

app.on('request', (requestData, dispatch) => {
    const routesConfig = require('./constants/routesConfig')
    const routedActionName = require('../lib/router/index')(requestData, routesConfig)
    dispatch(routedActionName, requestData )
});

app.listen(3000, () => console.log('Server listening at port 3000'))