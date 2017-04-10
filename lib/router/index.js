const routeMatchesWithUrl = (url, routePath) => {
    return url == routePath || !routePath 
}

module.exports = (requestData, routes) => {
    for( let route of routes ){
        if( routeMatchesWithUrl( requestData.url, route.path ) ){
            return route.actionName
        }
    }
}