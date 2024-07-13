/**
 * Jobe - JavaScript Objects for Bootstrap Elements
 * 
 * Copyright @ Matt Wang
 *
 * Jobe has two types of objects, handler and element.
 * 
 * Handlers
 * 
 * AJAX query handler, websocket handler, and polling handler.
 * Handlers are functional and don't reply on DOM elements.
 *
 * Elements
 * 
 * DOM element wrapper consists of a set of DOM elements and
 * associated methods to control their behaviours.
*/


/* Attach Jobe object to window */
;(function jobe_load() {
    window.jobe = {};
    console.log("Jobe loaded.");
}() );


/**
 * DOM elements
 *
 * Jobe dom provides a method 'create' to create and return
 * prefabed DOM element together with the provided ID, class,
 * and properties.
 *
 * @todo Consider to make DOM element repertoire part of the
 * public interface for extensibility such that users may add
 * more elements.
**/
;(function jobe_dom_repertoire(jobe) {
    "use strict";
    // element repertoire
    let elements = {};
    elements["anchor"] = function () { return $("<a/>"); };
    elements["div"] = function () { return $("<div/>"); };
    elements["row"] = function () { return $("<div/>").addClass("row"); };
    elements["col"] = function () { return $("<div/>"); };
    elements["container"] = function () {
        return $("<div/>").addClass("container");
    };
    elements["button"] = function () {
        return $("<button/>").addClass("btn").prop({"type": "button"});
    };
    elements["input"] = function () { return $("<input/>"); };
    elements["label"] = function () { return $("<label/>"); };
    elements["select"] = function () { return $("<select/>"); };
    elements["span"] = function () { return $("<span/>"); };
    elements["option"] = function () { return $("<option/>"); };
    elements["ul"] = function () { return $("<ul/>"); };
    elements["li"] = function () { return $("<li/>"); };
    // form related
    elements["form"] = function () {
        return $("<form/>").prop({"method": "post"});
    };
    elements["form-label"] = function () {
        return $("<label/>").addClass("form-label");
    };
    elements["form-input"] = function () { 
            return $("<input/>")
                   .addClass("form-control form-control-sm details-input")
                   .prop({"type": "text"});
    };
    // table related
    // TODO no need to set max height
    elements["table-container"] = function () {
        return $("<div/>").addClass("table-responsive").css({"max-height": "512px"});
    };
    elements["table"] = function () {
        return $("<table/>").addClass("table table-striped table-sm table-hover");
    };
    // TODO no need for "header-fixed"
    elements["table-head"] = function () {
        return $("<thead/>").addClass("table-dark table-header-fixed");
    };
    elements["table-row"] = function () { return $("<tr/>"); };
    elements["table-body"] = function () { return $("<tbody/>"); };

    let dom = {};   // only object dom is public
    dom.create = function (name, id, cls_string, prop_object) {
        if (typeof name === "string") {
            if ( !elements.hasOwnProperty(name) ) {
                throw new Error("Element is not found in the repertoire.");
            } else {
                let el = elements[name]();
                if (typeof id === "string") {
                    el.prop("id", id);
                }
                if (typeof cls_string === "string") {
                    el.addClass(cls_string);
                }
                if (typeof prop_object === "object") {
                    el.prop(prop_object);
                }
                return el;
            }    
        } else {
            throw new Error("Name string of an element is required.");
        }
    };

    jobe.dom = dom;
}(window.jobe) );


/**
 * AJAX query handler
 *
 * Generic AJAX query to the server. An AJAX call usually
 * requires three parameters.
 *
 * @param request A dictionary (object) that contains AJAX
 *        call details. It must contain the following keys
 *        { "url": "search",
 *          "type": "GET" 
 *          "dataType": "json",
 *        }
 *
 * @param request_data Data sent to server via making the query.
 *        Usually, an object (dictionary).
 * 
 * @param callback A callback function per successful query.
 *        The callback function must have one parameter
 *        'response' to pass response from the AJAX call.
 * 
 * @param error_handler A function that handles the errors
 *        if AJAX call fails. It must have one parameter
 *        'error' to accept the error returned from the AJAX.
 *
 * @todo Validation code for request is needed.
 * @todo Procedure for error_handler.
 *
**/
;(function jobe_ajax(jobe) {
    "use strict";
    function ajax_query(request, request_data, callback, error_handler) {
        $.ajax({
            // for example "search", actual URL is "home/search"
            url: request["url"],
            // either "GET" or "POST",
            type: request["type"],
            // usually "json",
            dataType: request["dataType"],
            // {'content': input_text},
            data: request_data,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.setRequestHeader("Content-Type","application/json");
                xhr.setRequestHeader("Accept","text/json");
            },
            success: (response) => { callback(response); },
            error: (error) => { error_handler(error); }
        });
    }

    jobe.ajax = ajax_query;
}(window.jobe) );


/**
 * Poll handler
 *
 * Polling object used to repeat query.
 * 
 * @todo Implement this one
**/
;(function jobe_poll (jobe) {
    "use strict";
    function Poll() {}
    jobe.Poll = Poll;
}(window.jobe) );


/**
 * Socket handler
 *
 * Websocket wrapper object. User needs to provide 4 callbacks
 * to manualy call method "listen".
 * 
 * @todo Add error handling
 * @todo Improve
**/ 
;(function jobe_socket(jobe) {
    "use strict";
    function Socket(address) {
        this.address = address;
        this.websocket = new WebSocket(this.address);    // create a socket
    }

    Socket.prototype.listen = function (event, on_open, on_message,
                                        on_close, on_error) {
        this.websocket.onopen = function (event) { on_open(event); };
        this.websocket.onmessage = function (event) { on_message(event) };
        this.websocket.onclose = function (event) { on_close(event) };
        this.websocket.onerror = function (event) { on_error(event) };
    };

    Socket.prototype.close = function () { this.websocket.close(); };

    jobe.Socket = Socket;
}(window.jobe) );


