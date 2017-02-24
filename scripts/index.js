

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
		
		document.getElementById("email-view-controls").innerHTML = '<input type="image" class="draft" src="images/send.png" title="Send"/>\
			<input type="image" class="draft" src="images/save.png" title="Save Draft"/>\
			<input type="image" class="draft" id="delete" src="images/delete.png" title="Delete" onclick="deleteReply()"/>';
			
		document.getElementById("email-view-controls").innerHTML = '<input type="image" class="draft" src="images/send.png" title="Send"/>\
			<input type="image" class="draft" src="images/save.png" title="Save Draft"/>\
			<input type="image" class="draft" id="delete" src="images/delete.png" title="Delete" onclick="deleteReply()"/>';
			
		document.getElementById("email-view-content").innerHTML = '<form id="draft-message-header" method="post" enctype="multipart/form-data"> \
			<p>To: <input id="email_reply_to" class="field" type="email" name="to" placeholder="" required> \
			<p>Cc: <input id="email_reply_cc" class="field" type="email" name="cc" placeholder="" required> \
			<p>Bcc: <input id="email_reply_bcc" class="field" type="email" name="bc" placeholder="" required> \
			<p><textarea id="file" rows="6" onfocus="clearContents(this);"cols="47" placeholder="Enter Email" id="A4Page" required ondragover="isOver(event)" ondrop="drop(event)"></textarea> \
			<p><input type="file" id="files" name="files" multiple> \
			<div id="selectedFiles"></div>\
			</form> \
			<div class=\"oldEmail\">' + oldEmail + "</div>";
			
			if(reply){
				document.getElementById("file").autofocus="autofocus";
				document.getElementById("email_reply_to").value=varEmail;
			}else{
				document.getElementById("email_reply_to").autofocus="autofocus";	
			}
			'<div class="oldEmail">' + oldEmail + '</div>';
		document.querySelector('#files').addEventListener('change', handleFileSelect, false);
        selDiv = document.querySelector("#selectedFiles");
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
		document.getElementById("email-view-controls").innerHTML = '<input type="image" class="draft" src="images/send.png" title="Send"/>\
			<input type="image" class="draft" src="images/save.png" title="Save Draft"/>\
			<input type="image" class="draft" id="delete" src="images/delete.png" title="Delete" onclick="deleteCompose()"/>';
			
		document.getElementById("email-view-content").innerHTML = '<form id="draft-message-header" method="post" enctype="multipart/form-data"> \
			<p>To: <input class="field" type="email" name="to" placeholder="" required> \
			<p>Cc: <input id="cc" class="field" type="email" name="cc" placeholder="" required> \
			<p>Bcc: <input id="bcc" class="field" type="email" name="bc" placeholder="" required> \
			<p>Subject: <input id="subject" class="field" type="email" name="subject" placeholder="" required/> \
			<p><textarea id="file" rows="15" onfocus="clearContents(this);"cols="47" placeholder="Enter Email" id="A4Page" required ondragover="isOver(event)" ondrop="drop(event)"></textarea> \
			<p><input type="file" id="files" name="files" multiple> \
			<div id="selectedFiles"></div>\
			</form>';
		document.querySelector('#files').addEventListener('change', handleFileSelect, false);
        selDiv = document.querySelector("#selectedFiles");
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
 
 function handleFileSelect(e) {
        
        if(!e.target.files) return;
        
        selDiv.innerHTML = "";
        
        var files = e.target.files;
		if(files.length > 1){
			for(var i=0; i<files.length; i++) {
				var f = files[i];
				
				selDiv.innerHTML += '<span class="fileName">' + f.name + "</span><br>";

			}
		}
        
 }