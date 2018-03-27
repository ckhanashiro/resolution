
// load the data

var apSvg;
var graphExists = false;
var graphType = 5;
var yVariable = "ren002";

function execScriptGraph (theme, variable, xlabel, ylabel) {
    console.log ("Vai verifiar");
    if (graphExists || (theme == 0 && variable == "") ||
        (theme != 4)) {
//        d3.select ("svg").remove();
        console.log ("Vai retirar:",graphExists,theme,variable);
        $("#d3-elements").empty ();
        $("#graphic-close").hide ();
        
        graphExists = false;
    } else {
        console.log ("Vai desenhar Educação");
        if (graphType == 1) {
            $.getScript( "js/graphics-eixos_xy.js", function( data, textStatus, jqxhr ) {
                //console.log( data ); // Data returned
                //console.log( textStatus ); // Success
                //console.log( jqxhr.status ); // 200
                console.log( "Eixos was performed." );
                //graphExists = true;
            });
        } else if (graphType == 2) {
            $.getScript( "js/graphics-circles.js", function( data, textStatus, jqxhr ) {
                console.log( "Circles was performed." );
                //graphExists = true;
            });		
        } else if (graphType == 3) {
            $.getScript( "js/graphics-barras-and-mapa.js", function( data, textStatus, jqxhr ) {
                console.log( "Barras was performed." );
                //graphExists = true;
            });		
        } else if (graphType == 4) {
            $.getScript( "js/graphics-bubbles.js", function( data, textStatus, jqxhr ) {
                console.log( "Bubbles was performed." );
               // graphExists = true;
            });		
        } else if (graphType == 5) {
            loadGraphicCircles (theme, variable, xlabel, ylabel);
            //graphExists = true;
            /*
            $.getScript( "js/graphics-circles-2.js", function( data, textStatus, jqxhr ) {
                console.log( "Circles-2 was performed." );
                graphExists = true;
            });		
            */
        }
    }
}