/**
 * Mouse Crop
 *
 * Image cropping tool is a controler object operating on
 * a canvas. Canvas offset if the position of the top-left
 * corner on the viewport.
 * 
 * Function `crop_image` has 4 internal functions to handle
 * mouse events. It accepts an empty object `cropped_area`
 * and fill it with 3 key-value pairs to define croppe area.
 * 
 * Constructor
 * 
 * @param target_cavnas_id ID of the canvas element on which
 *        the image is to be cropped.
 * 
 * @member canvas_id ID of the target canvas.
 * 
 * @member cropped_area An object (dictionary) that has
 *         {
 *             "size": [width, height],
 *             "source": [x, y, pre_width, Math.abs(pre_height)],
 *             "target": [0, 0, pre_width, Math.abs(pre_height)]
 *         };
 *         Cropped area defines the part of the image that is
 *         to be cropped and processed.
 * 
 * Method
 * 
 * @method onCrop(mouse_up_handler) Call invoke this method
 *         with a handler to process the cropped image. The
 *         callback needs to accept the source canvas and
 *         cropped area.
 *
**/
;(function jobe_mouse_crop(jobe) {
    "use strict";

    // TODO
    // 1. Pass canvas as a parameter.
    // 2. Bugs. 
    function crop_image(canvas_id, cropped_area, callback) {
        let is_down = false;
        // Record starting mouse position on canvas
        let startx = 0;    // start position of rectangle
        let starty = 0;
        let pre_start_x = 0;
        let pre_start_y = 0;
        let pre_width = 0;
        let pre_height = 0;
        let canvas = document.getElementById(canvas_id);
        let context = canvas.getContext("2d");
        let img = {};
        // Original image is acquired from the original canvas.
        let data_url = canvas.toDataURL();
        // Acquire cavnas offset every time pressing down the mouse.
        var canvas_offset = 0;

        // click mouse to register the mouse position on the canvas
        function mouse_down(e) {
            e.preventDefault();
            e.stopPropagation();
            is_down = true;
            // Acquire offset
            canvas_offset = $("#"+canvas_id).offset();
            // starting position x/y relative to canvas origin
            startx = parseInt(e.clientX - canvas_offset.left);
            starty = parseInt(e.clientY - canvas_offset.top);
            // register the starting position
            pre_start_x = startx;
            pre_start_y = starty;
        }

        // Per mouse moves, reload the image and clear the rectangle
        function mouse_move(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!is_down) { return; }    // no dragging, return
            // Current mouse position on canvas
            let currentx = parseInt(e.clientX - canvas_offset.left);
            let currenty = parseInt(e.clientY - canvas_offset.top);
            // Calculate the rectangle width/height
            let width = currentx - startx;
            let height = currenty - starty;
            let rect = {};
            rect.w = (e.clientX - canvas.offsetLeft) - startx;
		    rect.h = (e.clientY - canvas.offsetTop) - starty ;
            img = new Image();   // save the image
            img.onload = function () { context.drawImage(img, 0, 0); };
            img.src = data_url;
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Draw a new rect
            context.strokeRect(pre_start_x, pre_start_y, rect.w, rect.h);
            pre_width = width;
            pre_height = height;
        }
    
        // Mouse up
        function mouse_up(e) {
            e.preventDefault();
            e.stopPropagation();
            is_down = false;
            // Draw the cropped area.
            context.strokeRect(pre_start_x, pre_start_y, pre_width, pre_height);
            if (pre_width > 0 && pre_height > 0) {
                cropped_area = {
                    "size": [pre_width, pre_height],
                    "source": [pre_start_x, pre_start_y, pre_width, pre_height],
                    "target": [0, 0, pre_width, pre_height]
                };
            } else if (pre_width < 0 && pre_height >0) { // from top-right down
                let new_topleft_x = pre_start_x + pre_width;
                cropped_area = {
                    "size": [pre_width, pre_height],
                    "source": [new_topleft_x, pre_start_y, Math.abs(pre_width), pre_height],
                    "target": [0, 0, Math.abs(pre_width), pre_height]
                };
            } else if (pre_width > 0 && pre_height < 0) { // from bottom-left up
                let new_topleft_y = pre_start_y + pre_height;
                cropped_area = {
                    "size": [pre_width, pre_height],
                    "source": [pre_start_x, new_topleft_y, pre_width, Math.abs(pre_height)],
                    "target": [0, 0, pre_width, Math.abs(pre_height)]
                };
            } else { // from bottom-right right
                let new_topleft_x = pre_start_x + pre_width;
                let new_topleft_y = pre_start_y + pre_height;
                cropped_area = {
                    "size": [pre_width, pre_height],
                    "source": [new_topleft_x, new_topleft_y, Math.abs(pre_width), Math.abs(pre_height)],
                    "target": [0, 0, Math.abs(pre_width), Math.abs(pre_height)]
                };
            }
            callback(canvas_id, cropped_area);    // invoke callback
        }
    
        function mouse_out(e) {
            e.preventDefault();
            e.stopPropagation();
            is_down = false;    // drag is over
        }

        // Bind mouse events
        $("#"+canvas_id).mousedown(function (e) { mouse_down(e); });
        $("#"+canvas_id).mousemove(function (e) { mouse_move(e); });
        $("#"+canvas_id).mouseup(function (e) { mouse_up(e); });
        $("#"+canvas_id).mouseout(function (e) { mouse_out(e); });
    }

    function MouseCrop(target_cavnas_id) {
        this.canvas_id = target_cavnas_id;
        this.cropped_area = {};
    }

    MouseCrop.prototype.onCrop = function (mouse_up_callback) {
        crop_image(this.canvas_id, this.cropped_area, mouse_up_callback);
    };

    jobe.MouseCrop = MouseCrop;
}(window.jobe) );


