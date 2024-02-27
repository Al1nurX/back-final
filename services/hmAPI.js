const axios = require('axios');

const fetchHMProducts = async () => {
	const options = {
		method: 'GET',
		url: 'https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list',
		params: {
			country: 'us',
			lang: 'en',
			currentpage: '0',
			pagesize: '24',
			categories: 'men_all',
			concepts: 'H&M MAN'
		},
		headers: {
			'X-RapidAPI-Key': '5a0e654bc9msh4097fcb1aa33530p13a8eajsn9a13b5b2080c',
			'X-RapidAPI-Host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
		}
	};

	try {
		const response = await axios.request(options);
		if (response.data && response.data.results && response.data.results.length > 0) {
			return response.data.results;
		} else {
			throw new Error('No products found');
		}
	} catch (error) {
		throw error;
	}
};

module.exports = fetchHMProducts;