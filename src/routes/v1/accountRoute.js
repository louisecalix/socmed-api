import { Router } from "express";

import AccountController from "../../controllers/v1/account_controller.js";
import authorization from "../../middlewares/authorization.js";
import authentication from "../../middlewares/authentication.js";
import adminAuthentication from "../../middlewares/adminAuthentication.js";

const accountRouter = new Router();
const account = new AccountController();
// accountRouter.use(authentication);
// accountRouter.use(authorization);
// accountRouter.use(authentication);

accountRouter.post('/create_account', authorization,account.createUser.bind(account));
accountRouter.post('/create_admin', authorization,account.create_admin.bind(account));
accountRouter.post('/login',authorization,account.login.bind(account));
//USER
accountRouter.get('/users/myaccount',authorization,authentication, account.getUser.bind(account));

//ADMIN
accountRouter.get('/users',adminAuthentication,account.getAllUser.bind(account));
accountRouter.get('/approvals',adminAuthentication, authentication, account.getApproved.bind(account));
accountRouter.get('/approvals/user/:user_id', adminAuthentication, authentication, authorization, account.getAnApproval.bind(account));
accountRouter.get('/approved', adminAuthentication, authentication, authorization, account.getApprovedUser.bind(account));
accountRouter.get('/approved/user/:user_id', adminAuthentication, authentication, authorization, account.getAnApproved.bind(account));
//USER
accountRouter.patch('/update' ,authentication,  account.updateUser.bind(account) );

// ADMIN
accountRouter.patch('/approve/:user_id',authorization ,authentication,adminAuthentication, account.approve_user.bind(account) );
accountRouter.patch('/approve_all',authentication,authorization ,adminAuthentication, account.approveAll.bind(account));


// ADMIN
accountRouter.delete('/decline/:user_id', authorization, authentication, adminAuthentication, account.declineUser.bind(account));
accountRouter.delete('/decline_all', authentication, authorization,adminAuthentication, account.declineAll.bind(account));

accountRouter.delete('/:user_id',authorization ,authentication,account.deleteUser.bind(account));


//LOG OUT

accountRouter.post('/log_out', authentication, account.log_out.bind(account));

export default accountRouter;