/**
 * Image loader
 * 
 * Image loader is a controller object to load the image
 * to a given canvas. It is usually attached to a browse
 * button. It is a file loader specialised for images.
 * 
 * Image loader always needs a canvas.
**/
;(function jobe_image_loader(jobe) {
    "use strict";

    function ImageLoader(canvas_id) {
        this.canvas_id = canvas_id;
        // remove all events bound to canvas
        $("#"+this.canvas_id).unbind();
    }

    // input element file-loading event handler bound to
    // browse button; it reads one file at a time.
    ImageLoader.prototype.onLoad = function (event, callback) {
        let canvas = document.getElementById(this.canvas_id);
        let context = canvas.getContext("2d");
        // maximal dimension of the hard-coded canvas is 1024x1024
        let canvas_width_max = 1024;
        let canvas_height_max = 1024;
        let file = event.target.files[0];    // just one file in array
        let data_url = {};
        // TODO Perhaps move file reader out as an independent function.
        // create a file reader
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            let img = new Image();    // img element
            img.src = this.result;    // source image in "reader.result"
            img.onload = function () {    // resize image per loading
                context.clearRect(0, 0, canvas.width, canvas.height);
                // Original size of the image
                let source_width = this.naturalWidth;
                let source_height = this.naturalHeight;
                // Calcuate the ratio of canvas to source. If the source
                // can be placed inside the canvas, no need to resize;
                // otherwise resize it to fit the canvas.
                let ratio = Math.min(canvas_width_max / source_width,
                                     canvas_height_max / source_height);
                let width = source_width * ratio;
                let height = source_height * ratio;
                // reset canvas size
                canvas.width = width;
                canvas.height = height;

                if (source_width < width && source_height< height) {
                    // Enlarge the image if source image is smaller
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(this, 0, 0, width, height);			
                } else {
                    // Shrink the image if source is larger.
                    // Here a temp canvas element is used the "middle man"
                    let temp_canvas = document.createElement("canvas");
                    let temp_context = temp_canvas.getContext("2d");
                    // half of the original dimension
                    let half = {
                        width: Math.round(source_width/2),
                        height: Math.round(source_height/2)
                    };
                    temp_canvas.width = half.width;
                    temp_canvas.height = half.height;
                    temp_context.drawImage(this, 0, 0, half.width, half.height);
                    while (half.width / 2 > width) {
                        temp_context.drawImage(
                            temp_canvas,
                            0, 0, half.width, half.height,
                            0, 0, half.width/2, half.height/2);
                        // half again.
                        half = {
                            width: Math.round(half.width/2),
                            height: Math.round(half.height/2)
                        };
                    }
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    // draw on target canvas
                    context.drawImage(
                        temp_canvas,
                        0, 0, half.width, half.height,
                        0, 0, canvas.width, canvas.height);
                }
                data_url = canvas.toDataURL(file.type);
                callback();   // invoke callback after load the image
            };
        };
    };

    jobe.ImageLoader = ImageLoader;
}(window.jobe) );

/**
 * Base object
 * 
 * Jobe DOM objects are derived from this base object.
 * It performs only two tasks.
 * 
 * First, it guarantees that derived object has implemented
 * method `make` to return a DOM element.
 * 
 * Second, check if the given ID has been used.
 *
 * @todo Check if ID has been used.
**/
;(function jobe_base_object (jobe) {
    "use strict";
    function BaseObject(id) {
        if ( !this.__proto__.hasOwnProperty("make") ) {
            throw new Error("Jobe object needs a method named 'make'.");
        }
    }
    jobe.BaseObject = BaseObject;
}(window.jobe) );


/**
 * Button
 *
 * @todo Check if buttons already exist on DOM.
**/
;(function jobe_button (jobe) {
    "use strict";

    function Button (id, cls) {
        jobe.BaseObject.call(this);
        this.id = id;
        this.button = jobe.dom.create("button", id, cls);
    }
    Object.setPrototypeOf(Button.prototype, jobe.BaseObject.prototype);

    Button.prototype.show = function () { this.button.show(); };
    Button.prototype.hide = function () { this.button.hide(); };
    Button.prototype.html = function (text) { this.button.html(text); };
    // add class
    Button.prototype.cls = function (cls) { this.button.addClass(cls); };
    Button.prototype.make = function () { return this.button; }

    jobe.Button = Button;
}(window.jobe) );


