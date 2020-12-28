var svg = d3.select('svg');

var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// Define a padding object
var padding = {t: 90, r: 20, b: 40, l: 55};

// ScatterPlot dimensions
var spWidth = 600;
var spHeight = 500;

// Bar dimensions
var brWidth = 590;
var brHeight = 300;

var barMargin = {top: 10, right: 30, bottom: 70, left: 30},
    barWidth = 590 - barMargin.left - barMargin.right,
    barHeight = 300 - barMargin.top - barMargin.bottom;

// append the svg object to the body of the page
var barSvg = d3.select("#bar-chart")
  .append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + barMargin.left + "," + barMargin.top + ")");



// Create group for ScatterPlot
var scatterPlot = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

var spXAxis = scatterPlot.append('g')
    .attr('transform', 'translate('+[50, spHeight]+')');

var spYAxis = scatterPlot.append('g')
    .attr('transform', 'translate('+[50, 0]+')');

// bubble chart radius for plot
var rScale = d3.scaleSqrt()
    .range([1,15]);

var spColors = ["aquamarine", "darkmagenta", "lightsalmon", "mediumturquoise", "lightseagreen", "lightskyblue","limegreen", "burlywood","pink"];



// Region color scale
var regionColorScale = d3.scaleOrdinal();
regionColorScale.range(spColors);

// Makeshift control scale
var controlColorScale = d3.scaleOrdinal();
controlColorScale.domain(['Private', 'Public']);
controlColorScale.range(['#eee', 'black']);

// bar Chart colors
var barColor = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

// Create scales
var xScale = d3.scaleLinear().range([0, spWidth]);
var yScale = d3.scaleLinear().range([spHeight, 0]);


// Regression line
var regression = d3.line();

// Filter term
var filterTerm = '';

// Dot radius
var dotRad = 5;

// Thickness of private dots' strokes
var privateStroke = 1;

var controlFilter = [];
var regionFilter = [];

// Make tooltip
var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
        return "<h5>"+d['name']+"</h5>" + ``
    });
svg.call(toolTip);


function dataFilter(d) {
        var dataCheck = (d[chartScales.x] != 0 && !isNaN(d[chartScales.x]) && d[chartScales.y] != 0 && !isNaN(d[chartScales.y]));
        var controlCheck;
        if (controlFilter.length > 0) {
            controlCheck = controlFilter.includes(d.control);
        } else {
            controlCheck = true;
        }
        var regionCheck;
        if (regionFilter.length > 0) {
            regionCheck = regionFilter.includes(d.region);
        } else {
            regionCheck = true;
        }
        return dataCheck && controlCheck && regionCheck;
}

function update(data) {

    var barX = d3.scaleBand()
        .range([ 0, barWidth ])
        .domain(data.map(function(d) { return d.group; }))
        .padding(0.2);
    barSvg.append("g")
        .attr("class", "myXaxis")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(d3.axisBottom(barX))

    maxValue = d3.max(data, function(d) { return d.value });
    barSvg.select('.myYaxis').remove();


    // format of percentage
    var formatPercent = function(d) {
                return d * 100 + '%';}

    // Add Y axis
    var barY = d3.scaleLinear()
      .domain([0, maxValue])
      .range([ barHeight, 0]);
    barSvg.append("g")
      .attr("class", "myYaxis")
      .attr('transform', 'translate('+[0, 0]+')')
      .call(d3.axisLeft(barY).ticks(5).tickFormat(formatPercent));

    var u = barSvg.selectAll("rect")
        .data(data)

        u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
          .attr("x", function(d) { return barX(d.group); })
          .attr("y", function(d) { return barY(d.value); })
          .attr("width", barX.bandwidth())
          .attr("height", function(d) { return barHeight - barY(d.value); })
          .attr("fill", function (d, i) {
            return barColor(i);
          })
}




