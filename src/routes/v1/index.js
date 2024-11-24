import { Router } from 'express';
// import homeRouter from './homeRoutes.js';
import accountRouter from "./accountRoute.js";
import profileRouter from './profile.routes.js'; 
import postRouter from './post.routes.js';       
// import likeRouter from './like.routes.js';    
// import bookmarkRouter from './bookmark.routes.js';
// import commentRouter from './comment.routes.js';
import searchRouter from './search.routes.js';
import notificationRouter from './notification.routes.js';
// import followerRouter from "./followerRoute.js";
import groupRoute from "./groupRoute.js";
import homeRoute from './homeRoute.js';




const v1 = new Router();

v1.use('/account', accountRouter);
v1.use('/profiles', profileRouter); //PROFILE ROUTES
v1.use('/posts', postRouter);      // POST ROUTES
// v1.use('/likes', likeRouter); // LIKE ROUTES
// v1.use('/bookmarks', bookmarkRouter); // BOOKMARK ROUTES
// v1.use('/comments', commentRouter); // COMMENT ROUTES
v1.use('/search', searchRouter); // SEARCH ROUTES
v1.use('/notifications', notificationRouter); //NOTIFICATON ROUTES
// v1.use('/follower', followerRouter);//FOLLOWERS
v1.use('/group', groupRoute);//CREATEGROUP
v1.use('/home', homeRoute);//CREATEGROUP



export default v1;
