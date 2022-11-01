const initialFuel = 85
const fuelPerHour = 18.15
const route = `
S (EPLL),LOZ 228/8,2200,2000,94,138,132,000/00,132,74,2.5,2 (2)
R (EPLL),LOZ 205/9,2100,2000,94,146,140,000/00,140,94,3.7,2 (4)
Wolbórz,LOZ 150/18,2300,2000,94,123,117,000/00,117,94,15,9 (14)
Opoczno,LOZ 130/35,2300,2000,94,115,109,000/00,109,94,19,12 (26)
Przysucha,LOZ 119/45,2700,2000,94,095,089,000/00,089,94,13,8 (34)
Wyśmierzyce,OKC 183/33,2000,2000,94,023,017,000/00,017,94,18,12 (46)
KRN Karnice,OKC 229/23,1600,2000,94,324,318,000/00,318,94,24,15 (61)
Teresin,MOL 208/18,2200,2000,94,355,348,000/00,348,94,15,10 (71)
Q (EPMO),MOL 251/19,1200,2000,94,323,316,000/00,316,94,13,9 (79)
X (EPLL),LOZ 358/7,1700,1900,94,215,209,000/00,209,93,36,23 (102)
L (EPLL),LOZ 274/13,2300,2600,94,249,243,000/00,243,94,14,9 (111)
Y (EPLL),LOZ 256/10,2300,2300,94,147,141,000/00,141,97,4.4,3 (114)
EPLL Łódź,LOZ 244/9,2200,2000,94,132,126,000/00,126,100,2.4,1 (115)
`

const row = {
    RNav: 1,
    MSA: 2,
    Level: 3,
    TAS: 4,
    TrkT: 5,
    TrkM: 6,
    Wind: 7,
    HdgM: 8,
    GS: 9,
    Dist: 10,
    Time: 11
}

const path = route
    .split("\n")
    .map(s => s.split(","))
    .filter(s => s.length > 2)


const reset = () => {
    [...document.getElementsByTagName("img")]
        .filter(img => img.id.includes("del"))
        .map(img => img.click())
}

const fill = async () => {
    reset();

    let fuelRemaining = initialFuel;
    for (let entry of path) {
        document.getElementsByClassName("btn-info")[0].click()

        await new Promise(r => setTimeout(r, 200))
        const inputs = [...[...document.getElementsByTagName("tr")].at(-2).getElementsByTagName("input")]
        const rnavParts = entry[row.RNav].split(/( |\/)/gm)
        const rnav = `${rnavParts[0]}/${("00" + rnavParts[2]).slice(-3)}/${("00" + rnavParts[4]).slice(-3)}`
        const time = Number(entry[row.Time].split(" ")[0]);

        fuelRemaining = fuelRemaining - fuelPerHour * time / 60
        inputs.filter(a => a.name.includes("waypoint"))[0].value = `${entry[0]} - ${rnav}`;
        inputs.filter(a => a.name.includes("ttrk"))[0].value = entry[row.TrkT];
        inputs.filter(a => a.name.includes("mvar"))[0].value = "6"
        inputs.filter(a => a.name.includes("mtrk"))[0].value = entry[row.TrkM];
        inputs.filter(a => a.name.includes("wca"))[0].value = (Number(entry[row.TrkM]) - Number(entry[row.HdgM])).toString();
        inputs.filter(a => a.name.includes("mhdg"))[0].value = entry[row.HdgM]
        inputs.filter(a => a.name.includes("gs"))[0].value = entry[row.GS]
        inputs.filter(a => a.name.includes("dist"))[0].value = entry[row.Dist]
        inputs.filter(a => a.name.includes("dist"))[0].value = Math.round(Number(entry[row.Dist])).toString()
        inputs.filter(a => a.name.includes("ete"))[0].value = Math.round(time).toString();
        inputs.filter(a => a.name.includes("planfob"))[0].value = Math.round(fuelRemaining).toString();
    }
}

fill();