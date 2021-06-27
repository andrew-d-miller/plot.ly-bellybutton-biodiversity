// Load the Sample JSON file

d3.json("/data/samples.json", function(data) {
    console.log(data);
});

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata=data.metadata;
        var resultsarray=metadata.filter(sampleobject => sampleobject.id == sample);
        var results=resultsarray[0]
        var PANEL=d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(results).forEach(([key, value]) => {
            PANEL.append("h6").text('${key}: ${value}');
        });

        // Bonus: Gauge Chart
    });
}


// Use "d3.json" to gather sample data for plots

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples=data.samples;
        var resultarray=samples.filter(sampleobject => sampleobject.id == sample);
        var result=resultarray[0]
        var ids=result.otu_ids;
        var labels=result.otu_labels;
        var values=result.sample_values;

        // Build bubble chart
        var LayoutBubble = {
            margin: {t:0},
            xaxis: {title: "ID's"},
            hovermode:"closest",
        };

        var DataBubble = [
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                    color: ids,
                    size: values,
                }
            }
        ];

        Plotly.plot("bubble", DataBubble, LayoutBubble);

        // Build bar chart

        var bar_data = [
            {
                y:ids.slice(0,10).map(otuID => 'OTU ${otuID}').reverse(),
                x:values.slice(0,10).reverse(),
                text:labels.slice(0,10).reverse(),
                type:"bar",
                orientation:"h"
            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t:30, l:150}
        };

        Plotly.newPlot("bar", bar_data, barLayout);
    });
}

// Dropdown select element
// Use list of sample names to populate "select" options
function init() {
    var selector=d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleNames=data.names;
        sampleNames.forEach((sample) => {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });

        const first_sample=sampleNames[0];
        buildCharts(first_sample);
        buildMetadata(first_sample);
    });
}

function optionChanged(new_sample) {
    buildCharts(new_sample);
    buildMetadata(new_sample);
}

// Initialize dashboard
init();