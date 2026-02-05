//% color=#2E8B57 icon="\uf1b2" block="LDC1612 Metall-Sensor"
namespace ldc1612 {

    let ADDR = 43
    let baseline = 0
    let threshold = 20000

    function writeReg16(reg: number, value: number) {
        let b = pins.createBuffer(3)
        b.setUint8(0, reg)
        b.setUint8(1, (value >> 8) & 0xFF)
        b.setUint8(2, value & 0xFF)
        pins.i2cWriteBuffer(ADDR, b, false)
    }

    function readReg16(reg: number): number {
        pins.i2cWriteNumber(ADDR, reg, NumberFormat.UInt8BE, true)
        return pins.i2cReadNumber(ADDR, NumberFormat.UInt16BE, false)
    }

    function read28bit(): number {
        let msb = readReg16(0x00)
        let lsb = readReg16(0x01)
        return ((msb & 0x0FFF) << 16) | lsb
    }

    //% block="LDC1612 starten"
    export function start() {
        writeReg16(0x08, 0x4000)
        writeReg16(0x1A, 0x0801)
        basic.pause(50)
    }

    //% block="LDC1612 kalibrieren"
    export function calibrate() {
        let sum = 0
        for (let i = 0; i < 20; i++) {
            sum += read28bit()
            basic.pause(20)
        }
        baseline = Math.idiv(sum, 20)
    }

    //% block="Metall erkannt?"
    export function detected(): boolean {
        return strength() >= 1
    }

    //% block="Signalstärke (0 bis 5)"
    export function strength(): number {
        let d = Math.abs(read28bit() - baseline)
        let s = Math.idiv(d * 5, threshold)
        return Math.min(5, s)
    }

    //% block="Empfindlichkeit setzen %value"
    //% value.min=2000 value.max=50000 value.defl=20000
    export function setSensitivity(value: number) {
        threshold = value
    }
}