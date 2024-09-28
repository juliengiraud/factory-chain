import { Fraction } from "./fraction"
import { findMultiplier } from "./ppcm"

// export type Item = typeof items[keyof typeof items]
export type CraftNeed<Item> = {
    key: Item,
    quantity: Fraction
}
export type Craft<Item> = {
    time: Fraction,
    quantity: Fraction,
    needs: Array<CraftNeed<Item>>
}

export type Need<Item> = { item: Item, quantity: Fraction, source: string }
export type AggregatedNeed<Item> = Omit<Need<Item>, 'source'> & { source: string[] }

export function printDependencyTree<Item extends string>(
    item: Item,
    mainMachineQuantity: number,
    crafts: Record<Item, Craft<Item>>,
    items: Record<Item, Item>,
) {

    function isAdvancedItem(item: Item) {
        return crafts[item].needs.length > 0
    }

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
        Object.values(items).forEach((item) => distances[item as Item] = computeDistance(item as Item))
        return distances
    }

    function fillAllNeeds(item: Item, quantity: Fraction, isFirst = true): Need<Item>[] {
        const needCrafts: Need<Item>[] = isFirst ?
            [ { item, quantity, source: item } ] : []
        const craft = crafts[item]
        const totalCraftSpeed = craft.quantity.multiply(quantity).divide(craft.time)

        for (const need of craft.needs) {
            // this can be simplified but it's easier that way
            const needCraft = crafts[need.key];
            const ratioNeedToItem = need.quantity.divide(craft.quantity)
            const needAmount = totalCraftSpeed.multiply(ratioNeedToItem)
            const needSpeed = needCraft.quantity.divide(needCraft.time)
            const needQuantity = needAmount.divide(needSpeed)

            needCrafts.push({ item: need.key, quantity: needQuantity, source: `for ${totalCraftSpeed} ${item}/t` });

            if (isAdvancedItem(item)) {
              needCrafts.push(...fillAllNeeds(need.key, needQuantity, false));
            }
        }

        return needCrafts
    }

    function aggregateNeeds(needs: Need<Item>[]): AggregatedNeed<Item>[] {
        const aggregateNeeds: { [item: string]: AggregatedNeed<Item> } = {}

        for (const need of needs) {
            if (!aggregateNeeds[need.item]) {
                aggregateNeeds[need.item] = { item: need.item, quantity: new Fraction(0), source: [] }
            }
            aggregateNeeds[need.item].quantity = aggregateNeeds[need.item].quantity.add(need.quantity)
            aggregateNeeds[need.item].source.push(need.source)
        }
        return Object.values(aggregateNeeds)
    }

    function computeNeeds() {
        const needCrafts = fillAllNeeds(item, new Fraction(mainMachineQuantity))
        const aggregatedNeeds = aggregateNeeds(needCrafts)

        const distances = computeDistances()

        return aggregatedNeeds
            .map((need) => ({ ...need, distance: distances[need.item] }))
            .sort((a, b) => a.distance - b.distance)
    }

    function printDependencyTree() {
        console.log(`----Dependency tree for ${mainMachineQuantity} ${item} machine${mainMachineQuantity >= 2 ? 's' : ''}----`)
        const machineNeeds = computeNeeds()
        console.log("Machines required:")
        let lastDistance = 0
        machineNeeds.forEach((value) => {
            if (value.distance > lastDistance) {
                lastDistance = value.distance
                console.log("╠═ ")
            }
            console.log(`${value.quantity} ${value.item} machines to produce ${crafts[value.item].quantity.multiply(value.quantity)} ${value.item} every ${crafts[value.item].time} ticks, step: ${value.distance}`)
        })
        const ppcm = findMultiplier(machineNeeds.map(m => m.quantity))
        if (ppcm === 1) {
            console.log("\nAlready optimal\n")
            return
        }
        console.log(`\nMachines required for full numbers (with ppcm = ${ppcm}):`)
        lastDistance = 0
        machineNeeds.forEach((value) => {
            if (value.distance > lastDistance) {
                lastDistance = value.distance
                console.log("╠═ ")
            }
            console.log(`${value.quantity.multiply(ppcm)} ${value.item} machines to produce ${crafts[value.item].quantity.multiply(value.quantity).multiply(ppcm)} ${value.item} every ${crafts[value.item].time} ticks, step: ${value.distance}`)
        })
        console.log("")
    }

    return printDependencyTree()
}
