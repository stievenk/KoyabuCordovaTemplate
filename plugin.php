<?php
$XMLfile = realpath(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'config.xml';
//echo "{$XMLfile}\n";
$data = file_get_contents($XMLfile);
preg_match("#<widget.+?version=\"(.+?)\".+?>#si",$data,$r);
$version = $r[1];

$opt = $argv[1] ? $argv[1] : 'add'; 

preg_match("#<name>(.+?)<\/name>#si",$data,$r);
$appsname = strtolower(str_replace(" ","_",$r[1]));

$of = file_get_contents('plugin_list.txt');
$plugin = array_unique(explode("\n",$of));
$line = "";
if (count($plugin) > 0) {
	foreach($plugin as $v) {
		if (!trim($v)) continue;
		$v = str_replace(array("{APPS_NAME}"),array("{$appsname}"),$v);
		list($rem) = explode(" ",$v);
		if (trim($rem) == 'rem') continue;
		if ($opt == 'remove' || $opt == 'rm') {
			list($v) = explode("@",$v);
		}
		$line.="call cordova plugin {$opt} ". trim($v) ."\r\n";
	}
}
file_put_contents('install_plugin.bat',$line);
?>