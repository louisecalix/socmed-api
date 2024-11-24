import { Router } from "express";

import GroupController from "../../controllers/v1/group_controller.js";
import PostController from "../../controllers/v1/post.controller.js";
import CommentController from "../../controllers/v1/comment.controller.js";
import LikeController from "../../controllers/v1/like.controller.js";
// import Group_Comments_Controller from "../../controllers/v1/GroupComment_Controller.js";
// import GroupPost_Controller from "../../controllers/v1/groupPost_controller.js"
import authorization from "../../middlewares/authorization.js";
// import authentication from "../../middlewares/authentication.js";
import authentication from "../../middlewares/authentication.js";
// import authentication from "../../../../wall-api/middleware/authentication.js";
import groupAuthentication from "../../middlewares/groupAuthentication.js";
// import groupAuthentication from "../../middlewares/groupAuthentication.js";
// import groupAdminAuthentication from "../../../../wall-api/middleware/groupAdminAuthentication.js";
import groupAdminAuthentication from "../../middlewares/groupAdminAuthentication.js";
// import groupLikes_controller from "../../controllers/v1/groupLikes_controller.js";
// import groupAuthorization from "../../middlewares/groupAuthorization.js";
const groupRouter = new Router();



const group = new GroupController();
const post = new PostController();
const comment = new CommentController();
const likes = new LikeController();
// const grouppost = new GroupPost_Controller();
// const comment = new Group_Comments_Controller();
// const likes = new groupLikes_controller();


groupRouter.use(authorization);


groupRouter.post('/create_group', authentication, group.create_group.bind(group));
groupRouter.post('/add_members', authentication, group.add_GroupMembers.bind(group));
groupRouter.post('/add_admin', authentication, groupAuthentication,groupAdminAuthentication, group.add_GroupAdmin.bind(group));
// groupRouter.post('/add_member', authentication, group.add_GroupMembers.bind(group));

groupRouter.post('/join/:group_id', authentication, group.submit_joinRequest.bind(group));


groupRouter.get('/this_group', groupAuthentication ,authentication, group.getGroup.bind(group));
groupRouter.get('/all_groups',authentication, group.getAllGroups.bind(group));
groupRouter.get('/user', authentication, group.get_UsersGroup.bind(group));



groupRouter.patch('/approve_member/:user_id',authentication,groupAuthentication, group.approve_members.bind(group));
groupRouter.delete('/decline/:group_id/:user_id',authentication,groupAuthentication, group.decline_member.bind(group));

groupRouter.patch('/roles/:user_id',authentication,groupAuthentication,group.update_Role.bind(group));
groupRouter.patch('/update',authentication,groupAuthentication, group.update_GroupInfo.bind(group));

groupRouter.delete('/:group_id/',authentication, groupAuthentication, group.deleteGroup.bind(group));


// POSTS

groupRouter.post('/posts', authentication, groupAuthentication, post.createPostGroup.bind(post));
groupRouter.patch('/posts/:post_id/update', authentication, groupAuthentication, post.updatePost.bind(post));
groupRouter.delete('/posts/:post_id/delete', authentication, groupAuthentication, post.deletePost.bind(post));
groupRouter.get('/:group_id/posts', authentication, groupAuthentication, post.getUserGroupPosts.bind(post));


// groupRouter.post('/posts/:group_id/:user_id', grouppost.create_groupPost.bind(grouppost));

// groupRouter.get('/posts/:group_id/:user_id/:group_post_id', grouppost.get_GroupPost.bind(grouppost));
// groupRouter.get('/posts/all/:group_id', grouppost.getAll_groupPosts.bind(grouppost));
// // groupRouter.get('/posts/all/:group_id/:user_id', grouppost.getAllUserGroupPost.bind(grouppost));


// groupRouter.patch('/update/:group_id/:user_id/:group_post_id', grouppost.update_groupPost.bind(grouppost));

// groupRouter.delete('/delete/:group_id/:user_id/:group_post_id', grouppost.delete_GrouPost.bind(grouppost));


//GROUP COMMENTS

groupRouter.post('/posts/:post_id/comment', authentication, groupAuthentication, comment.createComment.bind(comment));
groupRouter.get('/posts/:post_id/comments', authentication, groupAuthentication, comment.getPostComments.bind(comment));
groupRouter.delete('/posts/comment/:comment_id/delete', authentication, groupAuthentication, comment.deleteComment.bind(comment));
// groupRouter.post('/:group_id/:user_id/:group_post_id', comment.createGroupComment.bind(comment));
// groupRouter.get('/:group_id/:group_post_id', comment.getAllComments.bind(comment));
// groupRouter.get('/comment/:groupcomment_id', comment.getComment.bind(comment))


//LIKES

groupRouter.post('/posts/:post_id/like', authentication, groupAuthentication, likes.likePost.bind(likes));
groupRouter.delete('/posts/:like_id/unlike', authentication, groupAuthentication, likes.unlikePost.bind(likes));
// groupRouter.get('/posts/:post_id/likes', authentication, groupAuthentication, likes.getUserLikes.bind(likes));

// groupRouter.post('/like/:group_id/:user_id/:group_post_id', authentication, groupAuthentication, likes.likeGroupPost.bind(likes));
// groupRouter.delete('/:group_id/:grouplike_id/unlike/:user_id', authentication, groupAuthentication, likes.unlikeGroupPost.bind(likes));



