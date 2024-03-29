const requireAdmin = (req, res, next) => {
	if (req.session.user && req.session.user.admin) {
		next();
	} else {
		res.status(403).send('Forbidden');
	}
};

module.exports = requireAdmin;