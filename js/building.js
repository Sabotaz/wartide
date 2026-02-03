// bonus
// minister: +50%
// Shermon: -3/6/9/12/15/18/21 min
// sarah: -2/3/4/5/6/7/8 %
// vip: 3 -> +10%
// vip: 11 -> +50%
// research: +0% to +20%
// guild: +0% to +25%
// CC: +0.5% per level
// safety: 800 -> +5%
// policy: 20%

const minister = document.querySelector("#minister");
const policy = document.querySelector("#policy");
const vip = document.querySelector("#vip");
const safety = document.querySelector("#safety");

const research = document.querySelector("#building_speed_bonus");
const guild = document.querySelector("#guild_building_speed_bonus");

const cc = document.querySelector("#cc_level");

const shermon = document.querySelector("#shermon_stars");
const sarah = document.querySelector("#sarah_stars");

const days = document.querySelector("#days");
const hours = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");

const actual = document.querySelector("#actual_time");
const total = document.querySelector("#total_time");
const totalSpeed = document.querySelector("#total_speed");
const actualShermon = document.querySelector("#actual_shermon_time");


minister.addEventListener("input", calculate);
policy.addEventListener("input", calculate);
vip.addEventListener("input", calculate);
safety.addEventListener("input", calculate);

research.addEventListener("input", calculate);
guild.addEventListener("input", calculate);

cc.addEventListener("input", calculate);

shermon.addEventListener("input", calculate);
sarah.addEventListener("input", calculate);

days.addEventListener("input", calculate);
hours.addEventListener("input", calculate);
minutes.addEventListener("input", calculate);
seconds.addEventListener("input", calculate);

sarah_values = {
    0: 2,
    1: 3,
    2: 4,
    3: 5,
    4: 6,
    5: 7,
    6: 8
}
shermon_values = {
    0: 3*60,
    1: 6*60,
    2: 9*60,
    3: 12*60,
    4: 15*60,
    5: 18*60,
    6: 21*60
}
vip_values = {
    0: 0,
    1: 0,
    2: 0,
    3: 10,
    4: 15,
    5: 20,
    6: 25,
    7: 30,
    8: 35,
    9: 40,
    10: 45,
    11: 50,
    12: 50,
    13: 50,
    14: 50,
    15: 50,
    16: 50,
}

function timeFormatter(time) {
    totalSecs = Math.floor(time)
    secs = totalSecs % 60
    min = ((totalSecs - secs)/60) % 60
    hs = ((totalSecs - secs - 60*min)/3600) % 24
    ds = ((totalSecs - secs - 60*min - 3600*hs)/86400)

    return ds + "d " + ("0"+hs).slice(-2) + ":" + ("0"+min).slice(-2) + ":" + ("0"+secs).slice(-2)
}

function checkAndCalculate(event) {
    calculate(event)
}

function calculate(event) {

    totalBonus = 0

    totalBonus += minister.checked ? 50 : 0
    totalBonus += Number(research.value)
    totalBonus += Number(guild.value)
    totalBonus += Number(cc.value) * 0.5
    totalBonus += vip_values[Number(vip.value)]
    totalBonus += sarah_values[Number(sarah.value)]
    totalBonus += Number(safety.value) >= 800 ? 5 : 0
    totalBonus += policy.checked ? 20 : 0

    totalTime = Number(seconds.value) + Number(minutes.value) * 60 + Number(hours.value) * 3600 + Number(days.value) * 86400

    cutTime = totalTime / (1 + totalBonus / 100)
    cutTime = Math.ceil(cutTime)

    total.value = timeFormatter(totalTime)
    actual.value = timeFormatter(cutTime)

    shermonCut = shermon_values[Number(shermon.value)]
    actualShermon.value = timeFormatter(cutTime-shermonCut)

    totalSpeed.value = "+" + totalBonus + "%"
}

calculate({})