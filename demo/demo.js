/**
 * Jobe demo suite
 * 
 * For most Jobe objects, the most important method is
 * `make`, which returns the desired DOM element that
 * can be appended directly to an element.
*/


/* Create menu entries on navigation pad */
(function create_menu_on_navipad(jobe) {
    "use strict";
    // Entries are provided as an array of arrays
    // Each subarray has two elements. The first is
    // used as `id` of the `li` element. The second
    // is the label shwon on the page
    let entries = [
        ["tag0", "Create table"],
        ["tag1", "Create form"],
        ["tag2", "Alert banners"],
        ["tag3", "Progress bar"],
        ["tag4", "Interacting with modal"],
        ["tag5", "Form submission on modal"],
        ["tag7", "Select from dropdown list"],
        ["tag9", "Crop an image using mouse"]
    ];

    // Instantiate a menu object
    let menu = new jobe.Menu("menu");

    // Append the menu on the target `div` element
    $("#"+"navipad_sticky_div").append( menu.make(entries) );
}(window.jobe) );


/* Create a table */
;(function create_table(jobe) {
    "use strict";
    // Provide a table meta that has 3 keys
    // "id" assigned to `<table>` element
    // "fields" is an array to identify the each header item
    // "labels" contains the labels shown on the header row
    let meta = {
        "id": "demo-table",
        "fields": ["stad", "land", "inwo"],
        "labels": ["City", "Country", "Population"]
    };

    // Provide an array of data. Each item is an object
    // that has 3 keys described in `meta.fields`
    let data = [
        {
            "stad": "Amsterdam",
            "land": "Nederland",
            "inwo": "1M"
        },
        {
            "stad": "New York",
            "land": "USA",
            "inwo": "9M"
        }
    ];

    // Create a table object
    let table = new jobe.Table();

    // Attach the table via a click event
    $("#"+"tag0").on("click", function () {
        $("#"+"demo_board").append( table.make(meta, data) );
    });
}(window.jobe) );


/* Create a form */
;(function create_form (jobe) {
    "use strict";
    // Use meta to define the layout of the form
    let meta = {
        "id": "demo-form",
        "fields": [
            ["voornaam", "achtnaam"],                // 1st row
            ["stad", "prov", "land", "postcode"],    // 2nd row
            ["email", "foon"]                        // 3rd row
        ],
        "labels": [
            ["First Name", "Surname"],
            ["City", "Province", "Country", "Postcode"],
            ["Email", "Mobile Phone"]
        ]
    };
    // Form data
    let data = {
        "voornaam": "James",
        "achtnaam": "Bond",
        "stad": "London",
        "prov": "Zeeland",
        "land": "Neverland",
        "postcode": "SW1",
        "email": "james.bond@somesortof.com",
        "foon": "+49123456789"
    };

    // Create a Form instance
    let form = new jobe.Form();

    // Append the form by click
    $("#"+"tag1").on("click", function () {
        $("#"+"demo_board").append( form.make(meta, data) );
    });
}(window.jobe) );


/* Create alert banners */
;(function create_alert_banner (jobe) {
    "use strict";
    // create banner objects
    let success = new jobe.AlertSuccess("Success", "banner-success");
    let warning = new jobe.AlertWarning("Warning", "banner-warning");
    // append banners by click
    $("#"+"tag2").on("click", function () {
        $("#"+"demo_board").append( success.make() );
        $("#"+"demo_board").append( warning.make() );
    });
}(window.jobe) );


/* Create progress bar */
;(function create_progress_bar (jobe) {
    "use strict";
    // Instantiate a progbar instance
    let bar = new jobe.Progbar("demo-progbar-wrp", "demo-progbar");
    // append bar by click
    $("#"+"tag3").on("click", function () {
        $("#"+"demo_board").append( bar.make() );
        // To update the progress, call `update` method
        // with a percentage
        bar.update("85%");
    });
}(window.jobe) );


/**
 * Interacting with modal
 * 
 * Modal object in Jobe is a controller, usually the
 * DOM element of modal already is coded in the HTML.
 * 
**/
;(function controlling_modal (jobe) {
    "use strict";
    // Create a modal object with the ID of the modal
    // DOM element
    let modal = new jobe.Modal("main_modal");
    // Set modal title
    modal.title("Jobe Modal Controller");

    // Create a form to be appended to modal
    let meta = {
        "id": "demo-form",
        "fields": [
            ["voornaam", "achtnaam"],                // 1st row
            ["stad", "prov", "land", "postcode"],    // 2nd row
            ["email", "foon"]                        // 3rd row
        ],
        "labels": [
            ["First Name", "Surname"],
            ["City", "Province", "Country", "Postcode"],
            ["Email", "Mobile Phone"]
        ]
    };
    let data = {
        "voornaam": "James",
        "achtnaam": "Bond",
        "stad": "London",
        "prov": "Zeeland",
        "land": "Neverland",
        "postcode": "SW1",
        "email": "james.bond@somesortof.com",
        "foon": "+49123456789"
    };
    // Create a Form instance
    let form = new jobe.Form();
    // Show modal via click event
    $("#"+"tag4").on("click", function () {
        // Append a form to modal
        modal.appendToBody( form.make(meta, data) );
        modal.show();
    });
    
    // On hiding modal, clear title, body and footer
    modal.onHide( function (){
        modal.clearTitle();
        modal.clearBody();
    } );
}(window.jobe) );


