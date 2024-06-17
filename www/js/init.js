var init = {
	start: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
	
	onDeviceReady: function() {
		app.initialize();
	}
};

init.start();