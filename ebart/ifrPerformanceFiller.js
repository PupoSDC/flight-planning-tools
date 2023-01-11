const aerodromes = [
    {
        ad: "EPLL",
        rwy: "25",
        rwydir: "R",
        surface: "PD",
        slope: "0",
        rwydto1: "ASDA",
        rwydto2: "2500",
        rwydldg2: "2500",
        factorto: "1.3",
        factorldg: "1.44",
        massto: "1230",
        massldg: "1230",
        minrvr: "1000",
        minceiling: "300",
        aefh: "1000",
        obsdist: "3135",
        obsalt: "632",
        obsnum: "4",
    },
    {
        ad: "EPLL",
        rwy: "07",
        rwydir: "L",
        surface: "PD",
        slope: "0",
        rwydto1: "ASDA",
        rwydto2: "2500",
        rwydldg2: "2500",
        factorto: "1.3",
        factorldg: "1.44",
        massto: "1230",
        massldg: "1230",
        minrvr: "1000",
        minceiling: "300",
        aefh: "1000",
        obsdist: "11875",
        obsalt: "1598",
        obsnum: "27",
    },
    {
        ad: "EPMO",
        rwy: "08",
        rwydir: "",
        surface: "PD",
        slope: "0",
        rwydto1: "TORA",
        rwydto2: "2500",
        rwydldg2: "2500",
        factorto: "1.25",
        factorldg: "1.44",
        massto: "1230",
        massldg: "1230",
        minrvr: "1000",
        minceiling: "300",
        aefh: "1000",
        obsdist: "3010",
        obsalt: "368",
        obsnum: "1",
    },
    {
        ad: "EPMO",
        rwy: "26",
        rwydir: "",
        surface: "PD",
        slope: "0",
        rwydto1: "TORA",
        rwydto2: "2500",
        rwydldg2: "2500",
        factorto: "1.25",
        factorldg: "1.44",
        massto: "1230",
        massldg: "1230",
        minrvr: "1000",
        minceiling: "300",
        aefh: "1000",
        obsdist: "5922",
        obsalt: "499",
        obsnum: "4",
    },

    
    // EPPO
    {
        ad: "EPPO",
        rwy: "08",
        rwydir: "",
        surface: "PD",
        slope: "0",
        rwydto1: "TORA",
        rwydto2: "2500",
        rwydldg2: "2500",
        factorto: "1.25",
        factorldg: "1.44",
        massto: "1230",
        massldg: "1230",
        minrvr: "1000",
        minceiling: "300",
        aefh: "1000",
        obsdist: "3010",
        obsalt: "368",
        obsnum: "1",
    },
    {
        ad: "EPPO",
        rwy: "26",
        rwydir: "",
        surface: "PD",
        slope: "0",
        rwydto1: "TORA",
        rwydto2: "2500",
        rwydldg2: "2500",
        factorto: "1.25",
        factorldg: "1.44",
        massto: "1230",
        massldg: "1230",
        minrvr: "1000",
        minceiling: "300",
        aefh: "1000",
        obsdist: "5922",
        obsalt: "499",
        obsnum: "4",
    },
]

document.querySelector('input[name="vr"]').value = 65;
document.querySelector('input[name="vy"]').value = 84;
document.querySelector('input[name="vg"]').value = 84
document.querySelector('input[name="vmca"]').value = 84;
document.querySelector('input[name="maxoeicalt"]').value = 6500;
document.querySelector('input[name="maxcruise"]').value = 13500;

[...document.querySelectorAll(".border.rounded.greyback")].map((e, i) => {
    Object.entries(aerodromes[i]).map(([key, value]) => {
        e.querySelector(`*[name*="[${key}]"]`).value = value
    })
    e.querySelector(`*[name*="[obsstatus]"`).value = "OK"
});





