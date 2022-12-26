const initialFuel = 85
const fuelPerHour = 18.07
const route = `
"Elevation 606 ft (22 hPa)
SR 06:48 Z, MCT 06:08 Z",RNav,MSA,Level,IAS,TrkT,TrkM,Wind,HdgM,GS,Dist,Time,FuelR,ETA,ATA
G (EPLK),LOZ 192/13,2300,5500,81,154,148,292/34,166,95,10 (10),7 (7),79.8,,
H (EPLL),LOZ 233/16,2300,5500,81,296,289,298/31,290,56,10 (21),11 (18),77.3,,
L (EPLL),LOZ 274/13,2000,5500,81,003,357,299/30,339,70,10 (31),9 (26),75.3,,
Rosanow,LOZ 309/12,2300,5500,81,035,029,299/30,009,85,7.4 (38),5 (32),74.2,,
X (EPLL),LOZ 358/7,2000,5500,81,097,091,300/30,084,114,8.8 (47),5 (36),73.2,,
LOZ Wiaczyn Dolny,LOZ ,2600,5500,81,183,177,298/32,196,96,7.0 (54),4 (41),72.2,,
K (EPLL),LOZ 107/7,2600,5500,81,112,106,299/32,104,119,7.5 (62),4 (44),71.4,,
Tuszyn,LOZ 179/11,2100,5500,81,223,217,299/32,238,74,11 (73),9 (53),69.4,,
EPLL Łódź,LOZ 244/9,2600,5500,81,315,309,296/32,303,68,11 (84),10 (63),66.7,,
"Elevation 606 ft (22 hPa)
SS 14:38 Z, ECT 15:18 Z",,,,,,,,,,84,1:03,(ltr),,

TWR,ŁÓDŹ TOWER,124.230
ATIS,ATIS,135.680
TWR,Łódź Delivery,120.005
EPLK,Łask APPROACH,125.350
EPLL,Warszawa Information,119.450
Przestrzeń CTA,Warszawa DIRECTOR,129.380
Przestrzeń CTA,Warszawa APPROACH,125.055
Przestrzeń CTA,Warszawa APPROACH,128.805
EPLL,Warszawa Information,128.575

LOD (Lodz),,110.500
LOZ (Wiaczyn Dolny),,112.400
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
        const distance = Math.round(Number(entry[row.Dist].split(" ")[0]));


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
        inputs.filter(a => a.name.includes("dist"))[0].value = distance
        inputs.filter(a => a.name.includes("ete"))[0].value = Math.round(time).toString();
        inputs.filter(a => a.name.includes("planfob"))[0].value = Math.round(fuelRemaining).toString();
    }
}
 
fill();