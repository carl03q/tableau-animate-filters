$(document).ready(function() {

    // Inicializamos Extensions API
    tableau.extensions.initializeAsync().then(function() {

      //  Preguntamos a tableau por las hojas de trabajo.
      const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

      // Buscamos una hoja por nombre.
      var worksheet = worksheets.find(function (sheet) {
        return sheet.name === "HR Performance";
      });

      // Or iterate through the array of worksheets
      worksheets.forEach(function (worksheet) {
        //  process each worksheet...
        console.log(worksheet.name);
      });
    
    // Agregamos evento de selección. Para cuando seleccionemos data desde Tableau lograr una
    // interacción.
    let markSelectionHandler = selectionEvent =>{
        worksheet.getUnderlyingDataAsync().then(dataTable =>{
            // Obtenemos el valor Employee Number
            let field = dataTable.columns.find(column => column.fieldName === 'Employee Number');
            let list = [];
            for (let row of dataTable.data) {
                list.push(row[field.index].value);
            }
            // Vaciamos la lista del html y la cargamos con imágenes que tengan el
            // nombre asociado al número de empleado.
            $('#imageList').empty()
            for(let emp of list){
              let image = './assets/'+emp+'.png'
              let name = emp
              $('#imageList').append('<li class="list-group-item link-class"><img src="'+image+'" height="200" width="200" class="img-thumbnail" /> '+name+'</span></li>');
            }
    
        });
    };

    // Agregamos el evento al listener de la extensión.
    let unregisterHandlerFunction = worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, markSelectionHandler);
    
    
  });
});