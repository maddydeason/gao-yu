//HEADER
$(window).scroll(function() {
  var scroll = $(window).scrollTop();
	$(".zoom-me img").css({
		width: (100 + scroll/5)  + "%",
		top: -(scroll/10)  + "%",
	});
});

//SUBHEADS
(function($) {
  
  var bottomOffset = 150;
  
  // Do our DOM lookups beforehand
  var container = $("article");
  
  // Scrolling into top of article
  container.waypoint({
    handler: whenTopOfSection
  });
  
  // Scrolling into bottom of article
  container.waypoint({
    offset: bottomSectionOffset,
    handler: whenBottomOfSection
  });
  
  function bottomSectionOffset() {
    return -($(this).height() - bottomOffset);
  }
  
  function whenTopOfSection(direction) {
    $(this).toggleClass('sticky', direction != 'up')
  }
  
  function whenBottomOfSection(direction) {
    $(this).toggleClass('hide', direction != 'up')
  }

})(jQuery);

//BAR CHART
var margin = {
      top: 5,
      right: 20,
      bottom: 40,
      left: 60
    },
    width = 320 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
  var y = d3.scale.linear()
    .range([height, 0]);
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<span>" + d.number + " imprisoned journalists</span>";
    })
  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg.call(tip);
  var data = [{
    country: "China",
    number: 44
  }, {
    country: "Iran",
    number: 30
  }, {
    country: "Eritrea",
    number: 23
  }, {
    country: "Ethiopia",
    number: 17
  }, {
    country: "Vietnam",
    number: 16
  }];
  x.domain(data.map(function(d) {
    return d.country;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.number;
  })]);
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "x-label")
    .attr("y", 35)
    .attr("dx", "27em")
    .style("text-anchor", "center");
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "y-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .text("Number of Imprisoned Journalists");
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
      return x(d.country);
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      return y(d.number);
    })
    .attr("height", function(d) {
      return height - y(d.number);
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

//DONUT CHART
var width = 320,
  height = 320,
  radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
  .range(["#DE2910", "#FFDE00", "afafaf"]);

var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 80);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d.data.what + "<br><span>" + d.data.number + " journalists<br>" + d.data.percent + "%</span>";
  })

var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    return d.number;
  });

var svg = d3.select("#donut").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.call(tip);

var data = [{
  what: "Anti-State",
  number: 29,
  percent: 65.9
}, {
  what: "Other",
  number: 12,
  percent: 27.3
}, {
  what: "No Charge",
  number: 3,
  percent: 6.8
}];

var g = svg.selectAll(".arc")
  .data(pie(data))
  .enter().append("g")
  .attr("class", "arc")
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

g.append("path")
  .attr("d", arc)
  .attr("class", "path")
  .style("fill", function(d) {
    return color(d.data.what);
  });

g.append("text")
  .attr("transform", function(d) {
    return "translate(" + arc.centroid(d) + ")";
  })
  .attr("dy", ".35em")
  .style("text-anchor", "middle")
  .text(function(d) {
    return d.data.what;
  });