var oldEmail;

function draftMessage() {
    var emailViewControls = document.getElementById("email-view-controls").innerHTML;
    oldEmail = document.getElementById("email-view-content").innerHTML;

    document.getElementById("email-view-controls").innerHTML = "<button>Send</button> <button>Save to Drafts</button> <button onclick=\"deleteDraft()\">Delete</button>";

    document.getElementById("email-view-content").innerHTML = " \
        <form id=\"draft-message-header\"> \
        <p>To: <input type=\"email\" name=\"to\" placeholder=\"a@b.c\" required> \
        <p>Cc: <input type=\"email\" name=\"cc\" placeholder=\"a@b.c\" required> \
        <p>Bc: <input type=\"email\" name=\"bc\" placeholder=\"a@b.c\" required> \
        </form> \
        <form id=\"draft-message-content\"> \
		<div id=\"div1\" ondrop=\"drop(event)\" ondragover=\"isOver(event)\"></div>\
        <textarea rows=\"4\" cols=\"50\" id=\"A4Page\" required ondragover=\"isOver(event)\" ondrop=\"drop(event)\">Enter Email</textarea> \
        </form> \
        <div class=\"oldEmail\">" + oldEmail + "</div>";
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
   e.preventDefault();
   var data = e.dataTransfer.getData("text");
   e.target.appendChild(document.getElementById(data));
 }