d3.csv('./data/colleges.csv',
function(row){
    // This callback formats each row of the data
    return {
        name: row['Name'],
        predominant_deg: +row['Predominant Degree'],
        highest_deg: +row['Highest Degree'],
        control: row['Control'],
        region: row['Region'],
        locale: row['Locale'],
        admission_rate: +row['Admission Rate'],
        act_median: +row['ACT Median'],
        sat_average: +row['SAT Average'],
        undergrad_population: +row['Undergrad Population'],
        percent_white: +row['% White'],
        percent_black: +row['% Black'],
        percent_hispanic: +row['% Hispanic'],
        percent_asian: +row['% Asian'],
        percent_american_indian: +row['% American Indian'],
        percent_pacific_islander: +row['% Pacific Islander'],
        percent_biracial: +row['% Biracial'],
        percent_nonresident_aliens: +row['% Nonresident Aliens'],
        percent_part_time: +row['% Part-time Undergrads'],
        avg_cost: +row['Average Cost'],
        expenditure_per_student: +row['Expenditure Per Student'],
        avg_faculty_salary: +row['Average Faculty Salary'],
        percent_full_time_faculty: +row['% Full-time Faculty'],
        percent_undergrad_w_pell_grant: +row['% Undergrads with Pell Grant'],
        completion_rate: +row['Completion Rate 150% time'],
        retention_rate: +row['Retention Rate (First Time Students)'],
        percent_undergrads_25plus: +row['% Undergrads 25+ y.o.'],
        three_year_default_rate: +row['3 Year Default Rate'],
        median_debt: +row['Median Debt'],
        median_debt_on_grad: +row['Median Debt on Graduation'],
        median_debt_on_widthdraw: +row['Median Debt on Withdrawal'],
        percent_federal_loans: +row['% Federal Loans'],
        percent_pell_recipients_avg_age_of_entry: +row['% Pell Grant Recipients Average Age of Entry'],
        avg_family_income: +row['Average Family Income'],
        median_family_income: +row['Median Family Income'],
        poverty_rate: +row['Poverty Rate'],
        num_unemployed_after_8years: +row['Number of Unemployed 8 years after entry'],
        num_employed_after_8years: +row['Number of Employed 8 years after entry'],
        mean_earnings_after_8years: +row['Mean Earnings 8 years After Entry'],
        median_earnings_after_8years: +row['Median Earnings 8 years After Entry'],
        employment_rate_after_8years: +row['Number of Employed 8 years after entry'] / (+row['Number of Employed 8 years after entry'] + +row['Number of Unemployed 8 years after entry'])
    }
},
function(error, dataset){
    if(error) {
        console.error('Error while loading ./data/colleges.csv dataset.');
        console.error(error);
        return;
    }
    // Define dataset globally
    colleges = dataset;

    // Define legend for private/public control
    var controlLegend = d3.legendColor().shape('rect').shapeRadius(dotRad).scale(controlColorScale);


    // Radius for plot
    var radiusMax = d3.max(colleges, function(d){
        return +d['undergrad_population'];
    });
    //console.log(0, radiusMax);
    rScale.domain([0,radiusMax]);


    svg.append('g')
        .attr('transform', 'translate('+[990, 120]+')')
        .call(controlLegend);

    svg.selectAll('.cell')
        .attr('stroke', function (d) {
            if (d === 'Private') {
                d3.select(this).select('.swatch')
                    //.append('rect')
                    .attr('stroke-width', privateStroke)
                    .attr('stroke', 'black');

            }
        });

    // Nest region data
    var regionData = d3.nest()
        .key(function(d) {
            return d.region;
        })
        .entries(colleges);


    // Set localColor domain to be set of all unique regions
    var regionDomain = regionData.map(function(d) {
        return d.key;
    }).sort(function(a, b) {
        return d3.ascending(a, b);
    });
    regionColorScale.domain(regionDomain);

    // Define legend for region colors
    var regionLegend = d3.legendColor().scale(regionColorScale);

    // region by colors
    svg.append('g')
        .attr('transform', 'translate('+[790, 120]+')')
        .call(regionLegend);

    legendCells = svg.selectAll('.cell')
        .on('click', function (d) { // filters data
            if (d === 'Private' || d === 'Public') {
                if (!controlFilter.includes(d)) {
                    controlFilter.push(d);
                    if (controlFilter.length === 2) {
                        controlFilter = [];
                    }
                } else {
                    controlFilter.pop(d);
                }
            }
            // Handle region filters
            else {
                if (!regionFilter.includes(d)) {
                    regionFilter.push(d);
                    if (regionFilter.length === 9) {
                        regionFilter = [];
                    }
                } else {
                    regionFilter.pop(d);
                }
            }
            updateViz()
        });


    // Create global object called chartScales to keep state
    chartScales = {x: 'percent_federal_loans', y: 'median_debt'};

    //updateBarChart();
    updateViz();

    // Autocomplete College names
    $( function() {
        $( "#searchInput" ).autocomplete({
            source: dataset.map(function(d) { return d.name; })
        });
    });
});


