var xhr = $.ajax();

function setHeaders() {
	var h = {
		'app_key' : APPS_TOKEN,
		'app_version' : APPS_VERSION_NUMBER,
		'app_id' : APPS_ID,
		'token' : USER_TOKEN,
		'refresh_token' : TOKEN_KEY
	};
	return h;
}

function bindClick() {
	/**/
	$('.external-link, .external_link, .external-url, .external_url').unbind('click').on('click',function(){
		var u = encodeURI($(this).attr('data-url'));
		//alert(u);
		cordova.InAppBrowser.open(u,'_system');	
	});
	
	$('.get_url, .get-url, .call_function').unbind('click').on('click',function(){
		var url = $(this).attr('data-url');
		var data = {};
		var dv = $('#layout');
		$('.modal').hide().remove();
		loadHTML(url,data,dv,function(){ window.scrollTo(0,0); });
	});
	
	/**/
	$('.exit, [exit]').unbind('click').click(function(){ 
		navigator.notification.confirm('Tekan OK untuk menutup aplikasi',function(a) { if (a == 1) { navigator.app.exitApp(); }},'');
	});
	
	/*
	$('.logout').unbind('click').click(function(){
		navigator.notification.confirm(
			'Are you sure to logout?', // message
			 function(a) {
				 if (a == 1) { signOut(); }
			 },
			'',           // title
			['Ok','Cancel']     // buttonLabels
		);
	})
	;
	*/

	$('.carousel').carousel();
	
}

function signOut() {
	loadJSON('home&logout=1',{},function(js) {
		if (js['done'] == 1) {
			localStorage.clear();
			window.FirebasePlugin.clearAllNotifications();
			window.FirebasePlugin.unregister();
			window.location.assign('index.html');
		} else {
			localStorage.clear();
			window.FirebasePlugin.clearAllNotifications();
			window.FirebasePlugin.unregister();
			window.location.assign('index.html');
		}
	});
}

function setURL(call) {	
	return API_URL + '?call='+call+'&app_version='+APPS_VERSION_CODE+'&';
}

function setParams(params) {
	//debug('Set Params');
	if (typeof params  === 'object' && params !== null) {
		params['userid'] = localStorage.getItem('userid');
		params['username'] = localStorage.getItem('username');
		params['token'] = localStorage.getItem('user_token');
		params['lat'] = lat;
		params['lng'] = lng;
		params['app_number'] = APPS_VERSION_NUMBER;
		return params;
	} else { alert(params); return null; }
}

