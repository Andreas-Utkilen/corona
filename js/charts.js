function drawBarChart(data) {
    var bar_chart = document.getElementById("bar-chart");
    bar_chart.innerHTML = "";
    /* Finds the largest number */
    var max_value = -Infinity;
    for (const point of data) {
        if (point.value1 > max_value) {
            max_value = point.value1;
        }
    }
    data = data.filter(function(a) { return a.cases >= 1000 })
    data.sort(function(a, b) { return b.value1 - a.value1 })
        /* Builds chart */
    for (const point of data) {
        const height1 = point.value1 / max_value * 100;
        const height2 = point.value2 / max_value * 100;

        let wrapper = document.createElement('div');
        wrapper.className = "bar-collection-wrapper";

        let container = document.createElement('div');
        container.className = "bar-collection";



        let bar1 = document.createElement('div');
        bar1.className = "bar";
        bar1.style.height = `${height1}%`;

        let bar2 = document.createElement('div');
        bar2.className = "bar";
        bar2.style.height = `${height2}%`;

        let bar1_text = document.createElement('p');
        bar1_text.innerHTML = point.value1;

        let bar2_text = document.createElement('p');
        bar2_text.innerHTML = point.value2;

        bar1.appendChild(bar1_text);
        bar2.appendChild(bar2_text);

        container.appendChild(bar1);
        container.appendChild(bar2);
        wrapper.appendChild(container);
        bar_chart.appendChild(wrapper);

        let text = document.createElement('p');
        text.className = "bar-names"
        text.innerHTML = point.country;
        wrapper.appendChild(text)
        if (height1 < 10) {
            bar1_text.classList.add("invert")
        }
        if (height2 < 10) {
            bar2_text.classList.add("invert")
        }
    }
}