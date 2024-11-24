import { Router } from "express";

import GroupPost_Controller from "../../controllers/v1/groupPost_controller.js"
import authorization from "../src/middlewares/authorization.js";
import authentication from "../src/middlewares/authentication.js";

const groupPostRouter = new Router();
const grouppost = new GroupPost_Controller();

groupPostRouter.use(authorization);

groupPostRouter.post('/posts/:group_id/:user_id', authentication, grouppost.create_groupPost.bind(grouppost));


groupPostRouter.get('/posts/:group_id/:user_id/:group_post_id', authentication, grouppost.get_GroupPost.bind(grouppost));
groupPostRouter.get('/posts/all/:group_id', authentication, grouppost.getAll_groupPosts.bind(grouppost));
groupPostRouter.get('/posts/all/:group_id/:user_id', authentication, grouppost.getAllUserGroupPost.bind(grouppost));


groupPostRouter.patch('/update/:group_id/:user_id/:group_post_id', authentication, grouppost.update_groupPost.bind(grouppost));

groupPostRouter.delete('/delete/:group_id/:user_id/:group_post_id', authentication, grouppost.delete_GrouPost.bind(grouppost));

export default GroupPost_Controller;