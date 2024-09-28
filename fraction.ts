import { Fraction as Fraction_ } from "fractional";

export class Fraction {
    private fraction: any

    constructor(numerator: number | string, denominator?: number) {
        this.fraction = new Fraction_(numerator, denominator)
    }

    getNumerator(): number {
        return this.fraction.numerator
    }
    getDenominator(): number {
        return this.fraction.denominator
    }

    toResult(f: any) {
        return new Fraction(f.numerator, f.denominator)
    }
    toNumberOrFraction(b: Fraction | number) {
        return typeof b === 'number' ? b : b.fraction
    }

    add(b: Fraction | number): Fraction {
        return this.toResult(this.fraction.add(this.toNumberOrFraction(b)))
    }
    subtract(b: Fraction | number): Fraction {
        return this.toResult(this.fraction.subtract(this.toNumberOrFraction(b)))
    }
    multiply(b: Fraction | number): Fraction {
        return this.toResult(this.fraction.multiply(this.toNumberOrFraction(b)))
    }
    divide(b: Fraction | number): Fraction {
        return this.toResult(this.fraction.divide(this.toNumberOrFraction(b)))
    }
    equals(b: Fraction): boolean {
        return this.fraction.equals(b)
    }
    toString(): string {
        // return this.fraction.toString()
        return (this.fraction.numerator / this.fraction.denominator) + ''
    }
}
