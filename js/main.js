var currentX;
var currentY;
/**
THIS FUNCTION IS CALLED WHEN THE WEB PAGE LOADS. PLACE YOUR CODE TO LOAD THE 
DATA AND DRAW YOUR VISUALIZATION HERE. THE VIS SHOULD BE DRAWN INTO THE "VIS" 
DIV ON THE PAGE.

This function is passed the variables to initially draw on the x and y axes.
**/
function init(xAxis, yAxis){
	var margin = {top: 40, right: 20, bottom: 30, left: 40};
    var width = 1280 - margin.left - margin.right;
    var height = 700 - margin.top - margin.bottom;
    // add the graph canvas to the body of the webpage
	var svg = d3.select("#vis").append("svg")
		.attr("id", "chart")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // setup x 
	var xValue = function(d) { return d[xAxis];}, // data -> value
	    xScale = d3.scale.linear().range([width, 0]), // value -> display
	    xMap = function(d) { return xScale(xValue(d));}, // data -> display
	    xAxe = d3.svg.axis().scale(xScale).orient("bottom");

	// setup y
	var yValue = function(d) { return d[yAxis];}, // data -> value
	    yScale = d3.scale.linear().range([height, 0]), // value -> display
	    yMap = function(d) { return yScale(yValue(d));}, // data -> display
	    yAxe = d3.svg.axis().scale(yScale).orient("left");

	var cValue = function(d) { return d.variety;},
    	color = d3.scale.category10();

   	// Load data
	d3.csv("data/data.csv", function(error, data) {

	  // Change string (from CSV) into number format
	  data.forEach(function(d) {
	    d.compactness = +d.compactness;
	    d.kernelLength = +d.kernelLength;
	    d.kernelWidth = +d.kernelWidth;
	    d.asymmetryCoefficient = +d.asymmetryCoefficient;
	    d.grooveLength = +d.grooveLength;
	    //console.log(d);
	    //console.log(d[xAxis]);
	  });
	  xScale.domain([d3.max(data, function(d){ return d[xAxis]})*1.02,d3.min(data, function(d){ return d[xAxis]})]);
	  yScale.domain([d3.min(data, function(d){ return d[yAxis]}),d3.max(data, function(d){ return d[yAxis]})]);
	  
	  var xText;
	  var yText;
	  if(xAxis === "compactness"){
	  	xText = "Compactness";
	  }
	  else if(xAxis === "kernelLength"){
	  	xText = "Length of Kernel";
	  }
	  else if(xAxis === "kernelWidth"){
	  	xText = "Width of Kernel";
	  }
	  else if(xAxis === "asymmetryCoefficient"){
	  	xText = "Asymmetry Coefficient";
	  }
	  else if(xAxis === "grooveLength"){
	  	xText = "Length of the Kernel Groove";
	  }

	  if(yAxis === "compactness"){
	  	yText = "Compactness";
	  }
	  else if(yAxis === "kernelLength"){
	  	yText = "Length of Kernel";
	  }
	  else if(yAxis === "kernelWidth"){
	  	yText = "Width of Kernel";
	  }
	  else if(yAxis === "asymmetryCoefficient"){
	  	yText = "Asymmetry Coefficient";
	  }
	  else if(yAxis === "grooveLength"){
	  	yText = "Length of the Kernel Groove";
	  }

	  // x-axis
	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxe)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text(xText)
	      .attr("font-size", "15px");

	  // y-axis
	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxe)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text(yText)
	      .attr("font-size", "15px");

	      // draw dots
		  svg.selectAll(".dot")
		      .data(data)
		    .enter().append("circle")
		      .attr("class", "dot")
		      .attr("r", 3.5)
		      .attr("cx", xMap)
		      .attr("cy", yMap)
		      .style("fill", function(d) { return color(cValue(d));}) 
		      .on("mouseover", function(d) {
		      	d3.selectAll(".dot").attr("opacity",.5);
		        d3.select(this).attr("r", 6).attr("opacity", 1);
		        var deats = "<b>Variety:</b> " + d.variety 
		         	+ "<br><b>Compactness:</b> " + d.compactness
		         	+ "<br><b>Kernel Length:</b> " + d.kernelLength
		         	+ "<br><b>Kernel Width:</b> " + d.kernelWidth
		         	+ "<br><b>Asymmetry Coefficient:</b> " + d.asymmetryCoefficient
		         	+ "<br><b>Groove Length:</b> " + d.grooveLength;
		        showDetails(deats);
		      })
		      .on("mouseout", function(d) {
		      	d3.selectAll(".dot").attr("opacity",1);
		      	d3.select(this).attr("r", 3.5);
		      	showDetails("");
		      });

		   // draw legend
		  var legend = svg.selectAll(".legend")
		      .data(color.domain())
		    .enter().append("g")
		      .attr("class", "legend")
		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		  // draw legend colored rectangles
		  legend.append("rect")
		      .attr("x", width - 18)
		      .attr("width", 18)
		      .attr("height", 18)
		      .style("fill", color);

		  // draw legend text
		  legend.append("text")
		      .attr("x", width - 24)
		      .attr("y", 9)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
		      .text(function(d) { return d;})


		});
	currentX = xAxis;
	currentY = yAxis;

}

/**
## onXAxisChange(value)
This function is called whenever the menu for the variable to display on the
x axis changes. It is passed the variable name that has been selected, such as
"compactness". Populate this function to update the scatterplot accordingly.
**/
function onXAxisChange(value){
	d3.select("#chart").remove();
	init(value,currentY);

}


/**
## onYAxisChange(value)
This function is called whenever the menu for the variable to display on the
y axis changes. It is passed the variable name that has been selected, such as
"Asymmetry Coefficient". Populate this function to update the scatterplot 
accordingly.
**/
function onYAxisChange(value){
	d3.select("#chart").remove();
	init(currentX,value);
}

/**
## showDetails(string)
This function will display details in the "details" box on the page. Pass in 
a string and it will be displayed. For example, 
    showDetails("Variety: " + item.variety);
**/
function showDetails(string){
    d3.select('#details').html(string);
}
