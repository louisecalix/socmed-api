import jwt from 'jsonwebtoken';

/**
 * Middleware for authenticating users
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const authentication = (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        res.json({
            success: false,
            message: 'Unauthenticated User!',
        });
        return;
    }

    jwt.verify(token, process.env.API_SECRET_KEY, (err, decoded) => {
        if (err) {
            res.json({
                success: false,
                message: 'Invalid token',
            });
            return;
        }

        res.locals.user_id = decoded?.user_id;
        res.locals.email = decoded?.email;
        res.locals.authenticated = true;
        next();
    });
};

export default authentication;
