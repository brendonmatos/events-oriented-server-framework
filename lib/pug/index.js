const pug = require('pug')
const shoio = require('../../index')
const app = new shoio()

let viewsDirectory = "views/"

const parsePath = inputFilePath => viewsDirectory + inputFilePath

app.use(require('../responseTypes'))

app.on('render:pug', ({template, options}, dispatch) => {
    pug.renderFile(parsePath(template), options, (err, html)=> {
        console.log(err);
        err ? dispatch( app.actions.responseError, err)
            : dispatch( app.actions.responseSendHtml, html)
    });
})

module.exports = (path) => {
    viewsDirectory = path || viewsDirectory
    return app;
}
