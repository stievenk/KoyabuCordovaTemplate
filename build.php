<?php
$XMLfile = realpath(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'config.xml';
$data = file_get_contents($XMLfile);
$json = file_get_contents(realpath(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'package.json');
$config = json_decode($json,true);
preg_match("#<widget.+?version=\"(.+?)\".+?>#si",$data,$r);
$version = $r[1];

preg_match("#<name>(.+?)<\/name>#si",$data,$r);
$appsname = strtolower(str_replace(" ","_",$r[1]));

preg_match("#<engine name=\"android\" spec=\"(.+?)\" \/>#si",$data,$x);
//$android = str_replace(array("^","~"),"",$x[1]);
$android = $config['devDependencies']['cordova-android'];
$android = $android ? $android : '8.0.0';

echo "BUILD ANDROID@{$android} {$appsname}@{$version}\n\n";

switch($argv[1]) {
	case 'refresh' :
	case 'reload' :
	case 'rmadd' :
		$line .= "call cordova platform rm android\r\n";
		$line .= "call cordova platform add android\r\n";
	break;
	case 'add' :
		$line .= "call cordova platform add android\r\n";
	break;
	case 'remove' :
	case 'rm' :
		$line .= "call cordova platform rm android\r\n";
	break;
	case 'aab' :
	case 'release' :
	case 'bundle' :
		$line .= "call cordova build android --release -- --keystore=watulambot.keystore --storePassword=yohanes --alias=watulambot-apps --password=yohanes --packageType=bundle\r\n";
		$line .="copy /Y \"%CD%\\platforms\\android\\app\\build\\outputs\\bundle\\release\\app-release.aab\" \"%CD%\\..\\build\\bundle_{$appsname}_{$version}.aab\" \r\n";
	
	break;

	case 'releaseapk' :
		case 'apk' :
			$line .= "call cordova build android --release -- --keystore=watulambot.keystore --storePassword=yohanes --alias=watulambot-apps --password=yohanes --packageType=apk\r\n";
			$line .="copy /Y \"%CD%\\platforms\\android\\app\\build\\outputs\\apk\\release\\app-release.apk\" \"%CD%\\..\\build\\release_{$appsname}_{$version}.apk\" \r\n";
		
		break;
	case 'demo' :
	default :
		$line .= "call cordova build android\r\n";
		$line .="copy /Y \"%CD%\\platforms\\android\\app\\build\\outputs\\apk\\debug\\app-debug.apk\" \"%CD%\\..\\build\\{$appsname}_{$version}_debug.apk\" \r\n";

	break;
}
echo $line;
file_put_contents(realpath(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'release.bat',$line);1
?>