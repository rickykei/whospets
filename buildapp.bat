#stephen@nfctouch.com.hk, password: pengate213

#$ keytool -genkey -v -keystore com.whospets.aos.keystore -alias com.whospets.aos -keyalg RSA -keysize 2048 -validity 10000


ionic cordova build android --release
ionic cordova build android --prod --release

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore com.whospets.aos.keystore D:\GitHub\whospets\platforms\android\build\outputs\apk\android-release-unsigned.apk com.whospets.aos
globetrf
-- joanne:
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore C:\Users\joanne.wong\Desktop\Joanne-Github\whospets\com.whospets.aos.keystore C:\Users\joanne.wong\Desktop\Joanne-Github\whospets\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk com.whospets.aos


cd D:\GitHub\whospets\platforms\android\build\outputs\apk
zipalign -v 4 android-release-unsigned.apk whospets.apk
--joanne
C:\sdk-tools-windows\build-tools\28.0.3\zipalign.exe -v 4 android-release-unsigned.apk whospets.apk
cd d:\GitHub\whospets
pause