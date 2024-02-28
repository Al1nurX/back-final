const axios = require('axios');

const fetchWomenClothingProducts = async () => {
	try {
		const response = await axios.get("https://fakestoreapi.com/products/category/women's clothing");
		return response.data;
	} catch (error) {
		console.error('Error fetching women\'s clothing products:', error);
		throw error;
	}
};

const fetchMenClothingProducts = async () => {
	try {
		const response = await axios.get("https://fakestoreapi.com/products/category/men's clothing");
		return response.data;
	} catch (error) {
		console.error('Error fetching men\'s clothing products:', error);
		throw error;
	}
};

module.exports = { fetchWomenClothingProducts, fetchMenClothingProducts };