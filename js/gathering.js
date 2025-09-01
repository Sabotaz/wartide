
const troopLevel = document.querySelector("#troop_level");
const fleetSize = document.querySelector("#fleet_size");

const troopLoadBonus = document.querySelector("#troop_load_bonus");
const fleetLoadBonus = document.querySelector("#fleet_load_bonus");
const guildLoadBonus = document.querySelector("#guild_load_bonus");

const woodSpeedBonus = document.querySelector("#wood_speed_bonus");
const ironSpeedBonus = document.querySelector("#iron_speed_bonus");
const coalSpeedBonus = document.querySelector("#coal_speed_bonus");
const fleetSpeedBonus = document.querySelector("#fleet_speed_bonus");

const guildSpeedBonus = document.querySelector("#guild_speed_bonus");
const citiesSpeedBonus = document.querySelector("#cities_speed_bonus");

const islandLevel = document.querySelector("#island_level");
const fullIsland = document.querySelector("#full_island");
const islandResources = document.querySelector("#island_resources");
const woodIsland = document.querySelector("#wood_island");
const ironIsland = document.querySelector("#iron_island");
const coalIsland = document.querySelector("#coal_island");

const gatheredAmount = document.querySelector("#gathered_amount");
const gatheredTime = document.querySelector("#gathered_time");
const resPerSecField = document.querySelector("#res_per_sec");

const load = document.querySelector("#load");
const loadMeter = document.querySelector("#load_meter");

troopLevel.addEventListener("input", calculate);
fleetSize.addEventListener("input", calculate);

troopLoadBonus.addEventListener("input", calculate);
fleetLoadBonus.addEventListener("input", calculate);
guildLoadBonus.addEventListener("input", calculate);

woodSpeedBonus.addEventListener("input", calculate);
ironSpeedBonus.addEventListener("input", calculate);
coalSpeedBonus.addEventListener("input", calculate);
fleetSpeedBonus.addEventListener("input", calculate);

guildSpeedBonus.addEventListener("input", calculate);
citiesSpeedBonus.addEventListener("input", calculate);

islandLevel.addEventListener("input", calculate);
fullIsland.addEventListener("change", checkAndCalculate);
islandResources.addEventListener("input", calculate);
woodIsland.addEventListener("change", calculate);
ironIsland.addEventListener("change", calculate);
coalIsland.addEventListener("change", calculate);

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
resPerSecond = {
    "WOOD": {
        3: 56,
        4: 66,
        5: 78,
        6: 88,
        7: 100,
        8: 112,
        9: 126,
        10: 138
    },
    "IRON": {
        3: 56,
        4: 66,
        5: 78,
        6: 88,
        7: 100,
        8: 112,
        9: 126,
        10: 138
    },
    "COAL": {
        3: 55,
        4: 65,
        5: 80,
        6: 90,
        7: 100,
        8: 110,
        9: 125,
        10: 140
    }
}
resOnIsland = {
    "WOOD": {
        3: 300000,
        4: 480000,
        5: 840000,
        6: 1280000,
        7: 1800000,
        8: 2400000,
        9: 2925000,
        10: 3500000
    },
    "IRON": {
        3: 300000,
        4: 480000,
        5: 840000,
        6: 1280000,
        7: 1800000,
        8: 2400000,
        9: 2925000,
        10: 3500000
    },
    "COAL": {
        3: 120000,
        4: 192000,
        5: 336000,
        6: 512000,
        7: 720000,
        8: 960000,
        9: 1170000,
        10: 1400000
    }
}
resourceWeights = {
    "WOOD": 2,
    "IRON": 2,
    "COAL": 5
}

loadBonusMultiplicator = 1
speedBonusMultiplicator = 1

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

function timeFormatter(time) {
    totalSecs = Math.floor(time)
    secs = totalSecs % 60
    min = ((totalSecs - secs)/60) % 60
    hours = ((totalSecs - secs - 60*min)/3600) % 60

    return ("0"+hours).slice(-2) + ":" + ("0"+min).slice(-2) + ":" + ("0"+secs).slice(-2)
}

function checkAndCalculate(event) {
    islandResources.disabled = fullIsland.checked
    calculate(event)
}

function calculate(event) {

    resourceType = woodIsland.checked ? "WOOD" : (ironIsland.checked ? "IRON" : "COAL")

    speedResBonus = {
        "WOOD": woodSpeedBonus.value,
        "IRON": ironSpeedBonus.value,
        "COAL": coalSpeedBonus.value
    }

    loadBonus = 1 + (troopLoadBonus.value/100 + fleetLoadBonus.value/100 + guildLoadBonus.value/100) * loadBonusMultiplicator
    totalLoad = fleetSize.value * armyLoads[troopLevel.value] * loadBonus

    speedBonus = 1 + (speedResBonus[resourceType]/100 + fleetSpeedBonus.value/100 + guildSpeedBonus.value/100 + citiesSpeedBonus.value/100) * speedBonusMultiplicator

    isIslandFull = fullIsland.checked
    maxResOnIsland = resOnIsland[resourceType][islandLevel.value]
    resources = isIslandFull ? maxResOnIsland : Math.min(islandResources.value, maxResOnIsland)
    resourcesWeight = resources * resourceWeights[resourceType] // weight on island

    gatheredWeight = Math.min(totalLoad, resourcesWeight)

    baseResPerSec = resPerSecond[resourceType][islandLevel.value]
    finalResPerSec = baseResPerSec * speedBonus
    totalTime = gatheredWeight / finalResPerSec

    finalGatheredAmount = gatheredWeight / resourceWeights[resourceType]
    gatheredAmount.value = nFormatter(finalGatheredAmount, 1) + " (" + Math.round(finalGatheredAmount) + ")"
    gatheredTime.value = timeFormatter(totalTime)

    resPerSecField.value = (finalGatheredAmount / totalTime).toFixed(2)

    load.value = Math.round(100*gatheredWeight/totalLoad) + "%"
    loadMeter.value = Math.round(100*gatheredWeight/totalLoad)
}

calculate({})