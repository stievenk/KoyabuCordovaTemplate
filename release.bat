call cordova build android --release -- --keystore=watulambot.keystore --storePassword=yohanes --alias=watulambot-apps --password=yohanes --packageType=apk
copy /Y "%CD%\platforms\android\app\build\outputs\apk\release\app-release.apk" "%CD%\..\build\release_hkm_1.0.0.apk" 
