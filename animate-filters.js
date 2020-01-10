$(document).ready(function() {

    // Inicializamos Extensions API
    tableau.extensions.initializeAsync({ 'configure':configure }).then(function() {

      //Ask tableau for the dashboard
      /*const parameter_name = 'P_Region'
      const filter_name = 'Región'
      const ws_name = "Ventas por producto"*/

      var ws_name = tableau.extensions.settings.get("worksheet");
      var filter_name = tableau.extensions.settings.get("filterName");
      var parameter_name = tableau.extensions.settings.get("parameterName");
      var time_interval = tableau.extensions.settings.get("timeInterval");

      

      const dashboard = tableau.extensions.dashboardContent.dashboard
      var worksheet = dashboard.worksheets.find(function (sheet) {
        return sheet.name === ws_name;
      });
      
      console.log(parameter_name)
      dashboard.findParameterAsync(parameter_name).then(parameter => {
        console.log("parameters loaded");
        
        let p_list = parameter.allowableValues.allowableValues
        let p_values = []
        for (let p of p_list) {
            p_values.push(p.value);
        }

        current = parameter.currentValue.value
        filter_index = p_values.indexOf(current)
        
        $('#resultBox').text(" ")
        //$('#resultBox').text(current)

        return {'list': p_values, '_index': filter_index}
      }).then(driver => {
        //$('#resultBox').text(driver.list[driver._index])

        setInterval( () => {
          driver._index += 1 //next index
          driver._index = driver._index % driver.list.length //cyclical index

          let value = []
          value.push(driver.list[driver._index])
          //$('#resultBox').text(String(value))

          worksheet.applyFilterAsync(filter_name, value, 'replace').catch(console.log);


        }, time_interval * 1000);

      });

  });

  // Esta función se encarga de hacer llamado a una ventana popup con el sitio definido
  // en dialog.html
  function configure() {
    const popupUrl=`${window.location.origin}/tableau-animate-filters/dialog.html`;
    let defaultPayload="";
    tableau.extensions.ui.displayDialogAsync(popupUrl, defaultPayload, { height:350, width:500 }).then((closePayload) => {
      console.log('hi')
    }).catch((error) => {
      switch (error.errorCode) {
        case tableau.ErrorCodes.DialogClosedByUser:
          console.log("Dialog was closed by user");
          break;
        default:
          console.error(error.message);
      }
    });
  }
});