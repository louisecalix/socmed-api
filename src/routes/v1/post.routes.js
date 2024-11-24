import { Router } from 'express';
import PostController from '../../controllers/v1/post.controller.js';
import BookmarkController from '../../controllers/v1/bookmark.controller.js';
import LikeController from '../../controllers/v1/like.controller.js';
import CommentController from '../../controllers/v1/comment.controller.js';

import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js';

const postRouter = new Router();
const postController = new PostController();
const bookmarkController = new BookmarkController();
const likeController = new LikeController();
const commentController = new CommentController();

postRouter.use(authorization);

postRouter.post('/', authentication, postController.createPost.bind(postController)); // CREATE POST
postRouter.post('/:origin_id/reposts', authentication, postController.repost.bind(postController)); // REPOST
postRouter.post('/:origin_id/quotes', authentication, postController.quoteRepost.bind(postController)); // QUOTE REPOST
postRouter.get('/:post_id', authentication, postController.getPost.bind(postController)); // GET POST
// postRouter.get('/', authentication, postController.getAllUserPosts.bind(postController)); // GET ALL USER POSTS
postRouter.patch('/:post_id', authentication, postController.updatePost.bind(postController)); // UPDATE POST
postRouter.delete('/:post_id', authentication, postController.deletePost.bind(postController)); // DELETE POST

//  BOOKMARKS
postRouter.post('/:post_id/bookmark', authentication, bookmarkController.addBookmark.bind(bookmarkController));
postRouter.delete('/:bookmark_id/unbookmark', authentication, bookmarkController.removeBookmark.bind(bookmarkController));


//  LIKES
postRouter.post('/:post_id/like', authentication, likeController.likePost.bind(likeController));
postRouter.delete('/:like_id/unlike', authentication, likeController.unlikePost.bind(likeController));
postRouter.get('/:post_id/likes', authentication, likeController.getPostLikes.bind(likeController));

//  COMMENTS
postRouter.post('/:post_id/comment', authentication, commentController.createComment.bind(commentController));
postRouter.post('/:post_id/comment/:parent_id/reply', authentication, commentController.createReply.bind(commentController));
postRouter.get('/:post_id/comments', authentication, commentController.getPostComments.bind(commentController));
postRouter.delete('/comment/:comment_id/delete', authentication, commentController.deleteComment.bind(commentController));


// REPLY
postRouter.get('/comment/:comment_id/replies', authentication, commentController.getCommentReplies.bind(commentController));
export default postRouter;