/**
 * Form submission on modal
 * 
 * In this demo, once the modal is shown, click the launch
 * button to POST the form data to the backend.
**/
;(function form_submission_on_modal (jobe) {
    "use strict";
    // Create a form to be appended to modal
    let meta = {
        "id": "demo_form_submission",
        "fields": [
            ["voornaam", "achtnaam"],                // 1st row
            ["stad", "prov", "land", "postcode"],    // 2nd row
            ["email", "foon"]                        // 3rd row
        ],
        "labels": [
            ["First Name", "Surname"],
            ["City", "Province", "Country", "Postcode"],
            ["Email", "Mobile Phone"]
        ]
    };
    let data = {
        "voornaam": "James",
        "achtnaam": "Bond",
        "stad": "London",
        "prov": "Zeeland",
        "land": "Neverland",
        "postcode": "SW1",
        "email": "james.bond@somesortof.com",
        "foon": "+49123456789"
    };
    // Create a Form instance
    let form = new jobe.Form();

    // Create a modal object with the ID of the modal
    // DOM element
    let modal = new jobe.Modal("main_modal");
    // Set modal title
    modal.title("Jobe Modal Controller");

    // Bind a AJAX call to the button click event.
    $("#"+"main_modal_button0").on("click", function () {

        // Convert form data to JSON.
        let form_data = JSON.stringify({"content": form.getCurrentInput()});

        // Prepare the request dictionary.
        // Django URL to handle this request is /demo/submission 
        let request = {
            "url": "/demo/submission/",
            "type": "POST",
            "dataType": "json"
        };
        // For demo, empty callback and error handlers are okay.
        function error_handler() {}
        function callback() {}

        // AJAX call to the backend.
        jobe.ajax(request, form_data, callback.bind(this), error_handler);
    });

    // Show modal via click event
    $("#"+"tag5").on("click", function () {
        // append form to body
        modal.appendToBody( form.make(meta, data) );
        modal.show(); 
    });

}(window.jobe) );


/* Dropdown select */
;(function create_dropdown_select (jobe) {
    "use strict";
    // Options to be listed
    let options = ["ResNet", "Mobilenet", "YOLO"];

    // Create a select object by providing
    // id, label and the options array
    let select = new jobe.Select("dem_select", "Demo Dropdown List", options);

    // Append the form by click
    $("#"+"tag7").on("click", function () {
        $("#"+"demo_board").append( select.make() );
    });
}(window.jobe) );


/**
 * Crop an image using mouse drag and click.
 * 
 * In this example, the cropped image is shown on the
 * modal. User can choose two labels for this image
 * before sending it to the server.
 * 
 * On the server side, it receives the image and save
 * it in the designated directory.
**/
;(function crop_image_using_mouse(jobe) {
    "use strict";
    // Attach cropped image on a modal and send it to
    // the server with added information.
    function process_cropped_image(source_canvas_id, cropped_area) {
        let modal = new jobe.Modal("item_modal");
        // Remove the exising canvas on modal
        modal.clearBody();
        let existing_canvases = document.querySelectorAll("#item_modal_body canvas");
        for (let i = 0; i <= existing_canvases.length; i++) {
            $(existing_canvases[i]).remove();
        }
        // source canvas on which a part has been cropped.
        let source_canvas = document.getElementById(source_canvas_id);
        // create a new canvas on item modal to show the cropped image
        let canvas_cropped = document.createElement("canvas");
        let context_cropped = canvas_cropped.getContext("2d");
        canvas_cropped.width = Math.abs(cropped_area["size"][0]);
        canvas_cropped.height = Math.abs(cropped_area["size"][1]);

        context_cropped.drawImage(source_canvas,
                cropped_area["source"][0], cropped_area["source"][1],
                cropped_area["source"][2], cropped_area["source"][3],
                cropped_area["target"][0], cropped_area["target"][1], // target
                cropped_area["target"][2], cropped_area["target"][3]);
        // append canvas to modal
        modal.appendToBody(canvas_cropped);

        // Attach labels and  
        let label_select = new jobe.Select(
            "object",
            "Object",
            ["Apple", "Onion", "Aardappel", "Tomato"]);
        let city_select = new jobe.Select(
            "city",
            "City",
            ["Amsterdam", "London", "New York"]);
        $("#item_modal_body").append(label_select.make());
        $("#item_modal_body").append(city_select.make());

        modal.show();
        $("#item_modal_button0").hide();
        // per hiding modal, unbind events and hide
        $("#item_modal").on('hidden.bs.modal', function () {
            $("#item_modal_button1").unbind();
            modal.hide();
        });

        // Submit image and description to the server
        function submit_image() {
            "use strict";
            let label = label_select.selected();
            let usage = city_select.selected();
            // convert the cropped image into dataurl for sending
            var canvas_blob = canvas_cropped.toDataURL("image/jpeg").replace("data:image/jpeg;base64,", "");
            // send everything as form data
            var data_to_server = new FormData();
            data_to_server.append('image', canvas_blob);
            data_to_server.append('label', label)
            data_to_server.append('city', usage);
            // TODO Need a customised AJAX call
            $.ajax({
                url: "/demo/receive_image/",
                type: "POST",
                processData: false,
                contentType: false,
                enctype: 'multipart/form-data',
                data: data_to_server,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.setRequestHeader("Accept","text/json");
                },
                success: (response) => {},
                error: (error) => {}
            });
        }
        // submit image
        $("#item_modal_button1").on("click", submit_image);
    }

    // Click menu to activate demo
    $("#"+"tag9").on("click", function () {
        // For this demo, the scrolling is disabled.
        window.onscroll = function () { window.scrollTo(0, 0); };
        
        // Create an image loader with target canvas.
        let image_loader = new jobe.ImageLoader("canvas");

        // Callback function used after loading the image
        // Here, it is image cropping.
        function callback () {
            let cropper = new jobe.MouseCrop("canvas");
            cropper.onCrop(process_cropped_image);
        }

        // Click the button to load the image. 
        $("#uploadFile").on("change", function (event){
            image_loader.onLoad(event, callback);
        });
    });
}(window.jobe) );