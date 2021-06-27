function init() {
    d3.json("/code/samples.json").then(function (jsonData) {
        let data=jsonData;
        // console.log(data);

        let data_names=data.names;
        var dropDownMenu=d3.select("#selDataset");

        data_names.forEach(function (name) {
            dropDownMenu.append("option").text(name).property("value", name);
        });

        let defaultID="940";

        datapull(defaultID);
    });
}

function dataPull(defaultID) {
    d3.json("/code/samples.json").then(function (jsonData) {
        console.log("1. pull data");
        let data=jsonData;

        let testSub=data.samples.filter((val) => val.id == defaultID);
        // console.log(testSub);
        var testSubObject=testSub[0];
        // console.log(testSubObject);

        let otu_ids=testSubObject.otu_ids;
        //otu_ids = otu_ids.slice(0, 10);
        //console.log(otu_ids);

        let otu_idlist = [];
        for (let i=0; i< otu_ids.length; i++) {
            otu_idlist.push('OTU# ${otu_ids[i]}');
        }

        let sample_values = testSubObject.sample_values;
        //sample_values = sample_values.slice(0, 10);
        //console.log(sample_values);

        let otu_labels = testSubObject.otu_labels;
        //otu_labels = otu_labels.slice(0, 10);
        //console.log(otu_labels);

        let testSubDemos = data.metadata.filter((val) => val.id == defaultID);
        testSubDemos = testSubDemos[0];
        console.log(testSubDemos);

        let wfreq = Object.values(testSubDemos)[6];
        console.log(wfreq);

        let results = {
            idStr: otu_idlist,
            ids: otu_ids,
            values: sample_values,
            labels: otu_labels,
        };

        barChart(results);
        bubbleChart(results);
        gaugeChart(wfreq);
        generateTable(testSubDemos)

    });
}


// Build plots - bar, bubble, gauge, and table

function barChart(results) {
    console.log(results);
    let otu_ids = results.idStr.slice(0,10);
    let sample_values = results.values.slice(0,10);
    let otu_labels = results.labels.slice(0,10);
    let otuNumber = results.ids.slice(0,10);
    let colors = [];
    for (let i=0; i < sample_values.length; i++) {
        colors.push("rgb(0,0," + (1-sample_values[i]/180+")");
    }
    console.log(sample_values);

    let trace = {
        x: sample_values,
        y: otu_ids,
        mode: "markers",
        marker: {
            color: colors,
            line: {
                width: 1,
            },
        },
        orientation: "h",
        type: "bar",
    };

    let plotdata = [trace];

    let layout = {
        hoverinfo: otu_labels,
        title: {
            text: "Top 10 Bacterial Cultures Found",
            font: {
                size: 20,
                xanchor: "left",
                yanchor: "top",
            },
        },
        autosize: false,
        width: 375,
        height: 550
        margin: {
            l: 50,
            r: 50,
            t: 100,
            b: 100,
            pad: 4,
        },
        yaxis: {
            autorange: "reversed",
            automargin: true,
        },
    };

    let config = {
        responsive: true,
    };

    Plotly.newPlot("bar", plotdata, layout, config);
}


}
