multiple-combo-box
==================

jQuery UI widget that turns HTML <select multiple> into combo box.
Tested in Google Chrome, Apple Safari, Mozilla Firefox, Opera, Internet Explorer 8+

# Usage


Include jQuery

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>

Include jQuery UI core

    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>

Include widget

    <script type="text/javascript" src="js/jquery.multiplecombobox.js"></script>

You can use default styles for widget:

    <link rel="stylesheet" href="css/multiplecombobox-styles.css">

Use selector for <select multiple> element and use widget method:

    <select multiple name="" id="options" style="height:200px;">
        <option value="apple" selected="true">Apple</option>
        <option value="microsoft">Microsoft</option>
        <option value="windows">Windows</option>
        <option value="htc">HTC</option>
        <option value="iphone" selected="true">iPhone</option>
        <option value="jquery">jQuery</option>
        <option value="user-infetface">user interface</option>
        <option value="peer">peer</option>
        <option value="responsive">responsive</option>
        <option value="google">google</option>
        <option value="ibm">IBM</option>
        <option value="html5">HTML5</option>
    </select>
    <script>
        (function ($) {
            $( "#options" ).multicombobox();
        })( jQuery );
    </script>

# Parametres &default options

buttonText: '+', // show/hide button text

isOpen: false, // auto open

hideElement: true, // hide default select element

closeAfterSelect: true, // auto close after select item

duration: 200, // animation duration

txtboxValue: '', // default text input value


# Functions

val - return current value (array)

destroy - delete all combobox elements and show default select element


# Callbacks

add - after selecting new item

remove - after removing item from selection

# Licence
MIT
