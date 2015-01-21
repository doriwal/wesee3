
    // This file is the Controller between index.html(View) and stackoverflowHandler.js (Model)

    const PREFIX_URL='http://localhost:8080/userId/',
          ERROR_MISSING_ID= "missing id",
          ERROR_PREFIX=  "error:",
          GENERAL_ERROR= "Request Failed: ";

    function generateStackOverflowActivitiesByUserId(id){
        if(!$.isEmptyObject(id)) {
            cleanUI();
            generateStackOverflowActivitiesViewerByUserId(id, generateD3);
        }else{
            console.log("missing id");
        }
    }


    var generateStackOverflowActivitiesViewerByUserId = function(id, viewerCallback){
        // invoke rest call to the server in order to get the data from stackoverflow (cross domains) instead of JSONP approach
        if(!$.isEmptyObject(id)) {
            var setUrl =  PREFIX_URL+ id;
            $.getJSON(setUrl)
                .done(function( data ) {
                    if(data.error_id){
                        console.log(ERROR_PREFIX+data.error_name);
                    }else {
                        viewerCallback(data);
                    }
                })
                .fail(function( jqxhr, textStatus, error ) {
                    var err = textStatus + ", " + error;
                    console.log(GENERAL_ERROR + err);
                });
        }else{
            console.log(ERROR_MISSING_ID);
        }
    }


    function generateD3(data){
        // method exist in buuble.js
         generateD3View(data) ;
    }



    function cleanUI(){
        $('#items' ).empty();
    }

    $('.numbersOnly').keyup(function () {
        this.value = this.value.replace(/[^0-9]/,'');
    });