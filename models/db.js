const mongoose = require('mongoose');

const database = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://sa1ntx:SSntmsYVQoCpVrub@cluster0.afcskef.mongodb.net/?retryWrites=true&w=majority"
		);
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Database connection failed: ", error);
	}
};

module.exports = database;