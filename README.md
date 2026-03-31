# academicconnect

this repository contains the academicconnect mobile app. the app is built with expo and react native and runs locally without a backend.

## prerequisites

install node.js and npm. install expo go on your android phone.

## run on linux

open a terminal in the app folder and run the following commands.

```bash
npm install
npm start -- --clear
```

for android usb debugging without tunnel use adb reverse. enable usb debugging on the phone and accept the rsa prompt. then run.

```bash
adb devices
adb reverse tcp:19000 tcp:19000
adb reverse tcp:8081 tcp:8081
```

open expo go and connect to exp://127.0.0.1:8081.

## run on windows

open powershell in the app folder and run the following commands.

```powershell
npm install
npm start -- --clear
```

for android usb debugging without tunnel use adb reverse. enable usb debugging on the phone and accept the rsa prompt. then run.

```powershell
adb devices
adb reverse tcp:19000 tcp:19000
adb reverse tcp:8081 tcp:8081
```

open expo go and connect to exp://127.0.0.1:8081.
