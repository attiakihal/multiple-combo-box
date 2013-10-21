// jQuery icontains
jQuery.expr[':'].icontains = function(a, i, m) {
	return jQuery(a).text().toUpperCase()
		.indexOf(m[3].toUpperCase()) >= 0;
};

(function ($) {

jQuery.widget( "multicomboboxui.multicombobox", {
	// default options
	options: {
	buttonText: '+',
	isOpen: false,
	hideElement: true,
	closeAfterSelect: true,
	duration: 200,
	txtboxValue: '',

	// callbacks
	callback: null
	},

	// the constructor
	_create: function() {

		// get the selected element
		var $select = this.element;

		// crate combobox
		var combobox = this._crateComboBox();
		this.combobox = $ ( combobox );

		// cashe the combobox
		this._casheElements();

		// bind UI actions
		this._bindUIActions();

		// append the created cobobox to the page
		$select.after( this.combobox );

		// Refresh selected items after append
		this._refreshSelected();

		this._refresh();
	},

	_refresh: function() {

	},

	// events bound via _on are removed automatically
	// revert other modifications here
	_destroy: function() {
		this.combobox.remove();
		this.element.show();
	},

	_crateLi: function(val, text) {
		return '\t<li data-value="' + val + '">' + '<span data-value="' + val + '">' + text + '</span>' + '</li>\n';
	},

	_crateLis: function( options ) {
		var self = this,
			lis = [];

		$.each( options, function( key, option ) {
			var $option = $( option ),
				li = self._crateLi( $option.val(), $option.text() );

			lis.push( li );
		});
		return lis.join('');
	},

	_crateComboBox: function() {
		var $select = this.element,
			opts = this.options,
			lis = this._crateLis( $select.children('option') ),
			combobox = '';

		combobox += '<div class="multicombobox">\n';
		combobox += '\t<input type="text" value="' + this.options.txtboxValue + '" class="txtbox">\n';
		combobox += '\t<a href="#" class="txtbox-btn">' + opts.buttonText + '</a>\n';
		combobox += '\t<input type="text" value="iefix" style="display:none" />';
		combobox += '</div>\n';
		combobox += '<ul class="multicombobox-options">\n';

		// Loop through select element and grap options
		// and make them lis

		combobox += lis;

		combobox += '</ul>';

		combobox += '<ul class="selected-list">';

		// Loop through select element and grap options
		// and make them lis

		combobox += lis;

		combobox += '</ul>';

		return combobox;
	},

	_openClose: function(e) {
		if (e) {
			e.preventDefault();
		}

		this.cashed['.combobox-options'].slideToggle(this.options.duration);
		this.cashed['.txtbox'].focus();
	},

	_refreshSelected: function() {
		var currentValue = this.element.val(),
			selectedList = this.cashed['.selected-list'];

		this.cashed['.selected-list li'].hide();
		if (currentValue !== null) {
			$.each(currentValue, function(index, val) {
				selectedList.find('[data-value=' + val + ']').show();
			});
		}

	},

	_selectLi: function(e) {
		var $selectedLi;
		if (e.target) {
			$selectedLi = $( e.target ); // if clicked
		} else {
			$selectedLi = e; // if enter is pressed
		}

		var selectedValue = $selectedLi.data('value');

		this.cashed['.txtbox'].val('');

		if( this.options.closeAfterSelect ) {
			this._openClose();
		}

		this.element.find( 'option[value=' + selectedValue + ']' ).prop("selected", true);

		// refresh list
		this._refreshSelected();

		// reset aotocomplete
		this._autocomplete();

		this._trigger( 'add' );
	},

	_autocomplete: function() {
		var term = this.cashed['.txtbox'].val(),
			$results = null;

		if ( term !== '' ) {
			$results = this.cashed['.combobox-options li'].find( 'span:icontains(' + term + ')' );
		}

		if ($results) {
			this.cashed['.combobox-options'].show();
			this.cashed['.combobox-options li'].show();
			this.cashed['.combobox-options li'].children().show();

			var $spans = this.cashed['.combobox-options li'].children().not( $results );
			$spans.parent().hide();
			$spans.hide();
		} else {
			this.cashed['.combobox-options'].hide();
			this.cashed['.combobox-options li'].show();
			this.cashed['.combobox-options li'].children().show();
		}
	},

	_removeFromSelection: function (e) {
		var $selectedLi = $( e.target ),
			selectedValue = $selectedLi.data('value');

		this.element.find( 'option[value=' + selectedValue + ']' ).prop("selected", false);

		// refresh list
		this._refreshSelected();

		this._trigger( 'remove' );
	},

	_moveUp: function() {
		var options = this.cashed['.combobox-options'],
			optionLi = this.cashed['.combobox-options li'],
			selected = options.find('.selected');

		optionLi.removeClass("selected");

		if (selected.prevAll('li:visible').eq(0).length === 0) {
			selected.siblings().last(':visible').addClass("selected");
		} else {
			selected.prevAll('li:visible').eq(0).addClass("selected");
		}
	},

	_moveDown: function() {
		var options = this.cashed['.combobox-options'],
			optionLi = this.cashed['.combobox-options li'],
			selected = options.find('.selected');

		optionLi.removeClass("selected");

		if (selected.nextAll('li:visible').eq(0).length === 0) {
			selected.siblings().first(':visible').addClass("selected");
		} else {
			selected.nextAll('li:visible').eq(0).addClass("selected");
		}
	},

	_keyboarAction: function(e) {
		var options = this.cashed['.combobox-options'],
			optionLi = this.cashed['.combobox-options li'],
			selected = options.find('.selected:visible'),
			unselect = options.find('.selected:hidden');

		if (e.keyCode === 38) { // UP
			this._moveUp(e);
		} else if (e.keyCode === 40) { // DOWN
			this._moveDown(e);
		} else if (e.keyCode === 13) { // ENTER
			e.preventDefault();
			this._selectLi(selected);
		} else { // AutoComplete
			this._autocomplete(e);
		}

		selected = options.find('.selected:visible');
		unselect = options.find('.selected:hidden');

		// deselect hidden
		unselect.removeClass('selected');

		// Select first if is not other selected
		if (selected.length === 0) {
			optionLi.filter(':visible').eq(0).addClass('selected');
		}
	},

	_bindUIActions: function() {
		// initials show/hide
		this.cashed['.combobox-options'].hide();
		if (this.options.isOpen) {
			this.cashed['.combobox-options'].show();
		}

		// hide default element
		if (this.options.hideElement) {
			this.element.hide();
		}

		// Hide selected lis
		this.cashed['.selected-list li'].hide();

		// show/hide
		this._on( this.cashed['.txtbox-btn'], {
			click: '_openClose'
		});

		// Item select
		this._on( this.cashed['.combobox-options li'], {
			click: '_selectLi'
		});

		// KeyboardAction
		this._on( this.cashed['.txtbox'], {
			keyup: '_keyboarAction'
		});

		// refresh list when option is changed
		this._on( this.element, {
			change: '_refreshSelected'
		});

		// deselect
		this._on( this.cashed['.selected-list li'], {
			click: '_removeFromSelection'
		});

	},

	// return current value
	val: function() {
		return this.element.val();
	},

	// _setOptions is called with a hash of all options that are changing
	// always refresh when changing options
	_setOptions: function() {
		// _super and _superApply handle keeping the right this-context
		this._superApply( arguments );
		this._refresh();
	},

	// _setOption is called for each individual option that is changing
	_setOption: function( key, value ) {

		this._super( key, value );
	},

	// cashing elements
	_casheElements: function() {
		var $combobox = this.combobox,
			$txtboxBtn = $combobox.find('.txtbox-btn'),
			$txtbox = $combobox.find('.txtbox'),
			$options = $combobox.siblings('.multicombobox-options'),
			$lis = $options.children(),
			$selectedList = $combobox.siblings('.selected-list'),
			$selectedListLi = $selectedList.find('li');

		this.cashed = {
			".txtbox-btn": $txtboxBtn,
			".combobox-options": $options,
			".combobox-options li": $lis,
			".txtbox": $txtbox,
			".selected-list": $selectedList,
			".selected-list li": $selectedListLi,
		};
	}
});
})( jQuery );