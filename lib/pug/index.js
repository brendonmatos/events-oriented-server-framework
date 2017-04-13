const pug = require('pug')
const shoio = require('../../index')
const app = new shoio()

let viewsDirectory = "views/"

const parsePath = inputFilePath => viewsDirectory + inputFilePath

app.use(require('../responseTypes'))

app.on('render:pug', ({template, options}, dispatch) => {
    pug.renderFile(parsePath(template), options, (err, html)=> {
        err ? dispatch( 'response:sendError', err)
            : dispatch( 'response:sendHtml', html)
    });
})

module.exports = (path) => {
    viewsDirectory = path || viewsDirectory
    return app;
}
