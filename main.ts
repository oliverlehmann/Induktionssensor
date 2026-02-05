ldc1612.start()
basic.pause(1000)
ldc1612.setSensitivity(15000)
ldc1612.calibrate()
basic.forever(function () {
    basic.showNumber(ldc1612.strength())
    if (ldc1612.detected()) {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)
        pins.digitalWritePin(DigitalPin.C16, 1)
    } else {
        pins.digitalWritePin(DigitalPin.C16, 0)
    }
})
