const initialFuel = 90
const fuelPerHour = 18.34
const route = `
"Elévation 606 ft (22 hPa)
SR 06:44 Z, MCT 06:05 Z",RNav,MSA,Level,TAS,TrkT,TrkM,Wind,HdgM,GS,Dist,Time
S (EPLL),LOZ 228/8,2600,2000,94,138,132,228/19,147,73,"2,5 (2,5)",2 (2)
R (EPLL),LOZ 205/9,2100,2000,94,146,140,237/25,155,91,"3,7 (6,3)",2 (5)
N (EPPT),LOZ 165/20,2300,2000,94,144,138,236/25,153,92,14 (21),9 (14)
EPPT Piotrków Trybunalski,LOZ 169/24,2300,2000,94,200,193,240/21,202,76,"3,9 (25)",3 (17)
S (EPPT),LOZ 172/29,2100,2000,94,193,187,240/21,196,78,"5,1 (30)",4 (21)
F (EPPT),LOZ 177/34,2300,2000,94,205,199,240/21,206,76,"5,5 (35)",4 (25)
E (EPRU),KAX 015/29,2400,2000,94,207,201,232/21,207,75,20 (55),16 (41)
J (EPKT),KAX 016/13,2400,2000,94,201,195,232/19,201,77,16 (71),12 (54)
W (EPKT),KAX 345/6,2100,2000,94,227,221,232/19,222,75,"7,7 (79)",6 (60)
N (EPKT),KAX 343/1,2100,2000,94,171,165,231/19,175,83,"5,2 (84)",4 (64)
EPKT KATOWICE/Pyrzowice,KAX 217/0,2000,2000,94,179,173,234/21,183,80,"1,4 (86)",1 (65)
X (EPKT),KAX 180/1,1900,2000,94,178,172,234/21,182,81,"1,2 (87)",1 (66)
G (EPKT),KAX 189/5,2100,2000,94,198,193,234/21,200,76,"3,2 (90)",3 (68)
N502121 E0191424,KAX 135/9,2600,2000,94,112,106,234/21,117,103,"7,6 (98)",4 (73)
Szczekociny,KAX 067/29,2900,2000,94,054,048,234/21,048,115,27 (125),14 (87)
K (EPKA),KAK 025/58,2200,2000,94,059,053,240/18,053,113,34 (159),18 (105)
EPKA MASŁÓW k/Kielc,KAK 030/61,2700,2000,94,097,090,242/16,096,107,"5,8 (164)",3 (108)
Z (EPKA),LOZ 136/62,2800,2000,94,330,324,242/16,314,92,"5,4 (170)",4 (112)
N511716 E0201407,LOZ 137/37,2200,2000,94,320,313,238/17,303,89,25 (195),17 (128)
N512526 E0195513,LOZ 147/24,2200,2000,94,305,298,242/19,288,84,14 (209),10 (139)
R (EPLL),LOZ 205/9,2300,2000,94,310,303,238/24,289,85,20 (229),14 (153)
S (EPLL),LOZ 228/8,1700,2000,94,326,320,239/24,305,90,"3,7 (233)",2 (155)
EPLL Łódź,LOZ 244/9,2600,2600,94,318,312,239/24,298,93,"2,5 (236)",2 (157)
"Elévation 606 ft (22 hPa)
SS 14:56 Z, ECT 15:35 Z",,,,,,,,,,236,2:37

TWR,ŁÓDŹ TOWER,"124,230"
ATIS,ATIS,"135,680"
TWR,Łódź Delivery,"120,005"
EPLL,Warszawa Information,"128,575"
EPLL,Warszawa Information,"119,450"
A/G,PIOTRKÓW RADIO,"119,305"
Krakow Flight Information Service,Krakow Information,"119,275"
TWR,KATOWICE DELIVERY,"121,805"
TWR,KATOWICE TOWER,"129,255"
ATIS,ATIS,"120,230"
APP,KRAKÓW APPROACH,"121,075"
APP,KRAKÓW APPROACH,"135,405"
A/G,MASŁÓW RADIO,"118,080"
Krakow Flight Information Service,Krakow Information,"119,950"

LOD (Lodz),,"110,500"
LOZ (Wiaczyn Dolny),,"112,400"
KAX (Katowice/Pyrzowice),,"114,800"
IKTO (Katowice/Pyrzowice),,"109,900"
KAK (Krakow Balice),,"112,800"
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
    const entries = lines.map(l => l
        .replace(/(?<=")[^"]*\./g, (match) =>  match.replace(/\./g, "."))
        .split(",")
    ).filter(l => l.length === header.length - 1)
 
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