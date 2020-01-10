$(document).ready(function() {

    // Inicializamos Extensions API
    tableau.extensions.initializeAsync().then(function() {

      //Ask tableau for the dashboard
      const parameter_name = 'P_Region'
      const filter_name = 'Región'
      const ws_name = "Ventas por producto"

      const dashboard = tableau.extensions.dashboardContent.dashboard
      var worksheet = dashboard.worksheets.find(function (sheet) {
        return sheet.name === ws_name;
      });
      
      dashboard.findParameterAsync(parameter_name).then(parameter => {
        console.log("parameters loaded");
        
        let p_list = parameter.allowableValues.allowableValues
        let p_values = []
        for (let p of p_list) {
            p_values.push(p.value);
        }

        current = parameter.currentValue.value
        filter_index = p_values.indexOf(current)
        
        $('#resultBox').text("")
        //$('#resultBox').text(current)

        return {'list': p_values, '_index': filter_index}
      }).then(driver => {
        $('#resultBox').text(driver.list[driver._index])

        setInterval( () => {
          driver._index += 1 //next index
          driver._index = driver._index % driver.list.length //cyclical index

          let value = []
          value.push(driver.list[driver._index])
          //$('#resultBox').text(String(value))

          worksheet.applyFilterAsync(filter_name, value, 'replace').catch(console.log);


        }, 10000);

      });

  });
});