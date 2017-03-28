/* Navbar functions *************************************************************************************************************/

var source;

function isbefore(a, b) {
    if (a.parentNode == b.parentNode) {
        for (var cur = a; cur; cur = cur.previousSibling) {
            if (cur === b) {
                return true;
            }
        }
    }
    return false;
}

function dragenter(e) {
    if (isbefore(source, e.target)) {
        e.target.parentNode.insertBefore(source, e.target);
    }
    else {
        try{
            e.target.parentNode.insertBefore(source, e.target.nextSibling);
        } catch (DOMException) {

        }
    }
}

function dragstart(e) {
    source = e.target;
    e.dataTransfer.effectAllowed = 'move';
}

function dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}








/* Email Messages functions *************************************************************************************************************/

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
		document.getElementById("email-view-controls").innerHTML = '<input type="image" class="draft" src="images/icon_send.png" title="Send"/>\
			<input type="image" class="draft" src="images/icon_save.png" title="Save Draft"/>\
			<input type="image" class="draft" id="delete" src="images/icon_delete.png" title="Delete" onclick="deleteReply()"/>';
			
		document.getElementById("email-view-content").innerHTML = '\
		<form id="draft-message-header" method="post" enctype="multipart/form-data">\
			<p>To: <input id="email_reply_to" class="field" type="email" name="to" placeholder="" required="required"/></p>\
			<p>Cc: <input id="email_reply_cc" class="field" type="email" name="cc" placeholder="" required="required"/></p>\
			<p>Bcc: <input id="email_reply_bcc" class="field" type="email" name="bcc" placeholder="" required="required"/></p>\
			<p><textarea id="file" rows="6" onfocus="clearContents(this);" cols="47" placeholder="Enter Email" id="page" required="required" ondragover="isOver(event)" ondrop="drop(event)"></textarea></p>\
			<div class="image-upload">\
				<label for="files"><img src="images/icon_attachment.png" id="upfile" style="cursor:pointer"/></label>\
				<input type="file" id="files" name="files" multiple="multiple"/>\
			</div>\
			<div id="selectedfiles"></div>\
			<img id="test"/>\
		</form>\
		<div class="oldEmail">' + oldEmail + "</div>";
			
			//getDraggedIcon(oldEmail);
			if(reply){
				document.getElementById("file").autofocus="autofocus";
				document.getElementById("email_reply_to").value=varEmail;
			}else{
				document.getElementById("email_reply_to").autofocus="autofocus";	
			}
		document.querySelector('#files').addEventListener('change', handleFileSelect, false);
		selDiv = document.querySelector("#selectedfiles");
	//]]>
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
		document.getElementById("email-view-controls").innerHTML = '\
			<input type="image" class="draft" src="images/icon_send.png" title="Send"/>\
			<input type="image" class="draft" src="images/icon_save.png" title="Save Draft"/>\
			<input type="image" class="draft" id="delete" src="images/icon_delete.png" title="Delete" onclick="deleteCompose()"/>';
			
		document.getElementById("email-view-content").innerHTML = '\
			<form id="draft-message-header" action="/smtp">\
				<p>To <input name="to" required>\
				<input class="field" type="email" name="tmail" placeholder="" required="required"/></p>\
				<p>From: <input class="field" disabled="disabled" value="Adam <aps31@hw.ac.uk>"/></p>\
				<p>Cc: <input id="cc" class="field" type="email" name="cc" placeholder=""/></p>\
				<p>Bcc: <input id="bcc" class="field" type="email" name="bcc" placeholder="" /></p>\
				<p>Subject: <input id="subject" class="field" name="subject" placeholder="" /></p>\
				<p><textarea id="file" rows="15" name="mail" onfocus="clearContents(this);" cols="47" placeholder="Enter Email" id="page" required="required" ondragover="isOver(event)" ondrop="drop(event)"></textarea></p>\
				<p><input type="file" id="files" name="files" multiple="multiple"/></p>\
				<div id="selectedfiles"></div>\
				<input type="submit" value="send"> </p>\
			</form>';
		document.querySelector('#files').addEventListener('change', handleFileSelect, false);
        selDiv = document.querySelector("#selectedfiles");
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
	e.preventDefault();
	var data = e.dataTransfer.getData("text");
	e.target.appendChild(document.getElementById(data));

	//test *** need to invoke the upload file method 
	//var files = e.target.files;
	//handleFileSelect;

	//getDraggedIcon("text");
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
	for(i = 0;i < titles.length; i++){
	colour = parseInt( (5*Math.random()));
	titles[i].setAttribute("style", str1.concat(colours[colour]));;
	}
	return colours[colour];
}
 
 /*
function getDraggedIcon(str){
	//filetype = str.split(".");
	filetype = "png"
	str1 = "images/file_images";
	str2 = str1.concat(filetype);
	str3 = str2.concat(".png");
	//document.getElementById("test").innerHTML = "\
	// <img id=str src=" + str3 + " />";
	document.getElementById("test").src = str3; 
}*/
 
function handleFileSelect(e) {
	if(!e.target.files) return;
	selDiv.innerHTML = "";
	var files = e.target.files;
	if(files.length > 1){
		for(var i=0; i<files.length; i++) {
			var f = files[i];
			selDiv.innerHTML = '<span class="filename">' + f.name + "</span><br>";
		}
	}
}