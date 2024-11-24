import { Router } from "express";
import SearchController from "../../controllers/v1/search.controller.js";


const searchRouter = new Router();
const searchController = new SearchController();


searchRouter.get('/posts', searchController.searchPosts.bind(searchController));
searchRouter.get('/users', searchController.searchUsers.bind(searchController));
searchRouter.get('/groups', searchController.searchGroups.bind(searchController));
searchRouter.get('/hashtags', searchController.searchHashtags.bind(searchController));
// searchRouter.get('/comments', searchController.searchComments.bind(searchController));
searchRouter.get('/', searchController.searchAll.bind(searchController));

export default searchRouter;