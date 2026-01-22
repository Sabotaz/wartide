// bonus
// minister: +50%
// CooCoo: +2/3/4/5/6/7/8%
// vip: 6 -> +5%
// vip: 8 -> +10%
// vip: 10 -> +15%
// vip: 12 -> +20%
// vip: 14 -> +25%
// vip: 16 -> +30%
// research: +0% to +20%
// guild: +0% to +25%
// research lab: +0.5% per level
// CC: +0.5% per level
// safety: 900 -> +5%
// policy: 10% final cut

const minister = document.querySelector("#minister");
const policy = document.querySelector("#policy");
const vip = document.querySelector("#vip");
const safety = document.querySelector("#safety");

const research = document.querySelector("#research_speed_bonus");
const guild = document.querySelector("#guild_research_speed_bonus");

const lab = document.querySelector("#lab_level");
const cc = document.querySelector("#cc_level");

const coco = document.querySelector("#coocoo_stars");

const days = document.querySelector("#days");
const hours = document.querySelector("#hours");
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");

const actual = document.querySelector("#actual_time");
const total = document.querySelector("#total_time");
const totalResearch = document.querySelector("#total_research");


minister.addEventListener("input", calculate);
policy.addEventListener("input", calculate);
vip.addEventListener("input", calculate);
safety.addEventListener("input", calculate);

research.addEventListener("input", calculate);
guild.addEventListener("input", calculate);

lab.addEventListener("input", calculate);
cc.addEventListener("input", calculate);

coco.addEventListener("input", calculate);

days.addEventListener("input", calculate);
hours.addEventListener("input", calculate);
minutes.addEventListener("input", calculate);
seconds.addEventListener("input", calculate);

coocoo_values = {
    0: 2,
    1: 3,
    2: 4,
    3: 5,
    4: 6,
    5: 7,
    6: 8
}
vip_values = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 5,
    7: 5,
    8: 10,
    9: 10,
    10: 15,
    11: 15,
    12: 20,
    13: 20,
    14: 25,
    15: 25,
    16: 30,
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
    totalBonus += Number(lab.value) * 0.5
    totalBonus += Number(cc.value) * 0.5
    totalBonus += vip_values[Number(vip.value)]
    totalBonus += coocoo_values[Number(coco.value)]
    totalBonus += Number(safety.value) >= 900 ? 5 : 0

    totalTime = Number(seconds.value) + Number(minutes.value) * 60 + Number(hours.value) * 3600 + Number(days.value) * 86400

    cutTime = totalTime / (1 + totalBonus / 100)
    if (policy.checked) {
        cutTime = cutTime - Math.min(cutTime * 0.1, 12*3600)
    }
    cutTime = Math.ceil(cutTime)

    total.value = timeFormatter(totalTime)
    actual.value = timeFormatter(cutTime)
    totalResearch.value = "+" + totalBonus + "%"
}

calculate({})