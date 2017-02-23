var oldEmail;

function draftMessage() {
    var emailViewControls = document.getElementById("email-view-controls").innerHTML;
    oldEmail = document.getElementById("email-view-content").innerHTML;

    document.getElementById("email-view-controls").innerHTML = "<input type=\"image\" class=\"draft\" src=\"images/send_mail.png\" title=\"Send\"/>\
		<input type=\"image\" class=\"draft\" src=\"images/save.png\" title=\"Save Draft\"/>\
		<input type=\"image\" class=\"draft\" id=\"delete\" src=\"images/delete.png\" title=\"Delete\" onclick=\"deleteDraft()\"/>";

    document.getElementById("email-view-content").innerHTML = "<form id=\"draft-message-header\"> \
        <p>To: <input class=\"field\" type=\"email\" name=\"to\" placeholder=\"\" required> \
        <p>Cc: <input class=\"field\" type=\"email\" name=\"cc\" placeholder=\"\" required> \
        <p>Bcc: <input class=\"field\" type=\"email\" name=\"bc\" placeholder=\"\" required> \
        </form> \
        <form id=\"draft-message-content\"> \
        <textarea id=\"file\" rows=\"6\" onfocus=\"clearContents(this);\"cols=\"47\" placeholder=\"Enter Email\" id=\"A4Page\" required ondragover=\"isOver(event)\" ondrop=\"drop(event)\"></textarea> \
        </form> \
        <div class=\"oldEmail\">" + oldEmail + "</div>";
}

function composeMessage(){
	
	
	 document.getElementById("email-view-info").innerHTML = "<h1 id=\"email-view-subject\">Compose Mail:</h1>";
		
	document.getElementById("email-view-controls").innerHTML = "<input type=\"image\" class=\"draft\" src=\"images/send_mail.png\" title=\"Send\"/>\
		<input type=\"image\" class=\"draft\" src=\"images/save.png\" title=\"Save Draft\"/>\
		<input type=\"image\" class=\"draft\" id=\"delete\" src=\"images/delete.png\" title=\"Delete\" onclick=\"deleteDraft()\"/>";
		
	document.getElementById("email-view-content").innerHTML = "<form id=\"draft-message-header\"> \
        <p>To: <input class=\"field\" type=\"email\" name=\"to\" placeholder=\"\" required> \
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
}

function deleteDraft() {
    var emailViewControls = document.getElementById("email-view-controls").innerHTML;

    document.getElementById("email-view-controls").innerHTML = "<button onclick=\"draftMessage()\">Reply</button><button onclick=\"draftMessage()\">Forward</button><button>Move to</button>";

    document.getElementById("email-view-content").innerHTML = oldEmail;
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