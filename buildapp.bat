#stephen@nfctouch.com.hk, password: pengate213

#$ keytool -genkey -v -keystore com.whospets.aos.keystore -alias com.whospets.aos -keyalg RSA -keysize 2048 -validity 10000


ionic cordova build android --release


jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore com.whospets.aos.keystore D:\GitHub\whospets\platforms\android\build\outputs\apk\android-release-unsigned.apk com.whospets.aos
globetrf

cd D:\GitHub\whospets\platforms\android\build\outputs\apk
zipalign -v 4 android-release-unsigned.apk whospets.apk
cd d:\GitHub\whospets
pause