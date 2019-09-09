

$(document).ready(function(){


    // Set clicked navbar tab to active
    $(".navbar-nav li").click(function(){
        $(".navbar-nav li").removeClass("active");
        $(this).addClass("active");
    });

    // Scrape
    $("#scrapeBtn").on("click", function(e) {
        e.preventDefault();
        // Ajax
        $.ajax({
            method: "GET",
            url: "/scrape",
        }).then(function(data) {
            console.log(data);
            window.location = "/list";
        })
    });





    // Get Note Inputs
    $("#saveNoteBtn").on("click", function(e){
        e.preventDefault(); 
        // Grab id of the article and inputs of the note
        let id = $(this).attr("data-id")
        let noteSubject = $("#noteSubject").val().trim();
        let noteBody = $("#noteBody").val().trim();
    
        // Validate
        if (noteSubject && noteBody){
            // Route to save
            $.ajax({
                method: "POST",
                url: "/saved/note/create/" + id,
                id: id,
                data: {
                    subject: noteSubject,
                    body: noteBody
                }
            }).then(function(data){
                console.log(data);
                // Close note modal
                $("#noteModal").modal("hide");
                window.location = "/saved";
            });
        };
    });

    // Delete Note
    $("#deleteNoteBtn").on("click", function(e){
        e.preventDefault();
        // Grab ID
        let id = $(this).attr("data-id");
        // AJAX request to delete note
        $.ajax({
            method: "DELETE",
            url: "/saved/note/delete/" + id,
        }).then(function(data){
            window.location = "/saved";
        });
    });


});



// // When user clicks on the article
// $(document).on("click", "p", function(){
//     // Empty notes from section
//     $("#notes").empty();
//     // Save ID
//     var thisId = $(this).attr("data-id");

//     // AJAX call to get articles
//     $.ajax({
//         method: "GET",
//         url: "/saved/" + thisId
//     }).then(function(data){
//         console.log(data);
//         // Add Subject of note     
//         $("#notes").append("<input id='subjectinput' name='subject' >");

//         // Add body
//         $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

//         // Submit Button
//         $("#notes").append("<button data-id="+data._id + " id='submit'>Save</button>");

//         // Display note
//         if (data.note) {
//             $("#subjectinput").val(data.note.title);
//             $("#bodyinput").val(data.note.body);
//         }
//     });
// });