/**
 * Alert banner
 *
 * Alert is a `<div>` element with `class="alert alert-primary"`
 * and `role="alert"`
 * 
 * Different constructors are provided for the following types
 * 
 * Success
 * Primary
 * Warning
 * Danger
**/
;(function jobe_alert(jobe) {
    "use strict";

    let alert_attrs = { "class": "alert", "role": "alert" };

    function Alert(text, id) {   // base alert
        this.id = id;
        this.text = text;
        this.div = jobe.dom.create("div", this.id);
    }

    Alert.prototype.make = function () {
        this.div.attr(alert_attrs);
        this.div.html(this.text);
        return this.div;
    };
    
    // primary
    function AlertPrimary(text, id) { Alert.call(this, text, id); }
    Object.setPrototypeOf(AlertPrimary.prototype, Alert.prototype);

    AlertPrimary.prototype.make = function () {
        Alert.prototype.make.call(this);
        this.div.addClass("alert-primary");
        return this.div;
    }

    // warning
    function AlertWarning(text, id) { Alert.call(this, text, id); }
    Object.setPrototypeOf(AlertWarning.prototype, Alert.prototype);

    AlertWarning.prototype.make = function () {
        Alert.prototype.make.call(this);
        this.div.addClass("alert-warning");
        return this.div;
    }

    // danger
    function AlertDanger(text, id) { Alert.call(this, text, id); }
    Object.setPrototypeOf(AlertDanger.prototype, Alert.prototype);

    AlertDanger.prototype.make = function () {
        Alert.prototype.make.call(this);
        this.div.addClass("alert-danger");
        return this.div;
    }

    // success
    function AlertSuccess(text, id) { Alert.call(this, text, id); }
    Object.setPrototypeOf(AlertSuccess.prototype, Alert.prototype);

    AlertSuccess.prototype.make = function () {
        Alert.prototype.make.call(this);
        this.div.addClass("alert-success");
        return this.div;
    }

    jobe.Alert = Alert;
    jobe.AlertSuccess = AlertSuccess;
    jobe.AlertPrimary = AlertPrimary;
    jobe.AlertWarning = AlertWarning;
    jobe.AlertDanger = AlertDanger;
}(window.jobe));


/**
 * Progress bar
 *
 * Progress bar has the following DOM structure
 * ```
 * <div class="progress" id=[wrapper_id]>
 *     <div class="progress-bar" id=[bar_id]>
 *     </div>
 * </div>
 * ```
 * Constructor
 * 
 * @param wrpper_id ID for the wrapper `<div>` element.
 * @param bar_id ID for the inner `<div>` element.
 * 
 * Methods
 * 
 * @method make() Return the bar as the wrapper `<div>`
 *         element.
 * 
 * @method update(percentage) Provide for example "85%"
 *         as the progress. Symbol % is needed.
 * 
 * @method show() Show the progress bar.
 * 
 * @todo What shall I do with those aria- attributes?
**/
;(function jobe_progress_bar (jobe) {
    "use strict";
    let bar_attrs = {
        "role": "progressbar",
        "aria-valuenow": "25",
        "aria-valuemin": "0",
        "aria-valuemax": "100"
    };

    function Progbar(wrapper_id, bar_id) {
        this.wrapper_id = wrapper_id;  // for wrapper div
        this.bar_id = bar_id;  // for progress-bar div
    }

    Progbar.prototype.make = function () {
        let wrapper_div = jobe.dom.create("div", this.wrapper_id);
        wrapper_div.addClass("progress");
        let bar_div = jobe.dom.create("div", this.bar_id);
        bar_div.addClass("progress-bar");
        bar_div.attr(bar_attrs);
        bar_div.css("width", "0%").html("0%");   // init bar to zero
        wrapper_div.append(bar_div);
        return wrapper_div;
    };
    
    Progbar.prototype.update = function (percentage) { // update the progress
        $("#"+this.bar_id).css("width", percentage).html(percentage);
    };

    Progbar.prototype.show = function () { $("#"+this.bar_id).show(); };

    jobe.Progbar = Progbar;
}(window.jobe) );