function getFormData(form){
    var unindexed_array = form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

function loadingOverlay(p,option) {
	var title = option.title ? option.title : null;
	var message = option.message ? option.message : null;
	//var callbackFunction = option.callback ? option.callback : null;
	var l = option.cancel ? option.cancel : false;
	if (p == 1) {
		//$('#loading-overlay').show();
		//$('#loading').show();
		SpinnerDialog.show(title,message,l);
	} else {
		$('#loading-overlay').hide();
		$('#loading').hide();
		SpinnerDialog.hide();
	}
}

function loadHTML(url,data,dv,callback,noloading) {
	var headers = setHeaders();
	var url 	= setURL(url);
	var data	= setParams(data);
	var div		= (dv == 'undefined' || dv == null || dv == '') ? $('#layout') : dv;
	if (noloading != 1) { loadingOverlay(1,{ cancel : true }); }
	$.ajax({
		headers : headers,
		url : url, data : data, type : 'POST', dataType : 'html',
		error : function() {
			loadingOverlay(0,{});
			debug('Request Timeout, please try again!','error');
		}, success : function(html) {
			loadingOverlay(0,{});
			div.html(html);
			//window.scrollTo(0,0);
			bindClick();
			setTimeout(callback(html),100);
		}
	});
}


function loadJSON(url,data,callback) {
	var headers = setHeaders();
	var url 	= setURL(url);
	var data	= setParams(data);
	loadingOverlay(1,{});
	$.ajax({
		headers : headers,
		url : url, data : data, type : 'POST', dataType : 'json',
		error : function() {
			loadingOverlay(0,{ cancel : true });
			debug('Request Timeout, please try again!','error');
		}, success : function(html) {
			loadingOverlay(0,{});
			setTimeout(callback(html),100);
		}
	});
}



function initStart() {
	//debug('Application Starting','info');
	if (TOKEN_KEY == null || TOKEN_KEY == '') {
		TOKEN_KEY = md5(device.uuid+'-'+device.cordova);
		localStorage.setItem('token_key',TOKEN_KEY);
	}
	if (APPS_TOKEN == '' || APPS_TOKEN == null || APPS_TOKEN == 'undefined') {
		debug('Check Apps-Token Data','info');
		appVersionData();
		setTimeout(function() { window.location.reload(); },2000);
	} else {
		/**/
		if (APPS_ID == '' || APPS_ID == null || APPS_ID == 'undefined') {
			debug('Get Server Information','info');
			appServerData();
		} else {
			var headers = setHeaders();
			loadingOverlay(1,{});
			$.ajax({
				headers : headers,
				url : setURL('home'), data : setParams({}), type : 'POST', dataType : 'html',
				timeout: 10000,
				error : function(a,b,c) {
					//alert(a+' | '+b+' | '+c);
					loadingOverlay(0,{});
					errStsShow();
					bindClick();
					localStorage.removeItem('server_api_url');
					setTimeout(getServerURL,5000);
				}, success : function(html) {
					loadingOverlay(0,{});
					$('#layout').html(html);
					bindClick();
				}
			});
		}
	}
	
}

function errStsShow() {
	//$('#scrsts').html('<b>Tidak terhubung dengan server</b><div class="d-flex justify-content-between mt-2" style="gap:10px"><a href="index.html" class="btn btn-default"><i class="fas fa-sync"></i> Reload</a><a href="settings.html" class="btn btn-default"><i class="fas fa-cog"></i> Settings</a></div>');
	$('#scrsts').html('<b>Tidak terhubung dengan server</b><div class="text-center mt-2" style="gap:10px"><a resetapp class="btn btn-default"><i class="fas fa-sync"></i> Reload</a> <a href="settings.html" class="btn btn-default"><i class="fas fa-cog"></i> Settings</a></div>');
	$('[resetapp]').unbind('click').click(function(){
		localStorage.removeItem('server_api_url');
		window.location.assign('index.html');
	});
}


function appVersionData() {
	//debug('Get App name');
	cordova.getAppVersion.getAppName(function (version) {
    	localStorage.setItem('apps_name',version);
		APPS_NAME = version;
		//debug(version);
	});
	//debug('Get App Version Code');
	cordova.getAppVersion.getVersionCode(function (version) {
    	localStorage.setItem('apps_version_code',version);
		APPS_VERSION_CODE = version;
		//debug(version);
	});
	//debug('Get App Version Number');
	cordova.getAppVersion.getVersionNumber(function (version) {
    	localStorage.setItem('apps_version_number',version);
		APPS_VERSION_NUMBER = version;
		//debug(version);
	});
	
	cordova.getAppVersion.getPackageName(function (version) {
    	localStorage.setItem('apps_token',version);
		APPS_TOKEN = version;
		//debug(APPS_TOKEN);
	});
	//alert('Success');
}

function appServerData() {
	if(xhr && xhr.readyState != 4) { xhr.abort(); }
	//debug('Get Server Data');
	$.ajax({
		url : 'https://dev.csphotographymanado.com/?call=getProfile', type:'POST', dataType : 'json',
		error: function(a,b,c) {
			//alert(a+' | '+b+' | '+c);
		},
		headers : {
			'app_key' : APPS_TOKEN
		}, success: function(js) {
			$('#layout').html(js);
			if (js['done'] == 1) {
				if (js['user']['id'] > 0) {
					APPS_ID = js['user']['id'];
					//alert('Found: '+APPS_ID);
					localStorage.setItem('apps_id',APPS_ID);
					window.location.reload();
				} else {
					navigator.notification.alert(js['response']);
					errStsShow();
					return false;
				}
			} else { 
				navigator.notification.alert(js['response']);
				errStsShow();
				return false; 
			}
		}
	});
}

function getServerURL() {
	if(xhr && xhr.readyState != 4) { xhr.abort(); }
	//$('#layout').html(APPS_TOKEN);
	xhr = $.ajax({
		url : 'https://dev.csphotographymanado.com/?call=getProfile', type:'POST', dataType : 'json',
		error: function(a,b,c) {
			setTimeout(function() { window.location.reload(); },5000);
		},
		headers : {
			'app_key' : APPS_TOKEN,
			//'apps_id' : APPS_ID
		}, success: function(js) {
			$('#server-sts').html(js['response']);
			if (js['user']['server_url'] != '' && js['user']['server_url'] != null && js['user']['server_url'] != 'undefined') {
				CURRENT_API_URL = js['user']['server_url'];
				localStorage.setItem('server_api_url',CURRENT_API_URL);
				$('#scrsts').html('Connecting to Server... <img src="img/yloading.gif">');
				setTimeout(function() { window.location.reload(); },2000);
			} else {
				setTimeout(function() { window.location.reload(); },5000);
			}
				
		}
	});
}

function dialog(url,nama,title,callbackOpen,callbackClose) {
	var html = '<div class="modal fade" id="'+nama+'" tabindex="-1">'+
	  '<div class="modal-dialog modal-dialog-scrollable" role="document">'+
		'<div class="modal-content">'+
		  '<div class="modal-header">'+
			'<h5 class="modal-title" id="exampleModalScrollableTitle">'+title+'</h5>'+
			'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
			  '<span aria-hidden="true">&times;</span>'+
			'</button>'+
		  '</div>'+
		  '<div class="modal-body">'+
			'<img src="img/yloading.gif" /> Please Wait'+
		  '</div>'+
		  '<div class="modal-footer">'+
		  '</div>'+
		'</div>'+
	  '</div>'+
	'</div>';
	//alert(html);
	$('#'+nama).remove();
	$('body:first').prepend(html);
	$('#'+nama).modal('show').on('shown.bs.modal', function () {
		bindClick();
		loadHTML(url,{},$('#'+nama+' .modal-body'),callbackOpen);
	}).on('hidden.bs.modal',function(){
		bindClick();
		setTimeout(callbackClose,1);
	});
}

function modal(url,name,title,button,callback) {
	dialog(url,name,title,callback,function(){});
}

function debug(m,t) {
	if (t == null || t == 'undefined' || t == '') {
		t = 'question';
	}
	var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
	Toast.fire({
	  icon: t,
	  title: m
	});
}

function formatted_string(pad, user_str, pad_pos)
{
  if (typeof user_str === 'undefined') 
    return pad;
  if (pad_pos == 'l')
     {
     return (pad + user_str).slice(-pad.length);
     }
  else 
    {
    return (user_str + pad).substring(0, pad.length);
    }
}

function commaFormatted(amount) {
	var amount = amount + ',00';
	var a = amount.split(',', 1);
	var d = new String(a[1]);
	var i = parseInt(a[0]);
	if(isNaN(i)) { return ''; }
	var minus = '';
	if(i < 0) { minus = '-'; }
	i = Math.abs(i);
	var n = new String(i);
	var b = [];
	while(n.length > 3)
	{
		var nn = n.substr(n.length-3);
		b.unshift(nn);
		n = n.substr(0,n.length-3);
	}
	if(n.length > 0) { b.unshift(n); }
	n = b.join(",");
	if(a[1])
	{
	    if(d.length < 1) { amount = n; }
	    else { amount = n + ','+ d ; }
	}
	else
	{
	    amount = n;
	}
	amount = minus + amount;
	return amount;
}

function uploadFile(varObj) {
	//uri,fileURL,formName,mimeType
	var headers = setHeaders();
	headers['Connection'] = "close";
	
	var url = encodeURI(setURL(varObj.url));
	var fileURL = $(varObj.fileURL).val();
	var Params = setParams(getFormData($(varObj.formName)));
	var mimeType = varObj.mimeType ? varObj.mimeType : "image/jpeg";
	var progressBar = varObj.progressBar ? varObj.progressBar : '#progressbar';
	var options = new FileUploadOptions();
	var onSuccess = varObj.onSuccess;
	
	options.fileKey="file";
	options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
	options.mimeType=mimeType;
	options.headers = headers;
	options.params = Params;
	$('button, [type="button"], [type="submit"]',$(varObj.formName)).prop('disabled',true);
	ft = new FileTransfer();
	ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			$(progressBar).css({ width : perc + '%' });
		} else {
		}
	};
	loadingOverlay(1,{});
	ft.upload(fileURL, url,varObj.onSuccess,function(error){
		loadingOverlay(0,{});
		navigator.notification.alert('Upload Failed!\n'+ JSON.stringify(error),null,'');
		$('button, [type="button"], [type="submit"]',$(varObj.formName)).prop('disabled',false);
		ft.abort();	
	},options);
}

