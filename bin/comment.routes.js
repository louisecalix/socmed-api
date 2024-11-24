import { Router } from "express";
import CommentController from "../src/controllers/v1/comment.controller.js";
import authorization from "../src/middlewares/authorization.js";
// import authentication from "../../middlewares/authentication.js";
import authentication from "../../wall-api/middleware/authentication.js";

const commentRouter = new Router();
const commentController = new CommentController();

commentRouter.use(authorization);

// commentRouter.post('/', authentication,  commentController.createComment.bind(commentController));
commentRouter.post('/replies', authentication,  commentController.createReply.bind(commentController));
commentRouter.delete('/:comment_id', authentication,  commentController.deleteComment.bind(commentController));
commentRouter.get('/posts/:post_id', authentication,  commentController.getPostComments.bind(commentController));
commentRouter.get('/:comment_id', authentication,  commentController.getComment.bind(commentController));
commentRouter.get('/', authentication,  commentController.getUserComments.bind(commentController));

export default commentRouter;