const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/signup', (req, res) => {
	res.render('signup');
});

router.post('/signup', async (req, res) => {
	const { name, password } = req.body;

	try {
		const existingUser = await User.findOne({ name });

		if (existingUser) {
			return res.send("User already exists. Please choose a different name.");
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);

			const creationDate = new Date();
			const isAdmin = name === 'alinur';
			const lastUser = await User.findOne().sort({ userId: -1 });
			const userId = lastUser ? lastUser.userId + 1 : 1;

			const userData = await User.create({
				userId,
				name,
				password: hashedPassword,
				creationDate,
				admin: isAdmin
			});
		}

		return res.redirect('/login');

	} catch (error) {
		console.error('Error signing up:', error);
		return res.status(500).send('An error occurred while signing up.');
	}
});

module.exports = router;