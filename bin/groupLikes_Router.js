import { Router } from "express";
import LikeController from "../../controllers/v1/groupLikes_controller.js";
import authorization from "../src/middlewares/authorization.js";
import authentication from "../src/middlewares/authentication.js";


const groupLikesRouter = new Router();
const likes = new LikeController();

groupLikesRouter.use(authorization);

groupLikesRouter.post('/:group_id/:group_post_id/like/:user_id', likes.likeGroupPost.bind(likes));
groupLikesRouter.post('/:group_id/:group_post_id/unlike/:user_id', likes.unlikeGroupPost.bind(likes));
