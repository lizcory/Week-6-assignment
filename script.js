const margins = {t: 50, r:50, b: 50, l: 50};
const size = {w: 1200, h: 600};
const svg = d3.select('svg');

svg.attr('width', size.w)
    .attr('height', size.h);

const containerG = svg.append('g').classed('container', true);

d3.csv('data/airbnb.csv')
    .then(function(data) {
        console.log(data);

        // data.forEach(d => { d.value = 5 + Math.random()*10; });


        let colorScale = d3.scaleOrdinal(d3.schemeTableau10);

        var priceExtent = {
            max: d3.max(data, function(d){ return +d.price; }),
            min: d3.min(data, function(d){ return +d.price; })
        };
        console.log(priceExtent);

        let priceScale = d3.scaleLinear()
            .domain([0, priceExtent.max])
            .range([margins.l*2, size.w-margins.r*2]);

        // let scaleX = d3.scaleBand()
            //   .domain([...Array(11).keys()])
            //   .range([margins.l, size.w-margins.r]);

        // let priceScale = d3.scaleBand()
            // .domain([0, 100, 200, 300,
                // 400, 500, 600, 700, 
                // 800, 900, 1000, 1100,
                // 1200, 1300, 1400, 1500])
            // .range([margins.l, size.w]);

            
        svg.append("g").classed("x_axis", true)
            .attr("transform", `translate(${margins.l}, ${size.h - margins.b*2})`)
            .call(d3.axisBottom(priceScale).tickFormat(d3.format("$,")));

        svg.append("text")
            .attr("class", "x_label")
            .attr("transform", `translate(${size.w/2 + margins.l}, ${size.h-margins.b})`)
            .style("text-anchor", "middle")
            .text("Airbnb prices");
    
    
        let simulation = d3.forceSimulation(data)
            .force('collide', d3.forceCollide(3))
            // .force('charge', d3.forceManyBody().strength(.1))
            .force('x', d3.forceX().x(d => priceScale(d.price)).strength(12))
            .force('y', d3.forceY().y(size.h/2).strength(0.05));

        
        let node = svg.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('r', 3)
            .attr('fill', d => colorScale(d.room_type));
    
        simulation.on('tick', () => {
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);
        });


});