const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Item = require('../models/item');
const requireAuth = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/authAdminMiddleware');

router.get('/admin', requireAuth, requireAdmin, async (req, res) => {
    try {
        const users = await User.find();
        const items = await Item.find();
        res.render('admin', { users, items });
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            userId,
            name,
            password: hashedPassword,
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

router.get('/admin/items', requireAuth, requireAdmin, async (req, res) => {
    try {
        const items = await Item.find();
        res.render('items', { items });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('An error occurred while fetching items.');
    }
});

router.get('/admin/items/addItems', requireAuth, requireAdmin, async (req, res) => {
    try {
        res.render('addItem');
    } catch (error) {
        console.error('Error adding items:', error);
        res.status(500).send('An error occurred while adding items.');
    }
});

router.get('/admin/items/editItem', requireAuth, requireAdmin, async (req, res) => {
    try {
        res.render('editItem');
    } catch (error) {
        console.error('Error editing items:', error);
        res.status(500).send('An error occurred while editing items.');
    }
});

router.get('/admin/items/deleteItem', requireAuth, requireAdmin, async (req, res) => {
    try {
        res.render('deleteItem');
    } catch (error) {
        console.error('Error deleting items:', error);
        res.status(500).send('An error occurred while deleting items.');
    }
});

router.post('/admin/items/addItems', requireAuth, requireAdmin, async (req, res) => {
    const { nameEN, nameRU, descriptionEN, descriptionRU, picture1, picture2, picture3 } = req.body;

    try {
        let item_Id = await generateItemId()
        const newItem = new Item({
            item_Id: item_Id,
            names: { nameEN: nameEN, nameRU: nameRU },
            descriptions: { descriptionEN: descriptionEN, descriptionRU: descriptionRU },
            pictures: { picture1: picture1, picture2: picture2, picture3: picture3 }
        });

        await newItem.save();

        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send('An error occurred while adding item.');
    }
});

router.post('/admin/items/editItem', requireAuth, requireAdmin, async (req, res) => {
    const { editItemId, editItemNameEN, editItemNameRU, editItemDescEN, editItemDescRU, editPictureSelect, editPicture } = req.body;

    try {
        const item = await Item.findOne({ item_Id: editItemId });
        if (!item) {
            const users = await User.find({});
            const items = await Item.find({});
            return res.render('admin', { messageEditItem: 'Item not found.', formatDate, users, items });
        }

        if (editItemNameEN !== '') {
            item.names.nameEN = editItemNameEN;
        }
        if (editItemNameRU !== '') {
            item.names.nameRU = editItemNameRU;
        }

        if (editItemDescEN !== '') {
            item.descriptions.descriptionEN = editItemDescEN;
        }
        if (editItemDescRU !== '') {
            item.descriptions.descriptionRU = editItemDescRU;
        }

        if (editPicture !== '') {
            if (editPictureSelect === 'editPicture1') {
                item.pictures.picture1 = editPicture;
            } else if (editPictureSelect === 'editPicture2') {
                item.pictures.picture2 = editPicture;
            } else if (editPictureSelect === 'editPicture3') {
                item.pictures.picture3 = editPicture;
            }
        }

        await item.save();
        const formatDate = new Date().toLocaleDateString();

        const users = await User.find({});
        const items = await Item.find({});
        res.render('admin', { messageEditItem: 'Item updated successfully.', formatDate, users, items });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).send('Internal server error.');
    }
});

router.post('/admin/items/deleteItem', requireAuth, requireAdmin, async (req, res) => {
    const { deleteItemId } = req.body;

    try {
        const itemToDelete = await Item.find({ item_Id: deleteItemId });
        if (!itemToDelete) {
            const users = await User.find({});
            const items = await Item.find({});
            res.render('admin', { messageDeleteItem: 'Item not found.', formatDate, users, items });
            return;
        }

        await Item.deleteOne({ item_Id: deleteItemId });
        const formatDate = new Date().toLocaleDateString();

        const users = await User.find({});
        const items = await Item.find({});
        res.render('admin', { messageDeleteItem: 'Item deleted successfully.', formatDate, users, items });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).send('Internal server error.');
    }
});

async function generateItemId() {
    try {
        const lastItem = await Item.findOne().sort({ item_Id: -1 });
        let newItemId;
        if (lastItem) {
            newItemId = parseInt(lastItem.item_Id) + 1;
        } else {
            newItemId = 1;
        }
        console.log("New Item ID:", newItemId);
        return newItemId;
    } catch (error) {
        console.error("Error generating user ID:", error);
        throw error;
    }
}

module.exports = router;