/**
 * Form
 * 
 * Return a form according to the form meta and form data.
 * The outmost element is a <div.container> that wraps the
 * form element.
 * 
 * Constructor
 * 
 * @param meta (object, optional) Form meta is an object that
 *        defines the basic properties and layout of the form.
 *        For example,
 *        {
 *            id: "item_details_form",
 *            fields: [[], [], ... ]
 *            labels: [[], [], ... ],
 *        }
 *        In meta, "id" and "fields" are required. Key "id" is
 *        a string assigned to <form> element and it must be
 *        unique on the page.
 *    
 *        Key "fields" is a 2D array that describes the visual
 *        layout of the form. It is an array of arrays, each
 *        subarray represents a row and its elements are used
 *        to identify the <label> and <input> elements.
 * 
 * @param data (object, optional) Contains the default data loaded
 *        into the <input> elements on the form. The keys of this
 *        object should be from key "fields". These default data
 *        are used as placeholders per loading the form. For a new
 *        form, this parameter can be absent. For a form loaded with
 *        data from database, the default data is acquired from database.
 * 
 * Constructor creates a form object without meta, data, and element.
 * User must call setters to configure meta and placeholder.
 *
 * @method make(meta,data) Caliing "make" method, meta is required.
 *         Create and return `<div.container>` element using user
 *         provided meta and data. CAUTION. The user-defined meta
 *         and data always override. Placeholder can be undefined,
 *         then no placeholder.
 * 
 * @method getId() Returns ID of the `<form>` element, not the
 *         container `div`. Note that `<form>` is wrapped inside
 *         a `<div.container>`.
 * 
 * @method getContainerId() Returns ID of the container that wraps
 *         the form.
 * 
 * @method getTaggedId() Returns form ID with "#" prepended.
 * 
 * @method getPlaceholder(field_name) Get the placeholder of a given
 *         field.
 *         @param field_name A string that corresponds to a field.
 * 
 * @method getLabel(field_name) Get the label of a field given by
 *         field name.
 *         @param field_name Name of the field
 * 
 * @method getCurrentInput() Returns an object that stores all fields
 *         and the corresponding current values in <input> elements.
 *         Basically, this method convert a form into a dictionary.
 * 
 * @method getCurrentInputByField(field_name) Returns the current
 *         content of a selected `<input>` by field name.
 * 
 * @method getInputElements() Returns an array of `<input>` elements.
 * 
 * @method freeze() Freeze all input with the current content.
 * 
 * @method clone(new_id) Clone the current form with a new ID and
 *         a new `Form` instance.
 * 
 * @todo method to validate if a field exists
**/
;(function jobe_form(jobe) {
    "use strict";

    function validate_meta(meta) {
        let ret = {
            "is_valid": true,
            "error": []
        };
        if (!meta.hasOwnProperty("id")) {    // must provide id
            ret.error.push("Form ID is missing in meta.");
        } else if (!meta.hasOwnProperty("fields")) {    // must provide fields
            ret.error.push("Form fields is missing in meta.");
        }
        if (ret.error.length != 0) {
            ret.is_valid = false;
        }
        return ret;
    }

    function Form() {
        this.inputs = {};  // current inputs
        this.labels = {};  // labels provided
        this.meta = undefined;
        this.placeholder = undefined;
    }
    Object.setPrototypeOf(Form.prototype, jobe.BaseObject.prototype);

    Form.prototype.setMeta = function (meta) {
        let meta_validator = validate_meta(meta);
        if (meta_validator.is_valid) {
            this.meta = meta;
            for (let r = 0; r < meta.fields.length; r++) {    // labels
                for (let c = 0; c < meta.fields[r].length; c++) {
                    let field_name = meta.fields[r][c];
                    if (meta.hasOwnProperty("labels")) {    // default labels
                        this.labels[field_name] = meta.labels[r][c];
                    } else {
                        this.labels[field_name] = meta.fields[r][c];
                    }
                }
            }
        } else {
            throw new Error(meta_validator.error);
        }
    };

    Form.prototype.setPlaceholder = function (data) {
        if (typeof data === "object") {
            this.placeholder = data;
            if (!(this.meta == undefined)) { // has meta
                for (let r = 0; r < this.meta.fields.length; r++) {// init inputs
                    for (let c = 0; c < this.meta.fields[r].length; c++) {
                        let field_name = this.meta.fields[r][c];
                        if (!this.placeholder.hasOwnProperty(field_name)) {
                            this.inputs[field_name] = "";
                        } else {
                            this.inputs[field_name] = data[field_name];
                        }
                    }
                }
            }
        } else {
            throw new Error("Placeholder not provided as object.");
        }
    };

    Form.prototype.getId = function () {
        return this.meta.id;
    }

    Form.prototype.getContainerId = function () {
        return "container--" + this.getId();
    }

    Form.prototype.getTaggedId = function () {
        return '#' + this.getId();
    }

    Form.prototype.getPlaceholder = function (field_name) {
        let placeholder = "";
        if (!(this.placeholder == undefined)) {
            placeholder = this.placeholder[field_name];    
        }
        return placeholder;
    }

    Form.prototype.getLabel = function (field_name) {
        return this.labels[field_name];
    };

    // TODO: Allow user to define and extend this method.
    Form.prototype.getColumnClass = function (number_per_column) {
        let col_class = "";
        if (number_per_column == 1) {
            col_class = "col-sm-12";
        } else if (number_per_column == 2) {
            col_class = "col-sm-6";
        } else if (number_per_column == 3) {
            col_class = "col-sm-4";
        } else {
            col_class = "col-sm-3";
        }
        return col_class;
    };

    function create_form_container(form) {
        form.container = jobe.dom.create("container");
        form.form = jobe.dom.create("form", form.getId());    // <form> element
        // create rows and columns
        for (let ridx = 0; ridx < form.meta.fields.length; ridx++) {
            // Each row is first a div with class row
            let row_div = jobe.dom.create("row");
            // Each row consist several column div
            let ncols = form.meta.fields[ridx].length;
            // Create column. Each column is a div of form-group
            for (let cidx = 0; cidx < ncols ; cidx++) {
                let field_name = form.meta.fields[ridx][cidx];
                // TODO Column class calculator shall be part of form meta.
                let col_div = jobe.dom.create("col", undefined, "mb-3") // TODO: user defined
                              .addClass(form.getColumnClass(ncols));
                // create a label for the column div
                // TODO font size shall be in form_meta
                let label_id = 'label--' + field_name;
                let label = jobe.dom.create("label", label_id)
                            .text(form.getLabel(field_name))
                            .css("font-size", "12px"); // TODO: user defined.
                // create an input for column div
                let input_id = 'input--' + field_name;
                let input = jobe.dom.create(
                    "form-input",
                    input_id,
                    undefined,
                    {
                        "readonly": false,
                        "value": form.getPlaceholder(field_name)
                    }
                ); // TODO: readonly is user defined.
                col_div.append(label);
                col_div.append(input);
                row_div.append(col_div);    // append column div to row
            }
            form.form.append(row_div);    // Append each row to form
        }
        form.container.append(form.form);    // outmost div for the form
    }

    Form.prototype.make = function (meta, data) {
        if (meta == undefined) {
            if (this.meta == undefined) {
                throw new Error("Form needs a valid meta to create DOM elements.");
            } else {
                if ( !(data == undefined) ) { this.setPlaceholder(data); }
                create_form_container(this);
            }
        } else {
            this.setMeta(meta);
            if ( !(data == undefined) ) { this.setPlaceholder(data); }
            create_form_container(this);
        }
        return this.container;
    };

    Form.prototype.getCurrentInput = function() {
        let cached_input = {};
        // select all input elements inside the form
        let input_elements = $('input', this.getTaggedId());
        // cache outstanding data in the elements,
        // only iterate through own properties.
        for (const key of Object.keys(input_elements)) {
            if (input_elements[key].id != undefined) {
                // slice the <input> ID to get field name 
                let id_length = input_elements[key].id.length;
                let field_name = input_elements[key].id.slice(7, id_length);
                cached_input[field_name] = input_elements[key].value;
            }
        }
        return cached_input;
    };
 
    // TODO Validate if a field exists
    Form.prototype.getCurrentInputByField = function (field_name) {
        let input_elid = "#input--" + field_name;
        return $(input_elid).value;
    };

    Form.prototype.getInputElements = function () {
        let input_objects = $("input", this.getTaggedId());
        let element_array = Object.keys(input_objects).map(
                                (key) => input_objects[key]);
        return element_array;
    };

    Form.prototype.freeze = function () {
        let input_elements = this.getInputElements();
        for (var el of input_elements) {
            $(el).attr("disabled", "disabled");
        }
    };

    Form.prototype.clone = function (new_id) {
        let new_meta = {};
        new_meta["id"] = new_id;
        new_meta["fields"] = this.meta["fields"];
        new_meta["labels"] = this.meta["labels"];
        let cached_item_details = this.getCurrentInput();
        let new_form = new Form();
        new_form.setMeta(new_meta);
        new_form.setPlaceholder(cached_item_details);
        return new_form;
    };

    // TODO Append error message under the input
    Form.prototype.showErrorMessage = function (msg) {};

    // Convert form into a row in a table.
    // TODO Implement in coordination with Table.
    Form.prototype.toTableRow = function () {};

    jobe.Form = Form;
}(window.jobe));


