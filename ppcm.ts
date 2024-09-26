import { Fraction } from './fraction'
// import { Fraction } from './node_modules/fractional'

// Fonction pour obtenir le plus petit commun multiple (PPCM)
function lcm(a: number, b: number): number {
    const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
    return Math.abs(a * b) / gcd(a, b);
}

// Trouver le PPCM d'une liste de nombres
function lcmList(lst: number[]): number {
    return lst.reduce((a, b) => lcm(a, b));
}

export function findMultiplier(numbers: number[]): number {
    const denominators: number[] = numbers.map(n => new Fraction(n).denominator)
    return lcmList(denominators);
}

// console.log(new Fraction(5/7))
