// JSON-ify articles

$(document).ready(function(){
    
})

$.getJSON("/list", function(articles){
    for (var i=0; i<articles.length; i++) {
        // All info of articles
        $("#articles").append("<p data-id=" + data[i]._id + "/>" + data[i].headline + "<br/>" + data[i].summary + "<br/>" + data[i].url + "</p>");
    }
});

// When user clicks on the article
$(document).on("click", "p", function(){
    // Empty notes from section
    $("#notes").empty();
    // Save ID
    var userId = $(this).attr("data-id");

    // AJAX call to get articles
    $.ajax({
        method: "GET",
        url: "/list/" + useId
    }).then(function(data){
        console.log(data);
        // Add Subject of note     
        $("#notes").append("<input id='subjectinput' name='subject' >");

        // Add body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

        // Submit Button
        $("#notes").append("<button data-id="+data._id + " id='submit'>Save</button>");

        // Display note
        if (data.note) {
            $("#subjectinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#submit", function(){
    // Grab ID
    var useId = $(this).attr("data-id");
    
    // AJAX request to put in note
    $.ajax({
        method: "POST",
        url: "/list/" + useId,
        data: {
            subject: $("#subjectinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function(data){
        $("#notes").empty();
    });

    // Empty the note input areas
    $("#subjectinput").val("");
    $("#bodyinput").val("");

});