import { Router } from "express";

import Group_Comments_Controller from "../../controllers/v1/GroupComment_Controller.js";
import authorization from "../src/middlewares/authorization.js";
import authentication from "../src/middlewares/authentication.js";

const groupcommentRouter = new Router();
const comment = new Group_Comments_Controller();

groupcommentRouter.use(authorization)



