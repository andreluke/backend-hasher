export function defineRoutes(handler) {
    return function (app, _, done) {
        handler(app);
        done();
    };
}
