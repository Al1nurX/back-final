const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Item = require('../models/Item');
const upload = require('../models/upload');
const requireAuth = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/authAdminMiddleware');

router.get('/admin', requireAuth, requireAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('An error occurred while fetching users.');
    }
});

router.post('/admin/addUser', requireAuth, requireAdmin, async (req, res) => {
    const { name, password } = req.body;
    try {
        const highestUserIdUser = await User.findOne().sort({ userId: -1 });
        let userId = 1;

        if (highestUserIdUser) {
            userId = highestUserIdUser.userId + 1;
        }

        const newUser = await User.create({
            userId,
            name,
            password,
            creationDate: new Date(),
            admin: false
        });

        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('An error occurred while adding user.');
    }
});

router.get('/admin/editUser/:userId', requireAuth, requireAdmin, async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.render('editUser', { user });
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(500).send('An error occurred while fetching user for edit.');
    }
});

router.post('/admin/editUser/:userId', requireAuth, requireAdmin, async (req, res) => {
    const userId = req.params.userId;
    const { name, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findByIdAndUpdate(userId, { name, password: hashedPassword, updateDate: new Date() });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating user.');
    }
});

router.get('/admin/deleteUser/:userId', requireAuth, requireAdmin, async (req, res) => {
    const userId = req.params.userId;
    try {
        await User.findByIdAndDelete(userId);
        await User.findByIdAndUpdate(userId, { deletionDate: new Date() });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('An error occurred while deleting user.');
    }
});

router.post('/admin/deleteUser/:userId', requireAuth, requireAdmin, async (req, res) => {
    const userId = req.params.userId;
    try {
        await User.findByIdAndUpdate(userId, { deletionDate: new Date() });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('An error occurred while deleting user.');
    }
});

router.post('/admin/logout', requireAuth, requireAdmin, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('An error occurred while logging out.');
        }
        res.redirect('/login');
    });
});

router.get('/admin/addItem', requireAuth, requireAdmin, (req, res) => {
    res.render('addItem'); // Assuming you have an addItem.ejs file in your views directory
});

router.post('/admin/addItem', upload.array('images', 3), requireAuth, requireAdmin, async (req, res) => {
    // Extract item data from request body
    const { names, descriptions } = req.body;
    const images = req.files.map(file => file.filename); // Get the filenames of uploaded images

    try {
        // Create a new item
        const newItem = await Item.create({
            names,
            descriptions,
            images
        });

        // Redirect to the home page after adding the item
        res.redirect('/home');
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send('An error occurred while adding item.');
    }
});

router.post('/admin/editItem/:itemId', requireAuth, requireAdmin, async (req, res) => {
    // Extract item data from request body
    const { names, descriptions, images } = req.body;
    const itemId = req.params.itemId;

    try {
        // Update the item
        await Item.findByIdAndUpdate(itemId, {
            names,
            descriptions,
            images,
            'timestamps.updateDate': new Date()
        });

        res.redirect('/admin');
    } catch (error) {
        console.error('Error editing item:', error);
        res.status(500).send('An error occurred while editing item.');
    }
});

router.post('/admin/deleteItem/:itemId', requireAuth, requireAdmin, async (req, res) => {
    const itemId = req.params.itemId;

    try {
        // Soft delete the item
        await Item.findByIdAndUpdate(itemId, {
            'timestamps.deletionDate': new Date()
        });

        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).send('An error occurred while deleting item.');
    }
});

module.exports = router;