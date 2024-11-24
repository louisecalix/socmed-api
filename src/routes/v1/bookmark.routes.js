import { Router } from "express";
import BookmarkController from "../../../backend/src/controllers/v1/bookmark.controller.js";
// import authorization from "../../../backend/src/middlewares/authorization.js";
// import authentication from "../../middlewares/authentication.js";
import authentication from "../../middlewares/authentication.js";
import authorization from "../../middlewares/authorization.js";

const bookmarkRouter = new Router();
const bookmarkController = new BookmarkController();

// bookmarkRouter.use(authorization);

bookmarkRouter.post('/posts/:post_id', authentication, bookmarkController.addBookmark.bind(bookmarkController));
bookmarkRouter.delete('/:bookmark_id', authentication, bookmarkController.removeBookmark.bind(bookmarkController));
bookmarkRouter.get('/', authentication,  bookmarkController.getUserBookmarks.bind(bookmarkController));

export default bookmarkRouter;

//BOOKMARK IN POSTROUTER NOT HERE
