// Load the Sample JSON file

// d3.json("/data/samples.json", function(data) {
    // console.log(data);
// });

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata=data.metadata;
        console.log(metadata);
        
        // Filter data
        var resultsarray = metadata.filter(sampleobject => sampleobject.id == sample);
        var results = resultsarray[0];
        
        // Use d3 for panel selection
        var panelData = d3.select("#sample-metadata");
        // Clear existing data in HTML
        panelData.html("");
        
        // Add key and value pairs to panel
        Object.entries(results).forEach(([key, value]) => {
            panelData.append("h6").text('${key.toUpperCase()}: ${value}');
        });

        // Bonus: Gauge Chart
    });
}


// Use "d3.json" to gather sample data for plots

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultsarray = samples.filter(sampleObj => sampleObj.id == sample);
        var results = resultsarray[0]
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

        // Build bubble chart
        var bubbleChart = {
            title: "Bacteria Cultures Per Sample",
            xaxis: {title: "OTU ID"},
            hovermode:"closest",
        };

        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    color: otu_ids,
                    size: sample_values,
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleChart);

        // Build horizontal bar chart
        var yticks = otu_ids.slice(0, 10).map(otuID => 'OTU ${otuID}').reverse();
        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type:"bar",
                orientation:"h",
            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
};

// Dropdown select element
// Use list of sample names to populate "select" options
function init() {
    var dropdownSelect = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            dropdownSelect
            .append("option")
            .text(sample)
            .property("value", sample);
        })

        // Sample data from list to build plots
        var sampleData = sampleNames[0];
        buildCharts(sampleData);
        buildMetadata(sampleData);

    });
};

// Retrieve new data each time a new sample is selected
function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
};

// Initialize dashboard
init()