var emailTo, emailCc, emailBcc, emailMessage;

var emailViewCompose;
var emailViewReply;

var composingMessage = false;
var replyActive = false;

function reply(reply) {
	if(!replyActive){
		replyActive = true;
		emailViewReply = document.getElementById("email-view").innerHTML;
		
		var varEmail = document.getElementById("email-addr").value;
		
		var oldEmail = document.getElementById("email-view-content").innerHTML;

		
		
		document.getElementById("email-view-controls").innerHTML = "<input type=\"image\" class=\"draft\" src=\"images/send.png\" title=\"Send\"/>\
			<input type=\"image\" class=\"draft\" src=\"images/save.png\" title=\"Save Draft\"/>\
			<input type=\"image\" class=\"draft\" id=\"delete\" src=\"images/delete.png\" title=\"Delete\" onclick=\"deleteReply()\"/>";

		document.getElementById("email-view-content").innerHTML = "<form id=\"draft-message-header\"> \
			<p>To: <input id=\"email_reply_to\" class=\"field\" type=\"email\" name=\"to\" placeholder=\"\" required> \
			<p>Cc: <input id=\"email_reply_cc\" class=\"field\" type=\"email\" name=\"cc\" placeholder=\"\" required> \
			<p>Bcc: <input id=\"email_reply_bcc\" class=\"field\" type=\"email\" name=\"bc\" placeholder=\"\" required> \
			</form> \
			<form id=\"draft-message-content\"> \
			<textarea id=\"file\" rows=\"6\" onfocus=\"clearContents(this);\"cols=\"47\" placeholder=\"Enter Email\" id=\"A4Page\" required ondragover=\"isOver(event)\" ondrop=\"drop(event)\"></textarea> \
			</form> \
			<div class=\"oldEmail\">" + oldEmail + "</div>";
			
			if(reply){
				document.getElementById("file").autofocus="autofocus";
				document.getElementById("email_reply_to").value=varEmail;
				
			}else{
				document.getElementById("email_reply_to").autofocus="autofocus";	
			}
	}
}

function composeMessage(){
	if(!composingMessage){
		composingMessage = true;
		emailViewCompose = document.getElementById("email-view").innerHTML;
		if(replyActive){
			emailTo = document.getElementById("email_reply_to").value;
			emailCc = document.getElementById("email_reply_cc").value;
			emailBcc = document.getElementById("email_reply_bcc").value;
			emailMessage = document.getElementById("file").value;
		}
		
		document.getElementById("email-view-info").innerHTML = '<h1 id="email-view-subject">Compose Mail:</h1> <p id="email-view-from"/>';
			
		document.getElementById("email-view-controls").innerHTML = "<input type=\"image\" class=\"draft\" src=\"images/send.png\" title=\"Send\"/>\
			<input type=\"image\" class=\"draft\" src=\"images/save.png\" title=\"Save Draft\"/>\
			<input type=\"image\" class=\"draft\" id=\"delete\" src=\"images/delete.png\" title=\"Delete\" onclick=\"deleteCompose()\"/>";
			
		document.getElementById("email-view-content").innerHTML = "<form id=\"draft-message-header\"> \
			<p>To: <input id=\"replyTo\" class=\"field\" type=\"email\" name=\"to\" placeholder=\"\" required> \
			</form> \
			<form>\
			<p>Cc: <input id=\"cc\" class=\"field\" type=\"email\" name=\"cc\" placeholder=\"\" required> \
			</form> \
			<form>\
			<p>Bcc: <input id=\"bcc\" class=\"field\" type=\"email\" name=\"bc\" placeholder=\"\" required> \
			</form> \
			<form>\
			<p>Subject: <input id=\"subject\" class=\"field\" type=\"email\" name=\"subject\" placeholder=\"\" required/> \
			</form> \
			<form id=\"draft-message-content\"> \
			<textarea id=\"file\" rows=\"15\" onfocus=\"clearContents(this);\"cols=\"47\" placeholder=\"Enter Email\" id=\"A4Page\" required ondragover=\"isOver(event)\" ondrop=\"drop(event)\"></textarea> \
			</form>";
		document.getElementById("replyTo").autofocus="autofocus";
	}
}

function deleteReply() {

	document.getElementById("email-view").innerHTML = emailViewReply;
	replyActive = false;
}

function deleteCompose() {
	document.getElementById("email-view").innerHTML = emailViewCompose;
	if(replyActive){
		document.getElementById("email_reply_to").value = emailTo;
		document.getElementById("email_reply_cc").value = emailCc;
		document.getElementById("email_reply_bcc").value = emailBcc;
		document.getElementById("file").value = emailMessage;
	}
	composingMessage = false;
}

 function isOver(e) {
     e.preventDefault();
 }
 
function drag(e) { 
   e.dataTransfer.setData("text", e.target.id);
 }

 function drop(e) {
   //e.preventDefault();
   //var data = e.dataTransfer.getData("text");
   //e.target.appendChild(document.getElementById(data));
   getDraggedIcon("text");
 }
 
 function clearContents(element){
	 element.placeholder = '';
 }
 
 function chooseColour(){
	 colour = parseInt( (5*Math.random()));
	 
	 //yellow, green, blue, orange, pink
	 str1 = "color: "
	 colours = ["#ffff00", "#48fb47", "#15f4ee", "#fd7f00", "#ff33ff"];
	 titles = document.getElementsByTagName("h5");
	 
	 for(i = 0;i < titles.length; i++)
{
	colour = parseInt( (5*Math.random()));
    titles[i].setAttribute("style", str1.concat(colours[colour]));;
}
	 return colours[colour];
	 
 }
 
 function getDraggedIcon(str){
	//filetype = str.split(".");
	filetype = "png"
	str1 = "images/48px";
	str2 = str1.concat(filetype);
	str3 = str2.concat(".png");
	document.getElementById("file").innerHTML = "\
	 <img id=str src=str2 />";
	document.getElementById("file").src = str2; 
 }