function updateViz() {
    data = colleges.filter(function(d) {
        return dataFilter(d);
    });

    xDomain = d3.extent(data, function(data_element){
        return data_element[chartScales.x];
    });

    yDomain = d3.extent(data, function(data_element){
        return data_element[chartScales.y];
    });

    // Update the scales based on new data attributes
    xScale.domain(xDomain).nice();
    yScale.domain(yDomain).nice();

    // Update y axises
    if (chartScales.y === 'median_debt' || chartScales.y=== 'avg_family_income' || chartScales.y === 'mean_earnings_after_8years') {
        spYAxis.transition()
            .call(d3.axisLeft(yScale).tickFormat(d3.format("$,i")));
    } else if (chartScales.y === 'percent_undergrad_w_pell_grant' ||  chartScales.y === 'employment_rate_after_8years') {
        spYAxis.transition()
            .call(d3.axisLeft(yScale).tickFormat(d3.format('.0%')));
    } else {
        spYAxis.transition()
            .call(d3.axisLeft(yScale));
    }

    // Update x axises
    if (chartScales.x === 'avg_cost' || chartScales.x === 'avg_family_income') {
        spXAxis.transition()
            .call(d3.axisBottom(xScale).tickFormat(d3.format("$,i")));
    } else {
        spXAxis.transition()
            .call(d3.axisBottom(xScale).tickFormat(d3.format('.0%')));
    }

    // Add a group for each region
    var dots = scatterPlot.selectAll('.dot')
        .data(data.filter(function(d) {
            return d.name.toLowerCase().indexOf(filterTerm.toLowerCase()) != -1;
    }));

    var dotsEnter = dots.enter()
        .append('g')
        .attr('class', 'dot')
        .on('click', function(d, i) {
            var dataElement = d;
            d3.select("#name1").text(d.name).style("font-size", "22px");
            d3.select("#admission_rate1").text((d['admission_rate']*100).toFixed(2) + '%');
            d3.select("#act_median1").text(d.act_median);
            d3.select("#sat_average1").text(d.sat_average);
            d3.select("#undergrad_population1").text(d.undergrad_population);
            d3.select("#retention_rate1").text((d['retention_rate']*100).toFixed(2) + '%');
            var barGraphData = [
            {
                "group": "White",
                "value": d.percent_white
            },
            {
                "group": "Black",
                "value": d.percent_black
            },
            {
                "group": "Hispanic",
                "value": d.percent_hispanic
            },
            {
                "group": "Asian",
                "value": d.percent_asian
            },
            {
                "group": "American Indian",
                "value": d.percent_american_indian
            },
            {
                "group": "Pacific Islander",
                "value": d.percent_pacific_islander
            },
            {
                "group": "Biracial",
                "value": d.percent_biracial
            },
            ]
            update(barGraphData);
        })
        .on('mouseover', function(d, i) {
            toolTip.show(d, i);
        })
        .on('mouseout', toolTip.hide);

    dotsEnter.append('circle')
        .attr('r', function(d) {
            return rScale(d["undergrad_population"]);
    })
    dots.merge(dotsEnter)
        .transition()
        .attr('fill', function(d) {
            if (d['control'] === 'Private') {
                return '#eee'
            } else {
                return regionColorScale(d.region);
            }
        })
        .attr('stroke', function (d) {
            return regionColorScale(d.region);
        })
        .attr('stroke-width', privateStroke)
        .attr('transform', function(d) {
            var tx = xScale(d[chartScales.x]);
            var ty = yScale(d[chartScales.y]);
            return 'translate('+[tx+ 50, ty]+')';
        });

    dots.exit().remove();

    var records = getVals(chartScales.x, chartScales.y);

    regression.x(function (d) { return xScale(d.xVal); } )
        .y(function (d) { return yScale(d.yVal); } );

}

function onXChanged() {
    var select = d3.select('#xSelect').node();
    var x = select.options[select.selectedIndex].value;

    chartScales.x = x;

    updateViz();
}

function onYChanged() {
    var select = d3.select('#ySelect').node();
    var y = select.options[select.selectedIndex].value;
    chartScales.y = y;
    updateViz();
}


function onFilterTermChanged(newFilterTerm) {
    filterTerm = newFilterTerm;
    updateViz();
}


function search(){
    var text = d3.select('#searchInput').node().value;
    updateViz();
}

function clearFilter() {
    controlFilter = [];
    regionFilter = [];
    filterTerm = '';
    d3.select('#searchInput').property('value', '');
    d3.selectAll('.cell')
        .classed('hidden', function(d) {
            return regionFilter.includes(d);
        });
    updateViz();
}

function calculateLineData(leastSquares,xRange,iterations){
    var returnData = [];
    for(var i=0; i<iterations; i++){
        var randomX = randomFloatBetween(xRange[0],xRange[1]);
        returnData.push({
            xVal:randomX,
            yVal: (randomX*leastSquares[0])+leastSquares[1]
        });
    }
    return returnData;
}

function randomFloatBetween(minValue,maxValue,precision){
    if(typeof(precision) == 'undefined'){
        precision = 2;
    }
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
}

function getVals(x, y) {
    var outX = [];
    var outY = [];
    data.forEach(function (d) {
        outX.push(d[x]);
        outY.push(d[y]);
    });

    return {x: outX, y: outY};
}