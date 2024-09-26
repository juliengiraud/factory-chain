export class Fraction {
    private _sign: number
    private _number: number
    private _fraction: string | number
    private _remainder: boolean
    numerator: number
    denominator: number

    constructor(fraction, remainder = true) {
        if (fraction === 0) {
            this._fraction = 0;
            this._number = 0;
            return;
        }

        this._fraction = parseFloat(fraction);
        this._remainder = remainder;

        this._sign = Math.sign(fraction);

        if (remainder) {
            this._number = Math.floor(Math.abs(this._fraction));
            let fixedLength = Math.abs(this._fraction).toString().length - this._number.toString().length - 1;
            if (fixedLength === -1) {
                fixedLength = 0
            }
            this._fraction = (Math.abs(this._fraction) - this._number).toFixed(fixedLength);
        }

        let decimalPos = this._fraction.toString().indexOf('.');
        let len = Math.abs(this._fraction as number).toString().length - decimalPos - this._sign;

        this.denominator = Math.floor(Math.pow(10, len));
        this.numerator = Math.floor(Math.abs(this._fraction as number) * this.denominator);

        let divisor = this.#gcd(this.numerator, this.denominator);

        this.numerator /= divisor;
        this.denominator /= divisor;

        if (remainder) this._number *= this._sign;
        else this.numerator *= this._sign;
    }

    get number() {
        return (this._remainder && Object.is(this._sign, -0) ? '-' : '') + this._number;
    }

    #gcd(a, b) {
        if (!b) return a;

        return this.#gcd(b, Math.floor(a % b)); // Discard any fractions due to limitations in precision.
    }
}
