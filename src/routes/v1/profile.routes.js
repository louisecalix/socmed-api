import { Router } from 'express';
import ProfileController from '../../controllers/v1/profile.controller.js'; // Updated path
import PostController from '../../controllers/v1/post.controller.js';
import BookmarkController from '../../controllers/v1/bookmark.controller.js';
import LikeController from '../../controllers/v1/like.controller.js';
// import FollowersController from '../../../../wall-api/controllers/v1/follower_controller.js';
import FollowersController from '../../controllers/v1/follower_controller.js';

import authentication from '../../middlewares/authentication.js';
// import authentication from '../../../../wall-api/middleware/authentication.js';
// import authorization from '../../../../wall-api/middleware/authorization.js';
const profileRouter = new Router();
const profileController = new ProfileController();
const postController = new PostController();
const bookmarkController = new BookmarkController();
const likeController = new LikeController();
const followerController = new FollowersController();

// profileRouter.use(authorization);
// profileRouter.use(authentication);

profileRouter.get('/', authentication, profileController.getProfile.bind(profileController));
profileRouter.patch('/update', authentication,  profileController.updateProfile.bind(profileController));
profileRouter.get('/:profile_id', authentication, profileController.getProfileByProfileID.bind(profileController));

//ENTER PFP AND HEADER
profileRouter.post('/pfp', authentication, profileController.uploadPfp.bind(profileController) );
profileRouter.post('/header', authentication, profileController.uploadHeader.bind(profileController));

//UPDATE THE CURRENT HEADER OR PFP
profileRouter.patch('/update/:image_id', authentication, profileController.updateImage.bind(profileController));

//REMOVE 
profileRouter.delete('/remove/:image_id', authentication, profileController.removeUpload.bind(profileController));

//FOLLOW
profileRouter.post('/follow/:following_id', authentication, followerController.followUser.bind(followerController));

//UNFOLLOW
profileRouter.delete('/unfollow/:following_id', authentication, followerController.unfollowUser.bind(followerController));

//  GET USER FOLLOWERS
profileRouter.get('/followers', authentication, followerController.getUserFollowers.bind(followerController));

//  GET USER FOLLOWINGS
profileRouter.get('/followings', authentication, followerController.getUserFollowings.bind(followerController));



// GET USER POSTS
profileRouter.get('/posts', authentication, postController.getAllUserPosts.bind(postController));



// GET USER LIKES
profileRouter.get('/likes', authentication, likeController.getUserLikes.bind(likeController));



// GET USER BOOKMARKS
profileRouter.get('/bookmarks', authentication, bookmarkController.getUserBookmarks.bind(bookmarkController));





export default profileRouter;
