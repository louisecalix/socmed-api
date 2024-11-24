import { Router } from "express";
import AdminController from "../../controllers/v1/admin_controller.js";
import authentication from "../../middlewares/authentication.js";
import authorization from "../../middlewares/authorization.js";


const adminRouter = new Router();
const admin = new AdminController();

adminRouter.use(authorization);
adminRouter.use(authentication);

adminRouter.post('/', admin.create_admin.bind(admin));
adminRouter.post('/login', admin.admin_login.bind(admin));

adminRouter.patch('/:admin_id', admin.updateAdmin.bind(admin));
adminRouter.delete('/:admin_id', admin.deleteAdmin.bind(admin));

export default adminRouter;

