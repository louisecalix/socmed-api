import { Router } from 'express';
import LikeController from '../src/controllers/v1/like.controller.js';
import authorization from '../src/middlewares/authorization.js';
// import authentication from '../../middlewares/authentication.js';
import authentication from '../../wall-api/middleware/authentication.js';
const likeRouter = new Router();
const likeController = new LikeController();

likeRouter.use(authorization);

likeRouter.post('/posts/:post_id', authentication, likeController.likePost.bind(likeController));
likeRouter.delete('/:like_id', authentication,  likeController.unlikePost.bind(likeController));
likeRouter.get('/', authentication,  likeController.getUserLikes.bind(likeController));

export default likeRouter;
