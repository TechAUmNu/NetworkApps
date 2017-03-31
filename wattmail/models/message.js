var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
	pop3_id : {type: Number, unique: true},
	mailbox: {type: String, required: true}, //inbox/sent etcg
	to_emails : [{ type: String }],
	cc_emails: [{ type: String }],
	bcc_emails: [{ type: String }],
	from_emails: [{ type: String }],
	from_email: { type: String },
	from_name: { type: String },	
	//datetime: { type: Date, default: Date.now }, //retreival datetime
	date: {type: Date}, //time of sent/arrival	
	subject : { type: String },
	raw_content : { type: String},
	html: { type: String }, //Displayed on web page?
	content: {type: String },
	creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
		required: true
    }
});

var Message = module.exports = mongoose.model('Message', MessageSchema);