/**
 * Table
 *
 * The current version of Jobe supports only homogeneous
 * table in which all rows have identical layout, so
 * are all columns.
 * 
 * A table object can be instantiated without meta or data.
 * If meta (data) is not provided to the constructor, the
 * corresponding member will be set to {}, i.e. empty object;
 * the corresponding flag has_meta (has_data) is set to false.
 * In this case, meta or data can be loaded later in the
 * application by calling specific methods.
 *
 * Constructor
 * 
 * @param meta (object, optional) An object that contains at
 *        least 3 keys. (1) Key "id" is the ID for the `<table>`
 *        element. (2) Key "fields" is a 1D array of fields
 *        that decides the order of fields appearing in the
 *        table header. They are used as keys in the table data.
 *        (3) Key "labels" is a 1D array storing labels shown on
 *        header. If absent, texts in fields are used as labels.
 * 
 * @param data (array, optional)  An array of objects. Each element
 *        in this array represents an entry on the table and is
 *        thus a dictionary. Each element in this array shall
 *        use fields as keys.
 * 
 * Methods
 * 
 * @method make(meta,data) Make the DOM elements and return the
 *         outmost wrapping `<div.container>`. Note that user
 *         provided meta and data override the default.
 * 
 * @method getRowNodes() Return a list of row nodes. Use
 *         `addEventListener` to attach event on a node.
 *         CAUTION. This method is only active after the table
 *         has been appended on the DOM.
 * 
 * @method getRowData() Collect and return the content of a row
 *         as a dictionary.
 * 
 * @method append(data_array) Append entries to the end of the
 *         table body.
 *         @param data_array An array of objects.
 * 
 * @method asJSON() Convert entire table into an array of
 *         objects. Basically, JSONify the table
 * 
 * @method deleteRow() Delete a fow from the table
 * 
 * @method deleteCol() Delete a column from the table
 * 
 * @todo Method to load data to an empty table.
 * @todo Accept events for each row/cell click, etc.
**/ 
;(function jobe_table(jobe) {
    "use strict";

    function Table(meta, data) {
        this.row_counter = 0;
        this.meta = (meta != undefined) ? meta : {};
        this.has_meta = (meta != undefined) ? true : false;
        this.data = (data != undefined) ? data : {};
        this.has_data = (data != undefined) ? true : false;
    }
    Object.setPrototypeOf(Table.prototype, jobe.BaseObject.prototype);
    
    // Only meta is required to make the head row.
    Table.prototype.makeHeadRow = function () {
        this.meta.labels.forEach(function(label, _) {
            let head_th = $("<th/>", {"scope": "col", "text": label});
            this.head_tr.append(head_th);
        }.bind(this));
        this.head.append(this.head_tr);
        this.table.append(this.head);    // append head to table
    };

    // Return a <tr> element with <td> appended.
    Table.prototype.makeBodyRow = function (row_data) {
        let body_tr = $("<tr/>");
        for (let j = 0; j < this.meta.fields.length; j++) {    // for each row
            let body_td = $("<td/>", {
                "class": "text-truncate",
                "text": row_data[this.meta.fields[j]]
            }).css("max-width", "64px");    // TODO How to customise width?
            body_tr.append(body_td);
        }
        return body_tr;
    };

    // TODO Here I only assume table_data is an array of objects.
    // Update row counter only after the row is attached to
    // the body.
    Table.prototype.makeBody = function (data) {
        for (let ridx = 0; ridx < data.length; ridx++) {
            let body_tr = this.makeBodyRow(data[ridx]);    // table rows
            this.body.append(body_tr);
            this.row_counter += 1;    // update row counter.
        }
        this.table.append(this.body);
    };

    Table.prototype.make = function (meta, data) {
        this.container = jobe.dom.create("table-container");    // container
        this.table = jobe.dom.create("table", this.meta.id);
        this.head = jobe.dom.create("table-head");
        this.head_tr = jobe.dom.create("table-row");
        this.body = jobe.dom.create("table-body");
        // Main logic: user-provided meta and data overrides
        // the the default.
        if (meta == undefined) {    // no user meta
            if (this.has_meta) {
                this.makeHeadRow();
            } else {
                throw new Error("Table meta is missing.");
            }
        } else {
            this.meta = meta;  // TODO validate this.
            this.has_meta = true;
            this.makeHeadRow();
        }
        if (data == undefined) {  // no user data
            if (this.has_data) {
                this.makeBody(this.default_data);
            } else {
                throw new Error("Table data is missing.");
            }
        } else {
            this.data = data;
            this.has_data = true;
            this.makeBody(data);
        }        
        this.container.append(this.table);
        return this.container;
    };

    Table.prototype.getRowNodes = function () {
        return document.querySelector('#' + this.meta.id)
                       .querySelectorAll('tbody')[0]
                       .querySelectorAll('tr');
    };

    Table.prototype.getRowData = function (row_node) {
        let kids = row_node.children;
        let row_content = {};
        for (let i = 0; i < this.meta.fields.length; i++) {
            row_content[this.meta.fields[i]] = {
                "label": this.meta.labels[i],
                "input": kids[i].textContent
            };
        }
        return row_content;
    };

    // @todo validate data array
    Table.prototype.append = function (data_array) {
        for (let i = 0; i < data_array.length; i++) {
            this.body.append( this.makeBodyRow(data_array[i]) );
        }
    };

    Table.prototype.asJSON = function () {
        let data_array = [];
        let row_nodes = this.getRowNodes();
        row_nodes.forEach(function(node) {
            data_array.push(this.getRowData(node));
        }.bind(this));
        return data_array;
    };

    // TODO Implement
    Table.prototype.deleteRow = function (row_index) {};

    // TODO Implement.
    Table.prototype.deleteCol = function (field_name) {};

    // Bind event handler to row
    //Table.prototype.bindRowEventHandler = function() {};

    jobe.Table = Table;
}(window.jobe));


