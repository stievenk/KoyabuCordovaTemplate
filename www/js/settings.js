$('#loading').hide();

$('#saveURL').unbind('click').click(function(){
	var url = $('#fm1 #url').val();
	var el = document.createElement('a');
	el.href = API_URL;
	if (url != '') {
		debug('New Server','success');
		localStorage.setItem('server_api_url',url + SERVER_PATH);
		CURRENT_API_URL = url + SERVER_PATH;
		window.location.assign('index.html');
	} else {
		debug('Reset Server','success');
		localStorage.removeItem('server_api_url');
		window.location.assign('index.html');
	}
});

$(document).ready(function(e) {
	var el = document.createElement('a');
	el.href = API_URL;
    $('#fm1 #url').val(el.protocol+'//'+el.host);
});

//var el = document.createElement('a');
//el.href = "http://www.somedomain.com/account/search?filter=a#top";
//alert(el.pathname);
/* * /
el.host        // www.somedomain.com (includes port if there is one[1])
el.hostname    // www.somedomain.com
el.hash        // #top
el.href        // http://www.somedomain.com/account/search?filter=a#top
el.pathname    // /account/search
el.port        // (port if there is one[1])
el.protocol    // http:
el.search      // ?filter=a
/**/