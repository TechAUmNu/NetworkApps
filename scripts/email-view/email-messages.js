var oldEmail;

function draftMessage() {
    var emailViewControls = document.getElementById("email-view-controls").innerHTML;
    oldEmail = document.getElementById("email-view-content").innerHTML;

    document.getElementById("email-view-controls").innerHTML = "<button>Send</button> <button>Save to Drafts</button> <button onclick=\"deleteDraft()\">Delete</button> \
        <form id=\"draft-message-header\"> \
        <p>To: <input type=\"email\" name=\"email\" placeholder=\"a@b.c\" required> \
        <p>Cc: <input type=\"email\" name=\"email\" placeholder=\"a@b.c\" required> \
        <p>Bc: <input type=\"email\" name=\"email\" placeholder=\"a@b.c\" required> \
        </form><p>";

    document.getElementById("email-view-content").innerHTML = "<form> \
        <p>Reply<p><input type=\"text\" name=\"name\" \
        pattern=\"[A-Za-z\-\s]{3,}\" \
        placeholder=\"3+ letters, hyphens, spaces\" required> \
        </form><p>" + oldEmail + "</p>";
}

function deleteDraft() {
    var emailViewControls = document.getElementById("email-view-controls").innerHTML;

    document.getElementById("email-view-controls").innerHTML = "<button onclick=\"draftMessage()\">Reply</button><button onclick=\"draftMessage()\">Forward</button><button>Move to</button>";

    document.getElementById("email-view-content").innerHTML = oldEmail;
}