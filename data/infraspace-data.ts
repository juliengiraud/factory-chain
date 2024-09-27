export type Item = typeof items[keyof typeof items]

export type CraftNeed = { key: Item, quantity: number }
export type Craft = { time: number, quantity: number, needs: Array<CraftNeed> } // time in seconds

export const items = {
    sand: "sand",
    sulfur: "sulfur",
    concrete: "concrete",
  } as const;

export const crafts: Record<Item, Craft> = {
    [items.sand]: { time: 12, quantity: 1, needs: [] },
    [items.sulfur]: { time: 2.4, quantity: 1, needs: [] },
    [items.concrete]: {
        time: 9.6,
        quantity: 4,
        needs: [{ key: items.sand, quantity: 1 }, { key: items.sulfur, quantity: 2 }],
    },
} as const
