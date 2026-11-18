# Firmware verification

BUSY Bar Emulator 0.1.0-beta.5, firmware 1.3.1.

Dispatched an incorrect train order, then solved all eight yards through emulator wheel and button input. Firmware reported each target reached and the final 3-flip record. Back exited cleanly (75.7 KiB peak).

The app was typechecked, built, installed and exercised on the emulator. Native captures are under screenshots/. The tested installable archive is in packages/.

Firmware motion pass: up, ok, start. 28 distinct frames in the controls recording. App io.ncoooooper.signalbox exited: finished; heap peak 86.9 of 128 KiB.

## Display capture

Firmware 1.3.1 rendered both README examples. Each square in a guide GIF is one front LED in a 16 × 16 cell. The production archive was built from the source in this repository.

## Screen transition capture

Firmware 1.3.1 rendered the display sequences in the README. The guide uses a 14 × 14 lit area inside each 16 × 16 cell. Input sequences, frame counts and the release archive checksum are in [the capture record](media/screen-transitions.json).
