let table = document.getElementById("table");
let search_field = document.getElementById("search");
search_field.onkeyup = search;
let compare_btn = document.getElementById("compare-btn");
compare_btn.onclick = compare;
let show_all_btn = document.getElementById("show-all-btn");
show_all_btn.onclick = show;

let open_state = false;

function show() {
    let pane = document.getElementsByClassName("pane")[0]
    if (open_state) {
        pane.style.maxHeight = "69vh";
        show_all_btn.innerHTML = "Vis mer";
    } else {
        pane.style.maxHeight = "inherit";
        show_all_btn.innerHTML = "Vis mindre";
    }
    open_state = !open_state;
}

var data_input = {};
let current_sort = 'cases';

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
    createTable(body.response)

}
downloadData()
    /* Create table */
function createTable(data) {
    table.innerHTML = "";

    let total_deaths = 0;
    let total_cases = 0;
    let total_recovered = 0;
    let total_population = 0;

    let chart_data = [];

    createHeader()

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
        if (!isNaN(cases_per_1m)) chart_data.push({ country: c.country, value1: cases_per_1m, value2: deaths_per_1m, cases: c.cases.total })

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

function createHeader() {
    let options = {
        country: "Land ◀︎",
        cases: "Smittede ◀︎",
        deaths: "Døde ◀︎",
        recovered: "Friskmeldte ◀︎",
        CPC: "Smittede per 1M",
        DPC: "Smittede per 1M",
        compare: "Sammenlign"
    }
    options[current_sort] = options[current_sort].replace("◀︎", "▼")
    let header = table.createTHead();
    let row = header.insertRow();
    for (const key in options) {
        let cell = row.insertCell()
        cell.innerHTML = options[key];
        cell.onclick = () => {
            current_sort = key
            createTable(data_input)
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
    let _compare = row.insertCell(6);

    _country.innerHTML = numberToString(country);
    _cases.innerHTML = numberToString(cases);
    _deaths.innerHTML = numberToString(deaths);
    _recovered.innerHTML = numberToString(recovered);
    _cases_per_head.innerHTML = numberToString(cases_per_head);
    _deaths_per_head.innerHTML = numberToString(deaths_per_head);

    _compare.innerHTML = `<label>
                            <input id="${country}" type="checkbox" name="light" class="c-input check">
                            <span class="design"></span>
                        </label>`;

}

function compare() {
    var checkboxes = Array.from(document.getElementsByClassName("c-input")).filter(checkbox => checkbox.checked);
    if (checkboxes.length == 0) {
        return
    }
    var values = [];
    for (const box of checkboxes) {
        values.push(box.id)
    }
    var tmp_data = [];

    for (const c of data_input) {
        if (values.includes(c.country)) {
            tmp_data.push(c)
        }
    }
    createTable(tmp_data, current_sort)

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
    createTable(tmp_data, current_sort)
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