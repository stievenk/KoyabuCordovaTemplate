// Config
/* Local */
var SERVER_PROTOCOL = 'http://';
var SERVER_ADDR = '192.168.16.117';
var SERVER_PATH = '/projects/Android-Apps/Android_12-13/HENSKRISTAL_M/web/api/';

/* Publish * /
var SERVER_PROTOCOL = 'https://';
var SERVER_ADDR = 'api.dimanado.biz.id';
var SERVER_PATH = '/hkm/';

/**/

var API_URL = SERVER_PROTOCOL + SERVER_ADDR + SERVER_PATH;
var DEBUG = 0;

var USER_TOKEN = localStorage.getItem('user_token');
var APPS_TOKEN = localStorage.getItem('apps_token');
var APPS_ID = localStorage.getItem('apps_id');
var APPS_VERSION_CODE = localStorage.getItem('apps_version_code');
var APPS_NAME = localStorage.getItem('apps_name');
var APPS_VERSION_NUMBER = localStorage.getItem('apps_version_number');

var CURRENT_API_URL = localStorage.getItem('server_api_url');
var lng = localStorage.getItem('LNG');
var	lat = localStorage.getItem('LAT');

// Zero-Point Manado
lat = isNaN(parseFloat(lat)) ? -6.182676660940515 : parseFloat(lat);
lng = isNaN(parseFloat(lng)) ? 106.83166499543391 : parseFloat(lng);

/**/
if (CURRENT_API_URL != '' && CURRENT_API_URL != null && CURRENT_API_URL != 'undefined') {
	API_URL = CURRENT_API_URL;
}

var TOKEN_KEY = localStorage.getItem('token_key');
/**/