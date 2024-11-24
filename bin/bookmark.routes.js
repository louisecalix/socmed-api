import { Router } from "express";
import BookmarkController from "../src/controllers/v1/bookmark.controller.js";
import authorization from "../src/middlewares/authorization.js";
import authentication from "../src/middlewares/authentication.js";
// import authentication from "../../middleware/authentication.js";


const bookmarkRouter = new Router();
const bookmarkController = new BookmarkController();

bookmarkRouter.use(authorization);

bookmarkRouter.post('/posts/:post_id', authentication, bookmarkController.addBookmark.bind(bookmarkController));
bookmarkRouter.delete('/:bookmark_id', authentication, bookmarkController.removeBookmark.bind(bookmarkController));
bookmarkRouter.get('/', authentication,  bookmarkController.getUserBookmarks.bind(bookmarkController));

export default bookmarkRouter;

