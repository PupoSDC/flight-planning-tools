const initialFuel = 85
const fuelPerHour = 18.15
const route = `
"Elevation 606 ft (22 hPa)
SR 05:36 Z, MCT 05:00 Z",RNav,MSA,Level,TAS,TrkT,TrkM,Wind,HdgM,GS,Dist,Time
Y (EPLL),LOZ 256/10,2200,2000,94,312,306,268/13,299,65,2.4,2 (2)
L (EPLL),LOZ 274/13,2300,2000,94,327,321,285/15,315,82,4.4,3 (5)
W (EPLL),LOZ 259/19,2000,2000,94,238,232,285/15,238,83,7.3,5 (11)
C (EPLL),LOZ 259/25,2700,2000,94,263,257,285/15,260,79,6.2,5 (15)
Turek,LOZ 285/44,2700,2000,94,316,310,295/20,306,75,24,19 (35)
Jarocin,CMP 104/31,2100,2000,94,266,260,293/15,264,79,37,28 (63)
Gostyń,CMP 141/19,2000,2000,94,254,249,288/20,255,77,19,15 (78)
Leszno,CMP 193/18,1900,2000,94,262,257,288/20,262,74,16,13 (91)
EPLS STRZYŻEWICE k/Leszna,CMP 198/19,1700,2000,94,258,252,279/22,257,73,1.8,1 (93)
Rawicz,CMP 162/31,2000,2000,94,131,125,279/22,132,112,19,10 (103)
Żmigród,WCL 355/23,1200,2000,94,180,174,279/22,187,95,9.5,6 (109)
N511948 E0164835,WCL 340/15,1600,2000,94,204,198,282/15,207,89,9.2,6 (115)
Z (EPWR),WCL 339/10,1800,2000,94,166,160,282/15,169,100,5.0,3 (118)
R (EPWR),WCL 018/4,2000,2000,94,142,137,282/15,142,105,7.2,4 (122)
N (EPWR),WCL 340/2,2000,2000,94,230,224,282/15,231,84,2.8,2 (124)
EPWR WROCŁAW/Strachowice,WCL 292/1,1300,2000,94,205,200,282/15,209,89,1.5,1 (125)
N (EPWR),WCL 340/2,1300,2000,94,025,020,282/15,011,96,1.5,1 (126)
R (EPWR),WCL 018/4,2000,2000,94,050,044,282/15,037,102,2.8,2 (128)
EPWS Szymanów,WCL 020/7,2000,2000,94,026,021,282/15,012,96,3.4,2 (130)
T (EPWS),WCL 020/14,1700,2000,94,023,017,296/15,008,92,6.2,4 (134)
N512830 E0171831,WCL 029/27,2100,2000,94,041,036,296/15,027,97,14,9 (142)
Ostrów Wielkopolski,WCL 041/48,2100,2300,94,060,055,289/20,045,103,22,13 (155)
S (EPOM),WCL 040/48,1900,2300,94,336,330,298/20,322,78,1.3,1 (156)
EPOM MICHAŁKÓW k/Ostrowa Wlkp,CMP 117/49,1900,2300,94,043,037,298/20,025,97,2.4,1 (158)
E (EPOM),CMP 114/52,1900,2300,94,089,083,298/20,077,111,3.7,2 (160)
Kalisz,CMP 109/55,1400,2300,94,057,051,298/20,041,102,6.0,4 (163)
Warta,LOZ 259/38,2200,2300,94,098,093,297/20,089,113,20,11 (174)
C (EPLL),LOZ 259/25,2000,2300,94,083,077,297/21,070,110,12,7 (181)
W (EPLL),LOZ 259/19,2700,2300,94,083,077,297/21,070,110,6.2,3 (184)
L (EPLL),LOZ 274/13,2000,2300,94,058,052,289/16,044,103,7.3,4 (188)
Y (EPLL),LOZ 256/10,2300,2300,94,147,141,289/17,147,110,4.4,2 (191)
EPLL Łódź,LOZ 244/9,2200,2300,94,132,126,289/17,129,116,2.4,1 (192)
"Elevation 606 ft (22 hPa)
SS 15:14 Z, ECT 15:50 Z",,,,,,,,,,289,3:11

TWR,ŁÓDŹ TOWER,124.230
ATIS,ATIS,135.680
TWR,Łódź Delivery,120.005
EPLL,Warszawa Information,128.575
EPLL,Warszawa Information,119.450
Poznan Flight Information Service,Poznan Information,126.300
Poznan Flight Information Service,Poznan Information,127.250
A/G,LESZNO RADIO,122.305
A/G,Goledzinow Radio,122.700
TWR,WROCŁAW DELIVERY,121.805
TWR,WROCŁAW TOWER,120.255
ATIS,ATIS,124.330
A/G,Szymanów Radio,124.115
A/G,MICHAŁKÓW RADIO,122.205

LOD (Lodz),,110.500
LOZ (Wiaczyn Dolny),,112.400
CMP (Czempin),,114.500
WCL (Wroclaw/Strachowice),,111.650
WRO (Wroclaw/Strachowice),,110.300
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

        fuelRemaining = fuelRemaining - fuelPerHour * time / 60
        inputs.filter(a => a.name.includes("waypoint"))[0].value = `${entry[0]} - ${rnav}`;
        inputs.filter(a => a.name.includes("ttrk"))[0].value = entry[row.TrkT];
        inputs.filter(a => a.name.includes("mvar"))[0].value = "-6"
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