function showTips(option) {
	
	var now = new Date();
	//alert(now.getTime() + 15);
	var adsParams = {
		expiry : now.getTime() + (3600 * 1000)
	}
	var adExp = localStorage.getItem('adstip');
	var adsShow = 1;
	if (adExp != null) {
		
		var adsPrm = JSON.parse(adExp);
		if (parseInt(adsPrm.expiry) > parseInt(now.getTime())) {
			adsShow = 0;
			//alert(2);
			//localStorage.removeItem('adstip');
		}
	}
	if (adsShow == 1 || option.forceShow == true) {
		var content = '';
		var title = option.title ? option.title : 'Advertise';
		var dataURL = option.dataURL ? option.dataURL : '';
		var linkType = option.linkType == 'external' ? 'external-link' :  'get_url';
		var html = option.content ? '<div class="mb-2 p-2">'+option.content+'</div>' : '';
		var showTimer = option.timer ? option.timer : 10000;
		
		if (option.imgURL) {
			content += '<div class="mb-2"><img src="'+option.imgURL+'" class="img-fluid" /></div>';
		}
		content += html;
		var l = $('#layout');
		setTimeout(function() {
			l.prepend('<div id="ads" class="rounded">'+
			'<div class="ads-header">'
				+'<div class="d-flex justify-content-between">'
				+'<div class="ads-title text-green" style="font-size:0.8em">'+title+'</div>'
				+'<div class="close"><i class="fas fa-window-close fa-sm"></i></div>'
				+'</div>'
			+'</div>'
			+'<div class="ads-body rounded '+ (dataURL != '' ? linkType : '') +'" data-url="'+dataURL+'">'+content+'</div>'
			+'</div>');
			$(document).ready(function(){
				//alert(1);
				$('#ads .close').unbind('click').click(function(){ $('#ads').remove(); });
				var h = $('#ads').height();
				var wh = window.innerHeight;
				bindClick();
				if (showTimer > 0) {
					setTimeout(function(){ $('#ads').remove(); },showTimer);
				}
			});
		},1000);
		localStorage.setItem('adstip', JSON.stringify(adsParams));
	}
}

