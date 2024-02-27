const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const fetchHMProducts = require('../services/hmAPI');
const fetchSheinProducts = require('../services/sheinAPI');
const Item = require('../models/Item');

router.get('/home', requireAuth, async (req, res) => {
  try {
    const items = await Item.find();
    res.render('home', { items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('An error occurred while fetching items.');
  }
});

router.get('/home/hm', requireAuth, async (req, res) => {
  try {
    const products = await fetchHMProducts();
    res.render('hm', { products });
  } catch (error) {
    console.error(error);
    res.render('error');
  }
});

router.get('/home/shein', requireAuth, async (req, res) => {
  try {
    const products = await fetchSheinProducts();
    console.log('Products:', products);
    res.render('shein', { products });
  } catch (error) {
    console.error('Error fetching Shein products:', error);
    res.render('error');
  }
});

module.exports = router;