function loadGraphicCircles (theme, variable, xlabel, ylabel) {

    var apData = d3.csv ("ap2010_rmsp_cem_erase.csv", function (data) {
        var margin = {top: 20, right: 20, bottom: 50, left: 70},
            width = 300,
            height = 200;

        //apSvg = d3.select('.chart')
        apSvg = d3.select('#d3-elements')
        .append('svg')
            .attr('class', 'chart')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scale.linear()
            .domain([
    
                d3.min (data, function (d) {
                return d [yVariable]; //.p3_001; // <- população d.cartodb_id; 1071
                }),
                d3.max (data, function (d) {
                    return d [yVariable];//.p3_001; // <- população d.cartodb_id; 19292
                })
            ])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([
                d3.min (data, function (d) {
                    return d [variable];//d.p1_001
                }),
                d3.max (data, function (d) {
                    return d [variable];//137423;//d.p1_001;
                })
            ])
            .range([height, 0]);

        var scale = d3.scale.sqrt()
            .domain([d3.min(data, function (d) { return 5000; }), d3.max(data, function (d) { return 19; })])
            .range([1, 20]);

        var opacity = d3.scale.sqrt()
            .domain([d3.min(data, function (d) { return 30; }), d3.max(data, function (d) { return 20; })])
            .range([1, .5]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis().scale(x);
        var yAxis = d3.svg.axis().scale(y).orient("left");
        
        console.log ("yAxis: ", yAxis)

        // Add the x Axis
        apSvg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // text label for the x axis
        apSvg.append("text")
            .attr("transform",
                "translate(" + (width/2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text(xlabel);

        // Add the y Axis
        apSvg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // text label for the y axis
        apSvg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "2em")
            .style("text-anchor", "middle")
            .text(ylabel);

            
        apSvg.selectAll("circle")
            .data(data)
            .enter()
            .insert("circle")
            .attr("cx", width)
            .attr("cy", height)
            .attr("opacity", function (d) { return opacity(d.data); })
            .attr("r", 5)//function (d) { console.log ("scale d.data",d.p1_001, d.data, scale(d.p1_001)); return scale(d.data); })
            .style("fill", function (d) { return color(d.data); })
            .on('mouseover', function (d, i) {
                //console.log ("D: ", d, "D.data: ", d.data,"D.cartodb_id: ", d.cartodb_id,"D.p1_001: ", d.p1_001)
                fade(d.data, d.cartodb_id, .1);
            })
            .on('mouseout', function (d, i) {
                fadeOut(d.cartodb_id);
            })
            .transition()
    //      .delay(function (d, i) { return x(d.cartodb_id) - y(d.p1_001); })
            .duration(500)
            .attr("cx", function (d) { return x(d [yVariable]); }) // cartodb_id, .p3_001
            .attr("cy", function (d) { return y(d[variable]); }) // d.p1_001
            .ease("bounce");

            
        function fade(c, cartodb_id, opacity) {
            /*
            apSvg.selectAll("circle")
                .filter(function (d) {
                    console.log ("FILTER: ", d,"d.data", d.data,"C: ", c)
                    return d.data != c;
                })
                .transition()
                .style("opacity", opacity);
            */
            /*
                .style("fill", "#3498DB")
                .style("stroke", "black")
                .style("stroke-width", "10px")
                .style("opacity", ".8");
            */
        
            var cartoId = cartodb_id;
            //selectFeature(id);
            var pol = polygonsHighlighted;
            if (pol.length > 0) {
                for(var i = 0; i < pol.length; ++i) {
                    console.log ("OFF highLightNodeOff (ADD): ", pol[i])
                    map.removeLayer(pol[i].geo);
                    highLightNodeOff (pol[i].cartoId);
                }
                polygonsHighlighted = [];
            }

            pol = polygons[cartoId];
            if (pol) {
                for(var i = 0; i < pol.length; ++i) {
                //var tornadoLayer = L.geoJson().addTo(map);            
                console.log ("ON highLightNodeOn: ", pol[i])
                map.addLayer(pol[i].geo);
                highLightNodeOn (pol[i].cartoId);
                //tornadoLayer.addData(pol[i]);
                polygonsHighlighted.push(pol[i]);
                }
            }
                
        }

        function fadeOut(cartodb_id) {
            /*
            apSvg.selectAll("circle")
                .transition()
                .style("opacity", function (d) { opacity(d.data); })
                .style("stroke", "")
                .style("stroke-width", "0x")
            */
                    
            var cartoId = cartodb_id;
            //selectFeature(id);
            var pol = polygonsHighlighted;
            if (pol.length > 0) {
                for(var i = 0; i < pol.length; ++i) {
                    console.log ("OFF highLightNodeOff: ", pol[i])
                    map.removeLayer(pol[i].geo);
                    highLightNodeOff (pol[i].cartoId);
                }
                polygonsHighlighted = [];
            }
                
        }
    });
}

function highLightNodeOn (cartodb_id) {
    apSvg.selectAll("circle")
    .filter(function (d) {
        return d.cartodb_id == cartodb_id;
    })
    .style("stroke", "black")
    .style("stroke-width", "4px")
}

function highLightNodeOff (cartodb_id) {
    apSvg.selectAll("circle")
    .filter(function (d) {
        return d.cartodb_id == cartodb_id;
    })
    .style("stroke", "")
    .style("stroke-width", "0px")
}
//console.log ("==> apData: ", apData)

$("#graphic-close").click(function () {
    $("#d3-elements").empty ();
    $("#graphic-close").hide ();
});
    
/*
var sql = new cartodb.SQL({ user: 'cemdevops' });

sql.execute("SELECT the_geom, nome, dens_demo, pop_2000, area_km2 FROM munrm07")
    .done(function(dataQuery) {

        var height = 400;
        var width = 600;
        var margin = 40;
        var data =[];
        for(var i = 0; i < 42; i++) {
            data.push({
                x: Math.random() * 400,
                y: Math.random() * 100,
                c: Math.round(Math.random() * 5),
                size: Math.random() * 200,
            });
        }

        console.log(data);
        var labelX = 'X';
        var labelY = 'Y';
        var svg = d3.select('.chart')
            .append('svg')
            .attr('class', 'chart')
            .attr("width", width + margin + margin)
            .attr("height", height + margin + margin)
            .append("g")
            .attr("transform", "translate(" + margin + "," + margin + ")");

        var x = d3.scale.linear()
            .domain([d3.min(data, function (d) { return d.x; }), d3.max(data, function (d) { return d.x; })])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([d3.min(data, function (d) { return d.y; }), d3.max(data, function (d) { return d.y; })])
            .range([height, 0]);

        var scale = d3.scale.sqrt()
            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
            .range([1, 20]);

        var opacity = d3.scale.sqrt()
            .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
            .range([1, .5]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis().scale(x);
        var yAxis = d3.svg.axis().scale(y).orient("left");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", 20)
            .attr("y", -margin)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(labelY);
        // x axis and label
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", width + 20)
            .attr("y", margin - 10)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(labelX);

            
        svg.selectAll("circle")
            .data(data)
            .enter()
            .insert("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("opacity", function (d) { return opacity(d.size); })
            .attr("r", function (d) { return scale(d.size); })
            .style("fill", function (d) { return color(d.c); })
            .on('mouseover', function (d, i) {
                console.log ("D: ", d)
                fade(d.c, .1);
            })
            .on('mouseout', function (d, i) {
                fadeOut();
            })
            .transition()
            .delay(function (d, i) { return x(d.x) - y(d.y); })
            .duration(500)
            .attr("cx", function (d) { return x(d.x); })
            .attr("cy", function (d) { return y(d.y); })
            .ease("bounce");


        function fade(c, opacity) {
            svg.selectAll("circle")
                .filter(function (d) {
                    return d.c != c;
                })
                .transition()
                .style("opacity", opacity);
        }

        function fadeOut() {
            svg.selectAll("circle")
                .transition()
                .style("opacity", function (d) { opacity(d.size); });
        }
    });
    */