/**
 * Modal
 *
 * As the DOM elements are usually hardcoded in the HTML,
 * modal object is a controller object. Therefore it is
 * not derived from base object.
 * 
 * Each modal has 3 buttons, "launch", "save", and "close".
 * 
 * Constructor
 * 
 * @param id ID of the modal element on DOM.
 * 
 * Methods
 * 
 * @method title(title) Set or return modal title.
 *         @param title If undefined, this method returns the
 *                current text of the title. If a string is
 *                provided, then it sets the title.
 *
 * @method clearTitle() Clear title.
 * 
 * @method clearBody() Clear all elements attached to modal body.
 * 
 * @method clearFooter() Clear footer.
 * 
 * @method clearAll() Clear title, body and footer. As modal is
 *         often reused, this method is handy
 * 
 * @method appendToBody(el) Append an element to modal body.
 *         @param el Element to be appended to modal body.
 * 
 * @method appendToFooter(el) Append an element to modal footer.
 *         @param el Element to be appended to modal footer.
 * 
 * @method show(callback_on_show) Show modal with callback.
 *         @param callback_on_show Callback function to be
 *                executed per showing the modal.
 * 
 * @method hide(callback_on_hide) Hide modal with callback.
 *         Per hiding modal, provide the callback to unbind
 *         all events attached to buttons and clear the body.
 *         @param callback_on_hide Callback function to be
 *                executed per hiding the modal.
 *         @todo Make sure `hide` occurs after modal is shown.
 * 
 * @method showButton(button_name) Show the button with the given
 *         name.
 *         @param button_name Name of the button. By default,
 *                can be "button0(1,2)".
 * 
 * @method hideButton(button_name) Hide the button.
 * 
 * @method unbindButton(button_name) Ubind events attached to
 *         a button given by name.
 * 
 * @method button(button_name) Returns the button element
 *         by name. Use this method to bind an event.
**/
;(function jobe_modal(jobe) {
    "use strict";

    function Modal(id) { this.id = id; }

    Modal.prototype.title = function (title) {
        if (title == undefined) {
            return $("#" + this.id + "_title").text();
        } else {
            $("#" + this.id + "_title").text(title);
        }
    };

    Modal.prototype.clearTitle = function () {
        $("#" + this.id + "_title").empty();
    };

    Modal.prototype.clearBody = function () {
        $("#" + this.id + "_body").empty();
    };

    Modal.prototype.clearFooter = function () {
        $("#" + this.id + "_footer").empty();
    };

    Modal.prototype.clearAll = function () {
        this.clearTitle();
        this.clearBody();
        this.clearFooter();
    };

    Modal.prototype.appendToBody = function (el) {
        $("#" + this.id + "_body").append(el);
    };

    Modal.prototype.appendToFooter = function (el) {
        $("#" + this.id + "_footer").append(el);
    };

    Modal.prototype.show = function (callback_on_show) {
        $("#" + this.id).modal("show");
        $("#" + this.id).on("shown.bs.modal", callback_on_show);
    };

    Modal.prototype.hide = function (callback_on_hide) {
        $("#" + this.id).modal("hide");
        $("#" + this.id).on("hidden.bs.modal", callback_on_hide);
    };

    Modal.prototype.onHide = function (callback_on_hide) {
        $("#" + this.id).on("hidden.bs.modal", callback_on_hide);
    };

    Modal.prototype.showButton = function (button_name) {
        let button_id = this.id + "_" + button_name;
        $("#" + button_id).show();
    };

    Modal.prototype.hideButton = function (button_name) {
        let button_id = this.id + "_" + button_name;
        $("#" + button_id).hide();
    };

    Modal.prototype.unbindButton = function (button_name) {
        let button_id = this.id + "_" + button_name;
        $("#" + button_id).unbind();
    };

    Modal.prototype.button = function (button_name) {
        let button_id = this.id + "_" + button_name;
        return $("#" + button_id);
    };

    jobe.Modal = Modal;
}(window.jobe) );


