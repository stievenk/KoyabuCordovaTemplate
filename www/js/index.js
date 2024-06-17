var app = {
    // Application Constructor
    initialize: function() {
		this.onDeviceReady();
    },

    onDeviceReady: function() {
		controller = new Controller();
    },
};

var Controller = function() {
	var controller = {
        self: null,
        initialize: function() {
            self = this;
            this.bindEvents();
        },
		bindEvents: function() {
			initStart();
		}, /* end bindEvents */
		
	};
	controller.initialize();
    return controller;
};