export default groupRouter;

// import { Router } from "express";

// import GroupController from "../../controllers/v1/group_controller.js";
// import PostController from "../../controllers/v1/post.controller.js";
// import CommentController from "../../controllers/v1/comment.controller.js";
// import LikeController from "../../controllers/v1/like.controller.js";
// // import Group_Comments_Controller from "../../controllers/v1/GroupComment_Controller.js";
// // import GroupPost_Controller from "../../controllers/v1/groupPost_controller.js"
// import authorization from "../../middlewares/authorization.js";
// // import authentication from "../../middlewares/authentication.js";
// import authentication from "../../middlewares/authentication.js";
// // import authentication from "../../../../wall-api/middleware/authentication.js";
// // import groupAuthentication from "../../middlewares/groupAuthentication.js";
// // import groupAuthentication from "../../middlewares/groupAuthentication.js";
// // import groupAdminAuthentication from "../../../../wall-api/middleware/groupAdminAuthentication.js";
// // import groupAdminAuthentication from "../../middlewares/groupAdminAuthentication.js";
// // import groupLikes_controller from "../../controllers/v1/groupLikes_controller.js";
// // import groupAuthorization from "../../middlewares/groupAuthorization.js";
// const groupRouter = new Router();



// const group = new GroupController();
// const post = new PostController();
// const comment = new CommentController();
// const likes = new LikeController();
// // const grouppost = new GroupPost_Controller();
// // const comment = new Group_Comments_Controller();
// // const likes = new groupLikes_controller();


// groupRouter.use(authorization);


// groupRouter.post('/create_group', authentication, group.create_group.bind(group));
// groupRouter.post('/add_members', authentication, group.add_GroupMembers.bind(group));
// groupRouter.post('/add_admin', authentication, group.add_GroupAdmin.bind(group));
// // groupRouter.post('/add_member', authentication, group.add_GroupMembers.bind(group));

// groupRouter.post('/join/:group_id', authentication, group.submit_joinRequest.bind(group));


// groupRouter.get('/this_group',authentication, group.getGroup.bind(group));
// groupRouter.get('/all_groups',authentication, group.getAllGroups.bind(group));
// groupRouter.get('/user', authentication, group.get_UsersGroup.bind(group));



// groupRouter.patch('/approve_member/:user_id',authentication, group.approve_members.bind(group));
// groupRouter.delete('/decline/:group_id/:user_id',authentication, group.decline_member.bind(group));

// groupRouter.patch('/roles/:user_id',authentication,group.update_Role.bind(group));
// groupRouter.patch('/update',authentication, group.update_GroupInfo.bind(group));

// groupRouter.delete('/:group_id/',authentication,group.deleteGroup.bind(group));


// // POSTS

// groupRouter.post('/posts', authentication,post.createPostGroup.bind(post));
// groupRouter.patch('/posts/:post_id/update', authentication,post.updatePost.bind(post));
// groupRouter.delete('/posts/:post_id/delete', authentication, post.deletePost.bind(post));
// groupRouter.get('/:group_id/posts', authentication, post.getUserGroupPosts.bind(post));


// // groupRouter.post('/posts/:group_id/:user_id', grouppost.create_groupPost.bind(grouppost));

// // groupRouter.get('/posts/:group_id/:user_id/:group_post_id', grouppost.get_GroupPost.bind(grouppost));
// // groupRouter.get('/posts/all/:group_id', grouppost.getAll_groupPosts.bind(grouppost));
// // // groupRouter.get('/posts/all/:group_id/:user_id', grouppost.getAllUserGroupPost.bind(grouppost));


// // groupRouter.patch('/update/:group_id/:user_id/:group_post_id', grouppost.update_groupPost.bind(grouppost));

// // groupRouter.delete('/delete/:group_id/:user_id/:group_post_id', grouppost.delete_GrouPost.bind(grouppost));


// //GROUP COMMENTS

// groupRouter.post('/posts/:post_id/comment', authentication,comment.createComment.bind(comment));
// groupRouter.get('/posts/:post_id/comments', authentication,  comment.getPostComments.bind(comment));
// groupRouter.delete('/posts/comment/:comment_id/delete', authentication, comment.deleteComment.bind(comment));
// // groupRouter.post('/:group_id/:user_id/:group_post_id', comment.createGroupComment.bind(comment));
// // groupRouter.get('/:group_id/:group_post_id', comment.getAllComments.bind(comment));
// // groupRouter.get('/comment/:groupcomment_id', comment.getComment.bind(comment))


// //LIKES

// groupRouter.post('/posts/:post_id/like', authentication, likes.likePost.bind(likes));
// groupRouter.delete('/posts/:like_id/unlike', authentication, likes.unlikePost.bind(likes));
// // groupRouter.get('/posts/:post_id/likes', authentication, groupAuthentication, likes.getUserLikes.bind(likes));

// // groupRouter.post('/like/:group_id/:user_id/:group_post_id', authentication, groupAuthentication, likes.likeGroupPost.bind(likes));
// // groupRouter.delete('/:group_id/:grouplike_id/unlike/:user_id', authentication, groupAuthentication, likes.unlikeGroupPost.bind(likes));



// export default groupRouter;