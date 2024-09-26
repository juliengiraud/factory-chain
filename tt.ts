import { findMultiplier } from "./ppcm"

const items = {
    wood: 'wood',
    plank: 'plank',
    stick: 'stick',
    workbench: 'workbench',
    chest: 'chest'
} as const
type Item = typeof items[keyof typeof items]

type CraftNeed = { key: Item, quantity: number }
type Craft = { time: number, quantity: number, needs: Array<CraftNeed> } // time in seconds
// test dependencies
const crafts: Record<Item, Craft> = {
    [items.wood]: { time: 1, quantity: 1, needs: [] },
    [items.plank]: { time: 1, quantity: 1, needs: [{ key: items.wood, quantity: 1 }] },
    [items.stick]: { time: 1, quantity: 1, needs: [{ key: items.plank, quantity: 1 }] },
    [items.workbench]: { time: 1, quantity: 1, needs: [{ key: items.plank, quantity: 1 }] },
    [items.chest]: { time: 1, quantity: 1, needs: [{ key: items.workbench, quantity: 1 }, { key: items.plank, quantity: 1 }] },
}
// const crafts: Record<Item, Craft> = {
//     [items.wood]: { time: 1, quantity: 1, needs: [] },
//     [items.plank]: { time: 2, quantity: 4, needs: [{ key: items.wood, quantity: 1 }] },
//     [items.stick]: { time: 3, quantity: 4, needs: [{ key: items.plank, quantity: 2 }] },
//     [items.workbench]: { time: 4, quantity: 1, needs: [{ key: items.plank, quantity: 4 }] },
//     [items.chest]: { time: 5, quantity: 1, needs: [{ key: items.workbench, quantity: 1 }, { key: items.plank, quantity: 8 }] },
// }

function isAdvancedItem(item: Item) {
    return crafts[item].needs.length > 0
}

type Need = { item: Item, quantity: number, source: string }
function fillAllNeeds(item: Item, quantity: number, isFirst = true): Need[] {
    const needCrafts: Need[] = isFirst ?
        [ { item, quantity, source: `for ${item}` } ] : []
    const craft = crafts[item]

    for (const need of craft.needs) {
        const needCraft = crafts[need.key]

        needCrafts.push({ item: need.key, quantity: 1, source: `for ${item}` })

        if (isAdvancedItem(item)) {
            needCrafts.push(...fillAllNeeds(need.key, 1, false))
        }
    }

    return needCrafts
}

const test = fillAllNeeds(items.stick, 1)
console.log(test)
