const axios = require('axios');

const fetchSheinProducts = async () => {
	const options = {
		method: 'GET',
		url: 'https://unofficial-shein.p.rapidapi.com/products/list',
		params: {
			cat_id: '1980',
			adp: '10170797',
			language: 'en',
			country: 'US',
			currency: 'USD',
			sort: '7',
			limit: '20',
			page: '1'
		},
		headers: {
			'X-RapidAPI-Key': '5a0e654bc9msh4097fcb1aa33530p13a8eajsn9a13b5b2080c',
			'X-RapidAPI-Host': 'unofficial-shein.p.rapidapi.com'
		}
	};

	try {
		const response = await axios.request(options);
		console.log('Shein API Response:', response.data);
		return response.data.products || [];
	} catch (error) {
		console.error('Error fetching Shein products:', error);
		throw error;
	}
};


module.exports = fetchSheinProducts;