function imageUpload(options) {
	navigator.notification.confirm('Take a photo from?',function(a){
		if (a == 2) {
			var src = Camera.PictureSourceType.PHOTOLIBRARY;
		} else { var src = Camera.PictureSourceType.CAMERA; }
			var Camera_onSuccess = function(imageURI) {
			var image = document.getElementById(options.imgURL);
			image.src = imageURI;
			options.fileURL.val(imageURI);
				if (options.callBackFunction) {
					setTimeout(options.callBackFunction,0);
				}
		}
		var Camera_onFail = function(message) {

		}
		navigator.camera.getPicture(Camera_onSuccess, Camera_onFail, { 
			quality: 100,
			destinationType: Camera.DestinationType.FILE_URI,
			saveToPhotoAlbum: options.saveToPhotoAlbum,
			correctOrientation : true,
			sourceType: src
		});
	},'','Camera,Gallery');
}

function flayer(options) {
	var title = options.title ? options.title : '';
	var callBackOpen = options.callBackOpen ? options.callBackOpen : null;
	var callBackClose = options.callBackClose ? options.callBackClose : null;
	$('#flayer').remove();
	var html = '<div id="flayer" class="bg-white p-0 shadow rounded" style=" margin-left:2%; border:1px solid #000 !important; display:none; position:fixed; width:96%; max-height:90vh; bottom:2%; overflow:auto; z-index:9999">';
	html +='<div class="d-flex p-2 justify-content-between"><div class="flayer-title">'+title+'</div><div class="close"><i class="fa fa-times"></i></div></div>';
	html +='<div class="flayer-body p-2" style="max-height:64vh; overflow:auto">';
	html +='</div>'
	html += '</div>';
	$('#layout').prepend(html);
	$('#flayer').slideDown('slow',callBackOpen);
	$('#flayer .close').unbind('click').click(function(){
		$('#flayer').fadeOut('slow',function(){ 
			$('#flayer').remove(); 
			if (callBackClose) { setTimeout(callBackClose,0); }
	  	});
	});
}
