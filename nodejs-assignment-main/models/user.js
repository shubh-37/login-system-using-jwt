require('dotenv').config();
var mongoose = require('mongoose');

if (!process.env.MONGO_URI) {
	console.info({
		Message: 'DB connection failed',
		error: 'Error: MONGO_URL is not defined, did you create a .env file? Check sample.env for reference',
	});
	process.exit(1);
}

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.info({ Message: 'DB connected successfully', error: 'Value: null' }))
	.catch((e) => {
		console.info({ Message: 'DB connection failed', error: e.toString() });
		process.exit(1);
});


//User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;