import { findMultiplier } from "./ppcm"

const items = {
    iron: 'iron',
    wood: 'wood',
    stone: 'stone',
    stick: 'stick',
    plank: 'plank',
    piston: 'piston',
    superPiston: 'super_piston',
} as const
type Item = typeof items[keyof typeof items]

type CraftNeed = { key: Item, quantity: number }
type Craft = { time: number, quantity: number, needs: Array<CraftNeed> } // time in seconds
const crafts: Record<Item, Craft> = {
    [items.iron]: { time: 1, quantity: 1, needs: [] },
    [items.wood]: { time: 1, quantity: 1, needs: [] },
    [items.stone]: { time: 1, quantity: 1, needs: [] },
    [items.stick]: { time: 2, quantity: 1, needs: [ { key: items.plank, quantity: 2 } ] },
    [items.plank]: { time: 1, quantity: 1, needs: [ { key: items.wood, quantity: 1 } ] },
    [items.piston]: { time: 12, quantity: 1, needs: [ { key: items.iron, quantity: 1 }, { key: items.plank, quantity: 3 }, { key: items.stone, quantity: 4 } ] },
    [items.superPiston]: { time: 12, quantity: 1, needs: [ { key: items.piston, quantity: 1 }, { key: items.stick, quantity: 4 } ] },
}

const distances = computeDistances()


function computeDistance(item: Item) {
    if (!isAdvancedItem(item)) {
        return 0
    }
    const craft = crafts[item]
    return 1 + Math.max(
        ...craft.needs.map(need => computeDistance(need.key))
    )
}

function computeDistances() {
    const distances = {} as Record<Item, number>
    Object.values(items).forEach(item => distances[item] = computeDistance(item))
    return distances
}

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
        const needQuantityPerTickWeWant = need.quantity * quantity
        const needCraftSpeed = (needCraft.quantity / needCraft.time) * needQuantityPerTickWeWant
        const ratio = needCraftSpeed / needQuantityPerTickWeWant

        needCrafts.push({ item: need.key, quantity: ratio, source: `for ${item}` })

        if (isAdvancedItem(item)) {
            needCrafts.push(...fillAllNeeds(need.key, ratio, false))
        }
    }

    return needCrafts
}

function computeAggregateNeeds(
    item: Item,
    mainMachineQuantity: number,
    needs: Need[]
) {
    const aggregateNeeds = {} as Record<Item, { quantity: number, source: string[] }>

    for (const need of needs) {
        if (!aggregateNeeds[need.item]) {
            aggregateNeeds[need.item] = { quantity: 0, source: [] }
        }
        aggregateNeeds[need.item].quantity += need.quantity
        aggregateNeeds[need.item].source.push(need.source)
    }
    return aggregateNeeds
}

function computeNeeds(item: Item, mainMachineQuantity: number) {
    const needCrafts = fillAllNeeds(item, mainMachineQuantity)
    const aggregateNeeds = computeAggregateNeeds(item, mainMachineQuantity, needCrafts)
    console.log(needCrafts)
    return
    return aggregateNeeds
}

function doTheThing(item: Item, mainMachineQuantity: number) {
    const needs = computeNeeds(item, mainMachineQuantity)
    return

    const machineNeeds: Array<{ item: Item, value: number }> = []
    for (const key of Object.values(items)) {
        if (needs[key]) {
            const craft = crafts[key]
            // Calcul du nombre de machines nécessaires
            const machines = needs[key].quantity / (craft.quantity / (craft.time))
            machineNeeds.push({ item: key, value: machines })
        }
    }
    machineNeeds.sort((a, b) => distances[a.item] - distances[b.item])

    console.log("\nMachines required:")
    let lastDistance = 0
    machineNeeds.forEach((value) => {
        const distance = distances[value.item]
        if (distance > lastDistance) {
            lastDistance = distance
            console.log("╠═ ")
        }
        // console.log(`${value.value} machines for ${value.item} to produce ${needs[value.item].quantity} items per minute, step: ${distance}`)
        console.log(`${needs[value.item].quantity} machines for ${value.item} to produce ${value.value} every ${crafts[value.item].time} ticks, step: ${distance}`)
    })
    const ppcm = findMultiplier(machineNeeds.map(m => m.value))
    console.log(`\nMachines required for full numbers (with ppcm = ${ppcm}):`)
    lastDistance = 0
    machineNeeds.forEach((value) => {
        const distance = distances[value.item]
        if (distance > lastDistance) {
            lastDistance = distance
            console.log("╠═ ")
        }
        console.log(`${value.value * ppcm} machines for ${value.item} to produce ${needs[value.item].quantity * ppcm} items per minute, step: ${distance}`)
    })
}

doTheThing(items.stick, 1)
