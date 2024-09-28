import { Fraction } from "../fraction";

export type Item = typeof items[keyof typeof items]
export type CraftNeed = { key: Item, quantity: Fraction }
export type Craft = { time: Fraction, quantity: Fraction, needs: Array<CraftNeed> } // time in seconds

export const items = {
    sand: "sand",
    sulfur: "sulfur",
    concrete: "concrete",
  } as const;

export const crafts: Record<Item, Craft> = {
    [items.sand]: { time: new Fraction(12), quantity: new Fraction(1), needs: [] },
    [items.sulfur]: { time: new Fraction(2.4), quantity: new Fraction(1), needs: [] },
    [items.concrete]: {
        time: new Fraction(9.6),
        quantity: new Fraction(4),
        needs: [{ key: items.sand, quantity: new Fraction(1) }, { key: items.sulfur, quantity: new Fraction(2) }],
    },
} as const
