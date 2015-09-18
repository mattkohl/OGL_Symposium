var gwidth = 480,
    gheight = 250;

var gsvg = d3.select("#gears").append("svg")
    .attr("width", gwidth)
    .attr("height", gheight)
  .append("g")
    .attr("transform", "translate(" + gwidth / 2 + "," + gheight / 2 + ")");

var gearBig = gsvg.append("g")
    .datum({teeth: 16, radius: gheight * 2 / 5})
    .attr("transform", "translate(" + -gheight * 1 / 5 + ",0)")
  .append("g")
    .attr("class", "gear");

gearBig.append("path")
    .style("fill", "darkslategrey")
    .attr("d", pathGear);

//gearBig.append("path")
//    .style("fill", "black")
//    .style("fill-opacity", .3)
//    .attr("d", d3.svg.arc()({
//      innerRadius: 20,
//      outerRadius: gheight * 2 / 5 - 8,
//      startAngle: 0,
//      endAngle: Math.PI
//    }));

var gearSmall = gsvg.append("g")
    .datum({teeth: 8, radius: -gheight * 1 / 5})
    .attr("transform", "translate(" + gheight * 2 / 5 + ",0)")
  .append("g")
    .attr("class", "gear");

gearSmall.append("path")
    .style("fill", "darkgray")
    .attr("d", pathGear);

//gearSmall.append("path")
//    .style("fill", "black")
//    .style("fill-opacity", .3)
//    .attr("d", d3.svg.arc()({
//      innerRadius: 20,
//      outerRadius: gheight * 1 / 5 - 8,
//      startAngle: -Math.PI,
//      endAngle: 0
//    }));

var gear = gsvg.selectAll(".gear");

d3.selectAll("input")
    .data([ease = easeReflect(easeAccelerateThenCoast(1.5), .5), d3.ease("cubic-in-out"), d3.ease("linear")])
    .on("change", function(d) { ease = d; loop(); })
    .call(loop);

function loop() {
  d3.transition().duration(10000).ease(ease).each(function() {
    gear.transition().attrTween("transform", function(d) { return tweenRotate(360 * 32 * 3 / d.teeth * (d.radius < 0 ? -1 : +1)); });
  }).transition().duration(500).each("end", loop);
}

function tweenRotate(angle) {
  var i = d3.interpolateNumber(0, angle);
  return function(t) { return "rotate(" + i(t) + ")"; };
}

function pathGear(d) {
  var n = d.teeth,
      r2 = Math.abs(d.radius),
      r0 = r2 - 8,
      r1 = r2 + 8,
      r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 20) : 20,
      da = Math.PI / n,
      a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0),
      i = -1,
      path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
  while (++i < n) path.push(
      "A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0),
      "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0),
      "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
      "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0),
      "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0),
      "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));
  path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
  return path.join("");
}

// Like in-out reflection, except around the specified center.
// If center = .5, this is the same as in-out reflection.
function easeReflect(ease, center) {
  return function(t) {
    return t < center ? center * ease(t / center) : 1 - ease((1 - t) / (1 - center)) * (1 - center);
  };
}

// Constant acceleration followed by constant speed.
// If acceleration = 1, this is the same as quadratic easing.
// If acceleration = Infinity, this is the same as linear easing.
function easeAccelerateThenCoast(acceleration) {
  if (acceleration < 1) throw new Error("unpossible");
  if (!isFinite(acceleration)) return d3.ease("linear");
  var speed = 2 * (acceleration - Math.sqrt((acceleration - 1) * acceleration)),
      t0 = speed / 2 / acceleration;
  return function(t) {
    return t < t0 ? acceleration * t * t : speed * t - speed + 1;
  };
}