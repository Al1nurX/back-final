const express = require('express');
const session = require('express-session');
const database = require('./models/db');
const loginRoutes = require('./routes/loginRoutes');
const signupRoutes = require('./routes/signupRoutes');
const adminRoutes = require('./routes/adminRoutes');
const homeRoutes = require('./routes/homeRoutes');
const logoutRoutes = require('./routes/logoutRoutes');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
	secret: 'dKJ#h3!lP@9qzR$1',
	resave: false,
	saveUninitialized: false
}));

app.use('/', loginRoutes);
app.use('/', signupRoutes);
app.use('/', adminRoutes);
app.use('/', homeRoutes);
app.use('/', logoutRoutes);

app.get('/', (req, res) => {
	res.render('login');
});

database();

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});