import jwt from 'jsonwebtoken';

/**
 * Middleware for authenticating group users
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const groupAdminAuthentication = (req, res, next) => {
    const grpAdminToken = req.headers.grpadmintoken; 

    if (!grpAdminToken) {
        return res.json({
            success: false,
            message: 'Group Admin Token is required.',
        });
    }

    // Verify the token
    jwt.verify(grpAdminToken, process.env.API_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json({
                success: false,
                message: 'Invalid or expired Group Admin Token.',
            });
        }

        // Check if the role is 'Admin' after decoding the token
        const { role } = decoded;  // Assuming the role is part of the decoded token

        if (role === 'Admin') {
            res.locals.admin_id = decoded.admin_id;  // Store the admin_id for use in the next middleware or route handler
            return next();  // Proceed if the role is Admin
        } else {
            return res.json({
                success: false,
                message: 'You do not have admin privileges.',
            });
        }
    });
};

export default groupAdminAuthentication;
