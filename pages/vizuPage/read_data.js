var all_data = {};
var min_water_level = 0
var max_water_level = -1000

d3.csv("data/kineret.csv",

function(d){
    if (!(d.year in all_data)) {
        all_data[d.year] = []
    }

    if (Number(d.Kinneret_Level) < min_water_level) {
        min_water_level = Number(d.Kinneret_Level)
    }

    if (Number(d.Kinneret_Level) > max_water_level) {
        max_water_level = Number(d.Kinneret_Level)
    }
    all_data[d.year].push({
        month: d3.timeParse("%Y-%m-%d")(d.year.toString() + "-" + d.month + "-01"),
        water_level: Number(d.Kinneret_Level),
        rain_level: Number(d.Rain_Amount),
    })
})
