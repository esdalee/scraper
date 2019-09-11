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

    // Save Article
    $(".saveArticleBtn").on("click", function(e) {
        e.preventDefault();
        console.log("article btn clicked!")
        let id = $(this).attr("data-id");
        console.log(id);
        // Ajax
        $.ajax({
            method: "POST",
            url: "/save/" + id
        }).then(function(data) {
            console.log(data);
        }).catch(err =>
            console.log(err)
        );
    });

    // Remove Article
    $("#deleteArticleBtn").on("click", function(e) {
        e.preventDefault();
        let id = $(this).attr("data-id");
        // Ajax
        $.ajax({
            method: "DELETE",
            url: "/delete/" + id,
        }).then(function(data) {
            console.log(data);
            window.location = "/saved";
        })
    });

    // Open Modal
    // $("#addNote").click(function(){
    //     $("#noteModal").modal();
    //   });

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
        let form = this;
        // AJAX request to delete note
        $.ajax({
            method: "DELETE",
            url: "/saved/note/delete/" + id,
        }).then(function(data){
            $("#noteSubject").text("");
            $("#noteBody").text("");
            window.location = "/saved";
        });
    });
});

