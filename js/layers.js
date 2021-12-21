var tabFormatHandler = {
    makeGeneratorsList() {
        var list = ["row", [
            ["column", []],
            "blank",
            ["v-line", "30px"],
            "blank",
            ["column", []],
            "blank",
            ["v-line", "30px"],
            "blank",
            ["column", []]
        ]]
        for (const key in player.e.isGeneratorUnlocked)
            if (player.e.isGeneratorUnlocked[key]) {
                list[1][0][1].push(["display-text", tmp.e.buyables[key].name])
                list[1][4][1].push(["display-text", tmp.e.buyables[key].description])
                list[1][8][1].push(["buyable", key])
            }
        return list
    },
}

var buyablesHandler = {
    makeGeneratorBuyable(name, description, cost, usage, energyGain) {
        return {
            cost() {
                return cost
            },
            display() { return "Buy" },
            name: name,
            description: description,
            usage: usage,
            canAfford() { return Object.entries(this.cost()).every(([k, v]) => player.f.resources[k].gte(v)) },
            buy() {
                Object.entries(this.cost()).forEach(([k, v]) => player.f.resources[k] = player.f.resources[k].sub(v))
                addBuyables(this.layer, this.id, 1)
            },
            effect() {
                return new Decimal(energyGain).times(getBuyableAmount(this.layer, this.id))
            },
            tooltip() { return "To buy this, you need:<br>" + Object.entries(this.cost()).map(([k, v]) => [v, k].join(" ")).join("<br>") },
            style() { return { "width": "30px", "height": "30px" } }
        }
    }
}

addLayer("f", {

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            resources: {
                space: new Decimal(10),
                energy: new Decimal(0),

                coal: new Decimal(10),
                ironOres: new Decimal(10),
                ironPlates: new Decimal(10),
                copperOres: new Decimal(10),
                copperPlates: new Decimal(10),
                copperWires: new Decimal(10),
                circutBoards: new Decimal(10),
            }
        }
    },

    name: "factory",
    color: "#ff9900",
    row: 0,
    type: "none",
    resource: "space",
    layerShown() { return true },

    tabFormat: [
        ["display-text", function () { return `You have ${format(player.f.resources.space)} space` }],
        ["row", [
            ["clickable", "energy"],
            ["clickable", "mining"],
        ]],
        ["row", [
            ["clickable", "processing"],
            ["clickable", "assembly"],
        ]],
        ["row", [
            ["clickable", "research"]
        ]]
    ],

    clickables: {
        "energy": {
            display() { return "Click this to enter energy district" },
            canClick() { return true },
            onClick() { player.tab = "e" }
        },
        "mining": {
            display() { return "Click this to enter mining district" },
            canClick() { return true },
            onClick() { player.tab = "m" }
        },
        "processing": {
            display() { return "Click this to enter processing district" },
            canClick() { return true },
            onClick() { player.tab = "p" }
        },
        "assembly": {
            display() { return "Click this to enter assembly district" },
            canClick() { return true },
            onClick() { player.tab = "a" }
        },
        "research": {
            display() { return "Click this to enter research district" },
            canClick() { return true },
            onClick() { player.tab = "r" }
        }
    }
})

addLayer("e", {

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            isGeneratorUnlocked: {
                coal: true,
                //solar: false,
            }
        }
    },

    name: "energy district",
    color: "#ff9900",
    row: "none",
    type: "none",
    resource: "energy",
    layerShown() { return false },

    tabFormat: [
        ["display-text", function () { return `You have ${format(player.f.resources.energy)} energy` }],
        ["display-text", function () { return `You have ${format(player.f.resources.space)} space` }],
        "blank",
        ["display-text", "Generators"],
        tabFormatHandler.makeGeneratorsList
    ],

    buyables: {
        "coal": buyablesHandler.makeGeneratorBuyable(
            "Coal Power Plant",
            "Provides 4 energy. Uses 1 coal per second",
            {space: new Decimal(1), ironPlates: new Decimal(5), copperPlates: new Decimal(5), circutBoards: new Decimal(2)},
            {coal: new Decimal(1)},
            new Decimal(4)
        )
    },

    update(diff) {
        playerEnergy = new Decimal(0)
        for (const key in player.e.isGeneratorUnlocked) {
            isContent = true
            Object.entries(tmp.e.buyables[key].usage).forEach(([k, v]) => {
                if(player.f.resources[k].gte(v.times(diff).times(getBuyableAmount(this.layer, key))))
                    player.f.resources[k] = player.f.resources[k].sub(v.times(diff).times(getBuyableAmount(this.layer, key)))
                else
                    isContent = false
            })
            if (isContent)
                playerEnergy = playerEnergy.add(tmp.e.buyables[key].effect)
        }
        player.f.resources.energy = playerEnergy
    } 
})

addLayer("m", {

})

addLayer("p", {

})

addLayer("a", {

})

addLayer("r", {

})