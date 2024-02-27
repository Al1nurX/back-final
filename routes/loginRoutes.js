const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const requireAuth = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/authAdminMiddleware');

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', async (req, res) => {
	const { name, password } = req.body;

	try {
		const user = await User.findOne({ name });

		if (!user) {
			return res.send('User not found.');
		}

		const validPassword = await bcrypt.compare(password, user.password);

		if (validPassword) {
			req.session.user = user;
			if (user.admin) {
				return res.redirect('/admin');
			} else {
				return res.redirect('/home');
			}
		} else {
			return res.send('Wrong password.');
		}

	} catch (error) {
		console.error('Error logging in:', error);
		return res.status(500).send('An error occurred while logging in.');
	}
});

router.get('/admin', requireAuth, requireAdmin, async (req, res) => {
	try {
		const users = await User.find();
		res.render('admin', { users });
	} catch (error) {
		console.error('Error fetching admin data:', error);
		res.status(500).send('An error occurred while fetching admin data.');
	}
});

module.exports = router;