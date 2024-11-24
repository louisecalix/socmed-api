import jwt from 'jsonwebtoken';

/**
 * Middleware for authenticating group users
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const groupAuthentication = (req, res, next) => {
    const token = req.headers.token;     
    const groupToken = req.headers.grouptoken;

    // Ensure both tokens are provided
    if (!token || !groupToken) {
        return res.status(401).json({
            success: false,
            message: 'Unauthenticated User!',
        });
    }

    jwt.verify(token, process.env.API_SECRET_KEY, (err, decodedUser) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid user token',
            });
        }

    
        res.locals.user_id = decodedUser?.user_id;  
        res.locals.authenticated = true;   

        
        jwt.verify(groupToken, process.env.API_SECRET_KEY, (err, decodedGroup) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid group token',
                });
            }

          
            res.locals.group_id = decodedGroup?.group_id;

            next();
        });
    });
};

export default groupAuthentication;
