var all_data = {};
var year_data = [];

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
}).then(
    function(d) {


        for (const [year, data] of Object.entries(all_data)) { 
            all_data[year].sort(function(a, b) {
                const keyA = a.month;
                const keyB = b.month;
                // Compare the 2 dates
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            }); 
        } 
        

        for (const [year, data] of Object.entries(all_data)) {
            max_water_level = 0
            var total_rain = 0
            data.forEach(function (d, index) {
                if (d.water_level < max_water_level) {
                    max_water_level = d.water_level
                }
                total_rain += d.rain_level
                
              });
            year_data.push({
                year: year,
                water_level: max_water_level,
                rain_level: total_rain
            })
          }
        }
    
   
)

