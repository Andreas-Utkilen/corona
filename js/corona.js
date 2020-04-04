let table = document.getElementById("table");
let search_field = document.getElementById("search");
search_field.onkeyup = search;

var data_input = {};

async function downloadData() {
    var response = await fetch("https://covid-193.p.rapidapi.com/statistics", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": "9c026b049fmsh1b50b0ecd8c0fd6p13cb90jsn4f309fc54a95"
        }
    });
    var body = await response.json()
    console.log(body);
    data_input = body.response;
    createTable(body.response, 'cases')

}
downloadData()
    /* Create table */
function createTable(data, current_sort) {
    table.innerHTML = "";

    let total_deaths = 0;
    let total_cases = 0;
    let total_recovered = 0;
    let total_population = 0;

    let chart_data = [];

    createHeader(current_sort)

    switch (current_sort) {
        case 'country':
            data.sort(function(a, b) {
                if (a.country < b.country) { return -1; }
                if (a.country > b.country) { return 1; }
                return 0;
            })
            break;
        case 'cases':
            data.sort(function(a, b) { return b.cases.total - a.cases.total })
            break;
        case 'deaths':
            data.sort(function(a, b) { return b.deaths.total - a.deaths.total })
            break
        case 'recovered':
            data.sort(function(a, b) { return b.cases.recovered - a.cases.recovered })
            break
        case 'CPC':

            break
        case 'DPC':
            break
    }


    let body = table.createTBody();
    for (const c of data) {
        c.country = c.country.replace(/-/g, ' ');
        if (c.country == "All") {
            continue;
        }
        const cases_per_1m = calculatePer1M(c.cases.total, populations[c.country]);
        const deaths_per_1m = calculatePer1M(c.deaths.total, populations[c.country]);
        createRow(body, c.country, c.cases.total, c.deaths.total, c.cases.recovered, cases_per_1m, deaths_per_1m);
        chart_data.push({ country: c.country, value1: cases_per_1m, value2: deaths_per_1m, cases: c.cases.total })

        total_cases += c.cases.total;
        total_deaths += c.deaths.total;
        total_recovered += c.cases.recovered;
        let population = populations[c.country];
        if (population != undefined) {
            total_population += populations[c.country];
        }
    }
    //createRow(body, "Totalt", total_cases, total_deaths, total_recovered, calculatePer1M(total_cases, total_population), calculatePer1M(total_deaths, total_population))
    drawBarChart(chart_data)
}

function createHeader(current_sort) {
    let options = {
        country: "Land ◀︎",
        cases: "Smittede ◀︎",
        deaths: "Døde ◀︎",
        recovered: "Friskmeldte ◀︎",
        CPC: "Smittede per 1M",
        DPC: "Smittede per 1M"
    }
    options[current_sort] = options[current_sort].replace("◀︎", "▼")
    let header = table.createTHead();
    let row = header.insertRow();
    for (const key in options) {
        let cell = row.insertCell()
        cell.innerHTML = options[key];
        cell.onclick = () => {
            createTable(data_input, key)
        }
    }
}

/* Create rows */
function createRow(body, country, cases, deaths, recovered, cases_per_head, deaths_per_head) {
    let row = body.insertRow();
    let _country = row.insertCell(0);
    let _cases = row.insertCell(1);
    let _deaths = row.insertCell(2);
    let _recovered = row.insertCell(3);
    let _cases_per_head = row.insertCell(4);
    let _deaths_per_head = row.insertCell(5);

    _country.innerHTML = numberToString(country);
    _cases.innerHTML = numberToString(cases);
    _deaths.innerHTML = numberToString(deaths);
    _recovered.innerHTML = numberToString(recovered);
    _cases_per_head.innerHTML = numberToString(cases_per_head);
    _deaths_per_head.innerHTML = numberToString(deaths_per_head);
}

function calculatePer1M(cases, pop) {
    return Math.round(cases / pop * 1000000)
}
/* Search function */
function search() {
    var tmp_data = [];

    var search_text = search_field.value;
    for (const c of data_input) {
        if (includes(c.country, search_text)) {
            tmp_data.push(c)
        }
    }
    createTable(tmp_data)
}

function includes(attribute, value) {
    attribute = attribute.toString().toLowerCase();
    value = value.toString().toLowerCase();
    if (attribute.includes(value)) {
        return true;
    } else {
        return false;
    }
}