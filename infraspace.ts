import { crafts, items } from "./data/infraspace-data"
import { printDependencyTree } from "./dependency-utils";

for (const item of Object.values(items)) {
    printDependencyTree(item, 3, crafts, items)
}
