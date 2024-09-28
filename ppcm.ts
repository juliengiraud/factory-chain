import { Fraction } from './fraction'

// Fonction pour obtenir le plus petit commun multiple (PPCM)
function lcm(a: number, b: number): number {
    const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
    return Math.abs(a * b) / gcd(a, b);
}

// Trouver le PPCM d'une liste de nombres
function lcmList(lst: number[]): number {
    return lst.reduce((a, b) => lcm(a, b));
}

export function findMultiplier(numbers: Fraction[]): number {
    const denominators: number[] = numbers.map(n => n.getDenominator())
    return lcmList(denominators);
}