/**
 * Select
 * 
 * Bootstrap reference
 * https://getbootstrap.com/docs/5.3/forms/select/
 *
 * Custom select provides a dropdown list from which
 * the user can select an entry from the options.
 * On DOM, the select has following elements
 *
 * ```
 * <div id=[id] class="input-group mb-3">
 *   <div class="input-group-prepend">
 *     <label class="input-group-text" for="inputGroupSelect01">
 *       Options
 *     </label>
 *   </div>
 *   <select class="form-select" id="inputGroupSelect01">
 *     <option selected>Choose...</option>
 *     <option value="1">One</option>
 *     <option value="2">Two</option>
 *     <option value="3">Three</option>
 *   </select>
 * </div>
 * ```
 * Constructor
 * 
 * @param id ID of the outmost `<div>` on DOM.
 * 
 * @param label_text Text shown on the label.
 * 
 * @param options List of options to be selected.
 * 
 * Methods
 * 
 * @method selected() Return the text of the selected entry.
 * 
 * @todo Allow constructor without options. Options can be
 *       provided at calling `make` method.
 * @todo Append more items to the list of options.
**/
;(function jobe_select () {
    "use strict";
    function Select(id, label_text, options) {
        this.id = id;  // assigned to outer div
        this.label_text = label_text;
        this.label_id = this.id + "_label";
        this.select_id = this.id + "_select";
        this.options = options;
    }
    Object.setPrototypeOf(Select.prototype, jobe.BaseObject.prototype);

    Select.prototype.make = function () {
        let outer_div = jobe.dom.create("div", this.id);
        outer_div.addClass("input-group mb-3");
        // label div and label
        let label_div = jobe.dom.create("div");
        label_div.addClass("input-group-prepend");
        let label = jobe.dom.create("label");
        label.addClass("input-group-text").attr("for", this.select_id).html(this.label_text);
        label_div.append(label);
        // options
        let select = jobe.dom.create("select", this.select_id, "form-select form-select-md mb-3");
        for (let i = 0; i < this.options.length; i++) {
            let option = jobe.dom.create("option");
            option.attr("value", i);
            if (i == 0) {
                // default the first entry to selected
                option.attr("selected", "selected");
            }
            option.html(this.options[i]);
            select.append(option);
        }
        outer_div.append(label_div).append(select);
        return outer_div;
    };

    Select.prototype.selected = function () {    // return the selected
        let selected = $("#"+this.select_id).find(":selected").text();
        return selected;
    };

    jobe.Select = Select;
}(window.jobe) );


/**
 * Menu
 * 
 * The menu is based on the following node structure which
 * is a menu consisting of a list of entries
 * 
 * ```
 * <ul id="" class="nav flex-column list-group">
 *   <li id=[tag] class="nav-item list-group-item">
 *     <a class="nav-link" href="#" aria-current="page">
 *         <span data-feather=[tag]> [label] </span>
 *     </a>
 *   </li>
 *   <li> ... </li>
 *   <li> ... </li>
 * </ul>
 * ```
 * 
 * Each item is a compounded <li> element where tag and label
 * are provided by user. Label is shown on the menu.
 * 
 * Methods
 * 
 * Method `make` takes an item_list that is an array of arrays.
 * Each subarray has two elements, first one is the tag, and
 * the second one is the label. For example
 *     [ ['tag0','Lable0'], ['tag1','Lable1'], ['tag2','Lable2'] ]
 * Outmost node of a menu is a <ul> element; each entry is a
 * list item `li` node. Tag is used as the `id` of a `li`.
 * 
 * @todo Validate item list and other arguments.
 * @todo Allow proper lazy loading.
*/
;(function jobe_menu (jobe) {
    "use strict";

    function Menu(id) {
        this.id = id;
    }
    Object.setPrototypeOf(Menu.prototype, jobe.BaseObject.prototype);

    // each entry is an array of two elements, tag and label
    Menu.prototype.itemise = function (entry) {
        let item = jobe.dom.create("li", entry[0], "nav-item list-group-item");
        let anchor = jobe.dom.create("anchor", null, "nav-link",
                {"aria-current": "page", "href":"#"});
        let span = jobe.dom.create("span", null, null, {"data-feather": entry[0]});
        span.html(entry[1]);
        item.append(anchor.append(span));
        return item;
    };

    Menu.prototype.listise = function (item_list) {    // create `ul` element
        let ul = jobe.dom.create("ul", null, "nav flex-column list-group");
        for (let i = 0; i < item_list.length; i++) {
            let item = this.itemise(item_list[i]);
            ul.append(item);
        }
        return ul;
    };

    Menu.prototype.make = function (item_list) {
        let ul = this.listise(item_list);
        ul.attr({"id": this.id});
        return ul;
    };
    
    // @todo append to the end
    Menu.prototype.appendItem = function (item) {};

    // add a sublist to the item with id tag
    // tagged must already exist on DOM.
    Menu.prototype.addSublist = function (tag, item_list) {
        let sublist = this.listise(item_list);
        $("#"+tag).append(sublist);
    };

    jobe.Menu = Menu;
}(window.jobe) );


/**
 * Canvas
 *
 * @todo Implement this.
**/
;(function jobe_canvas(jobe) {
    "use strict";
    function Canvas() {}
    jobe.Canvas = Canvas;
}(window.jobe) );
