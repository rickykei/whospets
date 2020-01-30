-- 01/30/2020
- ionic cordova build android
-> if found below issue:ERR_CLEARTEXT_NOT_PERMITTED
add this line
android:usesCleartextTraffic="true"
to
platforms/android/app/src/main/AndroidManifest.xml 

<application android:hardwareAccelerated="true" 
android:icon="@mipmap/icon" 
android:label="@string/app_name" 
android:supportsRtl="true" 
`android:usesCleartextTraffic="true"`>