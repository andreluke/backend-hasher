import { defineRoutes } from '../../utils/defineRoutes.js';
import controller from '../../controllers/AuthController.js';
export default defineRoutes(app => {
    app.post('/login', controller.login);
    app.post('/refresh-token', controller.refresh);
});
