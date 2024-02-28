const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');
const Item = require('../models/item');
const fetchHMProducts = require('../services/hmAPI');
const { fetchWomenClothingProducts, fetchMenClothingProducts } = require('../services/fstoreAPI');

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

router.get('/home/fstore', requireAuth, async (req, res) => {
  try {
    const womenClothingProducts = await fetchWomenClothingProducts();

    const menClothingProducts = await fetchMenClothingProducts();

    res.render('fstore', { womenClothingProducts, menClothingProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('An error occurred while fetching products.');
  }
});

module.exports = router;