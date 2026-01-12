const adminAuth = async (req, res, next) => {
    try {
        // First check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Check if user has admin or moderator privileges
        if (!['admin', 'moderator'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Admin or Moderator privileges required' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export default adminAuth;
