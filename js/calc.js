
const troopLevel = document.querySelector("#troop_level");
const fleetSize = document.querySelector("#fleet_size");

const troopLoadBonus = document.querySelector("#troop_load_bonus");
const fleetLoadBonus = document.querySelector("#fleet_load_bonus");
const guildLoadBonus = document.querySelector("#guild_load_bonus");

const scoutedWood = document.querySelector("#scouted_wood");
const scoutedIron = document.querySelector("#scouted_iron");
const scoutedCoal = document.querySelector("#scouted_coal");

const fScoutedWood = document.querySelector("#f_scouted_wood");
const fScoutedIron = document.querySelector("#f_scouted_iron");
const fScoutedCoal = document.querySelector("#f_scouted_coal");

const plunderedWood = document.querySelector("#plundered_wood");
const plunderedIron = document.querySelector("#plundered_iron");
const plunderedCoal = document.querySelector("#plundered_coal");
const load = document.querySelector("#load");
const loadMeter = document.querySelector("#load_meter");

troopLevel.addEventListener("input", calculate);
fleetSize.addEventListener("input", calculate);
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
  return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
}

function calculate(event) {
    fScoutedWood.value = nFormatter(scoutedWood.value, 1)
    fScoutedIron.value = nFormatter(scoutedIron.value, 1)
    fScoutedCoal.value = nFormatter(scoutedCoal.value, 1)

    loadBonus = 1 + (troopLoadBonus.value/100 + fleetLoadBonus.value/100 + guildLoadBonus.value/100) * loadBonusMultiplicator
    totalLoad = fleetSize.value * armyLoads[troopLevel.value] * loadBonus

    scoutedWoodWeight = scoutedWood.value * 2
    scoutedIronWeight = scoutedIron.value * 2
    scoutedCoalWeight = scoutedCoal.value * 5
    totalScoutedWeight = scoutedWoodWeight + scoutedIronWeight + scoutedCoalWeight

    scoutedWoodProp = scoutedWoodWeight/totalScoutedWeight
    scoutedIronProp = scoutedIronWeight/totalScoutedWeight
    scoutedCoalProp = scoutedCoalWeight/totalScoutedWeight

    maxPlunderedWood = totalLoad * scoutedWoodProp
    maxPlunderedIron = totalLoad * scoutedIronProp
    maxPlunderedCoal = totalLoad * scoutedCoalProp

    minPlunderedWood = Math.min(maxPlunderedWood, scoutedWoodWeight)
    minPlunderedIron = Math.min(maxPlunderedIron, scoutedIronWeight)
    minPlunderedCoal = Math.min(maxPlunderedCoal, scoutedCoalWeight)

    plunderedWood.value = nFormatter(minPlunderedWood / 2, 1)
    plunderedIron.value = nFormatter(minPlunderedIron / 2, 1)
    plunderedCoal.value = nFormatter(minPlunderedCoal / 5, 1)

    currentLoad = (minPlunderedWood + minPlunderedIron + minPlunderedCoal)
    load.value = Math.round(100*currentLoad/totalLoad) + "%"
    loadMeter.value = Math.round(100*currentLoad/totalLoad)
}

calculate({})