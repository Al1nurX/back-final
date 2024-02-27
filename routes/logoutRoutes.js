const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.error('Error destroying session:', err);
			return res.status(500).send('An error occurred while logging out.');
		}
		res.redirect('/login');
	});
});

module.exports = router;