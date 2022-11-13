const initialFuel = 85
const fuelPerHour = 18.07
const route = `
"Elevation 606 ft (22 hPa)
SR 05:41 Z, MCT 05:05 Z",RNav,MSA,Level,TAS,TrkT,TrkM,Wind,HdgM,GS,Dist,Time
Y (EPLL),LOZ 256/10,2200,2000,94,312,306,146/12,303,83,2.4,2 (2)
L (EPLL),LOZ 274/13,2300,2000,94,327,321,185/15,315,105,4.4,2 (4)
X (EPLL),LOZ 358/7,2300,2000,94,069,063,186/15,071,100,14,8 (13)
K (EPLL),LOZ 107/7,2100,2000,94,146,140,165/15,143,80,12,9 (21)
G (EPTM),LOZ 111/11,2100,2000,94,123,117,166/15,123,83,3.5,3 (24)
H (EPTM),LOZ 099/16,2100,2000,94,081,074,166/14,083,92,5.6,4 (28)
M (EPTM),LOZ 100/23,2000,2000,94,107,101,153/13,107,85,7.1,5 (33)
Z (EPTM),LOZ 108/27,1500,2000,94,148,142,153/13,142,81,5.6,4 (37)
B (EPTM),LOZ 111/33,1600,2000,94,130,124,153/13,127,82,6.4,5 (41)
D (EPTM),LOZ 117/37,2200,2000,94,167,161,154/13,159,82,5.2,4 (45)
Z (EPKA),LOZ 136/62,2700,2000,94,165,159,147/17,155,78,29,22 (68)
EPKA MASŁÓW k/Kielc,KAK 030/61,2800,2000,94,150,144,147/17,143,78,5.4,4 (72)
K (EPKA),KAK 025/58,2700,2000,94,277,271,134/13,266,104,5.8,3 (75)
Włoszczowa,KAX 050/41,2200,2000,94,262,255,144/07,252,99,23,14 (89)
R (EPPT),LOZ 161/36,2300,2000,94,348,342,200/07,340,101,21,12 (102)
E (EPPT),LOZ 158/25,1700,2000,94,353,347,186/11,345,105,11,6 (108)
EPPT Piotrków Trybunalski,LOZ 169/24,1600,2000,94,274,268,185/11,261,93,4.9,3 (111)
N (EPPT),LOZ 165/20,2300,2000,94,019,013,184/11,015,105,3.9,2 (113)
R (EPLL),LOZ 205/9,2300,2000,94,324,318,166/13,315,105,14,8 (122)
S (EPLL),LOZ 228/8,1700,2000,94,326,320,189/13,315,107,3.7,2 (124)
EPLL Łódź,LOZ 244/9,2200,2000,94,318,312,189/13,306,108,2.5,1 (125)
"Elevation 606 ft (22 hPa)
SS 15:09 Z, ECT 15:45 Z",,,,,,,,,,191,2:05

TWR,ŁÓDŹ TOWER,124.230
ATIS,ATIS,135.680
TWR,Łódź Delivery,120.005
EPLL,Warszawa Information,128.575
EPTM,TOMASZÓW TOWER,125.000
APP,TOMASZÓW APPROACH,130.250
Krakow Flight Information Service,Krakow Information,119.950
A/G,MASŁÓW RADIO,118.080
Krakow Flight Information Service,Krakow Information,119.275
A/G,PIOTRKÓW RADIO,119.305
EPLL,Warszawa Information,119.450

LOD (Lodz),,110.500
LOZ (Wiaczyn Dolny),,112.400
KAK (Krakow Balice),,112.800
KAX (Katowice/Pyrzowice),,114.800
`
 
const row = {
    RNav: -1,
    MSA: -1,
    Level: -1,
    TAS: -1,
    TrkT: -1,
    TrkM: -1,
    Wind: -1,
    HdgM: -1,
    GS: -1,
    Dist: -1,
    Time: -1
}
 
const reset = () => {
    [...document.getElementsByTagName("img")]
        .filter(img => img.id.includes("del"))
        .map(img => img.click())
}
 
const fill = async () => {
    reset();
    const lines = route.split("\n")
    const header = lines.find(row => row.startsWith("SR")).split(",")
    const entries = lines.map(l => l.split(",")).filter(l => l.length === header.length - 1)
 
    Object.keys(row).forEach(key => {
        row[key] = header.findIndex(e => e === key) - 1
    })
 
    Object.entries(row).filter(([e, v]) => {
        if (v === -1) {
            alert("Please re-export skydemon plan with ${e}")
            throw new Error("Please re-export skydemon plan with ${e}")
        }
    })
 
    let fuelRemaining = initialFuel;
    for (let entry of entries) {
        document.getElementsByClassName("btn-info")[0].click()
 
        await new Promise(r => setTimeout(r, 400))
        const inputs = [...[...document.getElementsByTagName("tr")].at(-2).getElementsByTagName("input")]
        const rnavParts = entry[row.RNav].split(/( |\/)/gm)
        const rnav = `${rnavParts[0]}/${("00" + rnavParts[2]).slice(-3)}/${("00" + rnavParts[4]).slice(-3)}`
        const time = Number(entry[row.Time].split(" ")[0]);

        let pointName = entry[0]
        if (pointName.match(/^([a-zA-Z]{1}) \(([a-zA-Z]{4})\)/gm)) {
            pointName = `${pointName.slice(3,7)}${pointName[0]}`
        }
 
        fuelRemaining = fuelRemaining - fuelPerHour * time / 60
        inputs.filter(a => a.name.includes("waypoint"))[0].value = `${pointName} - ${rnav}`;
        inputs.filter(a => a.name.includes("ttrk"))[0].value = entry[row.TrkT];
        inputs.filter(a => a.name.includes("mvar"))[0].value = "-6"
        inputs.filter(a => a.name.includes("mtrk"))[0].value = entry[row.TrkM];
        inputs.filter(a => a.name.includes("wca"))[0].value = (-1.0 * (Number(entry[row.TrkM]) - Number(entry[row.HdgM]))).toString();
        inputs.filter(a => a.name.includes("mhdg"))[0].value = entry[row.HdgM]
        inputs.filter(a => a.name.includes("gs"))[0].value = entry[row.GS]
        inputs.filter(a => a.name.includes("dist"))[0].value = entry[row.Dist]
        inputs.filter(a => a.name.includes("dist"))[0].value = Math.round(Number(entry[row.Dist])).toString()
        inputs.filter(a => a.name.includes("ete"))[0].value = Math.round(time).toString();
        inputs.filter(a => a.name.includes("planfob"))[0].value = Math.round(fuelRemaining).toString();
    }
}
 
fill();