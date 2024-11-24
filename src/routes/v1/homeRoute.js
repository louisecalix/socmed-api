import { Router } from "express";
import HomeController from "../../controllers/v1/homeController.js";
import authorization from "../../middlewares/authorization.js";
import authentication from "../../middlewares/authentication.js";

const homeRoute = new Router();
const home = new HomeController();

homeRoute.get('/currents', authentication, home.current_posts.bind(home));
homeRoute.get('/trendings', authentication, home.get_trendings.bind(home));
homeRoute.get('/from_followings', authentication, home.followingsPosts.bind(home));

export default homeRoute;