
const troopLevel = document.querySelector("#troop_level");
const fleetSize = document.querySelector("#fleet_size");
const attacks = document.querySelector("#attacks");

const troopLoadBonus = document.querySelector("#troop_load_bonus");
const fleetLoadBonus = document.querySelector("#fleet_load_bonus");
const guildLoadBonus = document.querySelector("#guild_load_bonus");

const scoutedWood = document.querySelector("#scouted_wood");
const scoutedIron = document.querySelector("#scouted_iron");
const scoutedCoal = document.querySelector("#scouted_coal");

const fScoutedWood = document.querySelector("#f_scouted_wood");
const fScoutedIron = document.querySelector("#f_scouted_iron");
const fScoutedCoal = document.querySelector("#f_scouted_coal");

const totalPlunderedLoad = document.querySelector("#total_load");
const plunderedWood = document.querySelector("#plundered_wood");
const plunderedIron = document.querySelector("#plundered_iron");
const plunderedCoal = document.querySelector("#plundered_coal");
const load = document.querySelector("#load");
const loadMeter = document.querySelector("#load_meter");

troopLevel.addEventListener("input", calculate);
fleetSize.addEventListener("input", calculate);
attacks.addEventListener("input", calculate);
troopLoadBonus.addEventListener("input", calculate);
fleetLoadBonus.addEventListener("input", calculate);
guildLoadBonus.addEventListener("input", calculate);
scoutedWood.addEventListener("input", calculate);
scoutedIron.addEventListener("input", calculate);
scoutedCoal.addEventListener("input", calculate);

armyLoads = {
    1: 600,
    2: 900,
    3: 1200,
    4: 1500,
    5: 1800,
    6: 2100,
    7: 2400,
    8: 2700,
    9: 3000,
    10: 3300
}

loadBonusMultiplicator = 0

function withDecimals(num, digits) {
  // toFixed round the number, that we don't want
  let re = new RegExp('^-?\\d+(?:\\.\\d{0,' + digits + '})?')
  return num.toString().match(re)[0]
}

function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup.findLast(item => num >= item.value);
  return item ? withDecimals(num / item.value, digits).replace(regexp, "").concat(item.symbol) : "0";
}

function calculate(event) {
    fScoutedWood.value = nFormatter(scoutedWood.value, 1)
    fScoutedIron.value = nFormatter(scoutedIron.value, 1)
    fScoutedCoal.value = nFormatter(scoutedCoal.value, 1)

    scoutedWoodWeight = scoutedWood.value * 2
    scoutedIronWeight = scoutedIron.value * 2
    scoutedCoalWeight = scoutedCoal.value * 5
    totalScoutedWeight = scoutedWoodWeight + scoutedIronWeight + scoutedCoalWeight

    scoutedWoodProp = scoutedWoodWeight/totalScoutedWeight
    scoutedIronProp = scoutedIronWeight/totalScoutedWeight
    scoutedCoalProp = scoutedCoalWeight/totalScoutedWeight

    loadBonus = 1 + (troopLoadBonus.value/100 + fleetLoadBonus.value/100 + guildLoadBonus.value/100) * loadBonusMultiplicator

    totalLoad = 0
    maxLoad = 0
    totalPlunderedWood = 0
    totalPlunderedIron = 0
    totalPlunderedCoal = 0

    for (let i = 0; i < attacks.value; i++) {
        if (totalLoad < 40000000) {
            attackLoad = fleetSize.value * armyLoads[troopLevel.value] * loadBonus
        } else {
            attackLoad = fleetSize.value * armyLoads[troopLevel.value] * loadBonus * 0.15
        }
        maxLoad += attackLoad

        remaining = 0

        maxPlunderedWood = attackLoad * scoutedWoodProp
        minPlunderedWood = Math.floor(Math.min(maxPlunderedWood, scoutedWoodWeight)/2)*2

        maxPlunderedIron = attackLoad * scoutedIronProp
        minPlunderedIron = Math.floor(Math.min(maxPlunderedIron, scoutedIronWeight)/2)*2

        maxPlunderedCoal = attackLoad * scoutedCoalProp
        minPlunderedCoal = Math.floor(Math.min(maxPlunderedCoal, scoutedCoalWeight)/5)*5

        currentLoad = (minPlunderedWood + minPlunderedIron + minPlunderedCoal)

        remaining = attackLoad - currentLoad

        if (remaining >= 5) {
            if (minPlunderedCoal < scoutedCoalWeight) {
                minPlunderedCoal += 1
                remaining -= 5
            }
        }

        totalPlunderedWood += minPlunderedWood
        totalPlunderedIron += minPlunderedIron
        totalPlunderedCoal += minPlunderedCoal

        scoutedWoodWeight -= minPlunderedWood
        scoutedIronWeight -= minPlunderedIron
        scoutedCoalWeight -= minPlunderedCoal

        currentLoad = (minPlunderedWood + minPlunderedIron + minPlunderedCoal)
        totalLoad += currentLoad

    }

    if (totalPlunderedWood >= 2000) {
        plunderedWood.value = nFormatter(totalPlunderedWood / 2, 1) + " (" + Math.round(totalPlunderedWood/2) + ")"
    } else {
        plunderedWood.value = Math.round(totalPlunderedWood/2)
    }
    if (totalPlunderedIron >= 2000) {
        plunderedIron.value = nFormatter(totalPlunderedIron / 2, 1) + " (" + Math.round(totalPlunderedIron/2) + ")"
    } else {
        plunderedIron.value = Math.round(totalPlunderedIron/2)
    }
    if (totalPlunderedCoal >= 5000) {
        plunderedCoal.value = nFormatter(totalPlunderedCoal / 5, 1) + " (" + Math.round(totalPlunderedCoal/5) + ")"
    } else {
        plunderedCoal.value = Math.round(totalPlunderedCoal/5)
    }

    load.value = Math.round(100*totalLoad/maxLoad) + "%"
    loadMeter.value = Math.round(100*totalLoad/maxLoad)
    totalPlunderedLoad.value = Math.round(totalLoad)
}

calculate({})