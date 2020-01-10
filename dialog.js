'use strict';
 
(function () {
 
    $(document).ready(function () {
        // Al inicializar el la ventanda de dialog llamamos la función buildDialog
        tableau.extensions.initializeDialogAsync().then(function (openPayload) {
            buildDialog();
        });
    });
 
    // Obtenemos datos del libro de tableau para armar un menú de configuraciones.
    function buildDialog() {
        let dashboard = tableau.extensions.dashboardContent.dashboard;

        // Por cada libro de trabajo agregamos un valor de opción al objeto select.
        dashboard.worksheets.forEach(function (worksheet) {
            $("#selectWorksheet").append("<option value='" + worksheet.name + "'>" + worksheet.name + "</option>");
        });
        // Obtenemos la opción configurada en caso de haber alguna almacenada.
        var worksheetName = tableau.extensions.settings.get("worksheet");
        if (worksheetName != undefined) {
            $("#selectWorksheet").val(worksheetName);
            columnsUpdate();
        }
 
        // Agregamos evento para cambio de opción.
        $('#selectWorksheet').on('change', '', function (e) {
            columnsUpdate();
        });

        
        $("#parameterName").text("");
        dashboard.getParametersAsync().then(parameters => {
            parameters.forEach(function (parameter) {
                $("#parameterName").append("<option value='" + parameter.name + "'>"+parameter.name+"</option>");
            });
            $("#parameterName").val(tableau.extensions.settings.get("parameterName"));            
        });

        
        var val = tableau.extensions.settings.get("timeInterval")
        console.log(val)
        if (val != undefined){
            $("#timeInterval").val(val);    
        }
        

        $('#cancel').click(closeDialog);
        $('#save').click(saveButton);
        //$('.select').select2();
    }
 
    // Esta función actualiza las opciones del libro de acuerdo a la opción elegida.
    function columnsUpdate() {
 
        var worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        var worksheetName = $("#selectWorksheet").val();
 
        // Se valida que efectivamente el libro exista.
        var worksheet = worksheets.find(function (sheet) {
            return sheet.name === worksheetName;
        });  
        console.log(worksheet)
        console.log(worksheetName)    
 
        worksheet.getSummaryDataAsync({ maxRows: 1 }).then(function (sumdata) {
            // Con el worksheet identificado preguntamos a Tableau cuales son los valores

            var worksheetColumns = sumdata.columns;
            $("#filterName").text("");
            
            // Llenamos la lista de opciones con las columnas del libro de trabajo.
            worksheetColumns.forEach(function (current_value) {
                $("#filterName").append("<option value='" + current_value.fieldName + "'>"+current_value.fieldName+"</option>");
            });
            $("#filterName").val(tableau.extensions.settings.get("filterName"));
        });

        
    }
 
 
    function closeDialog() {
        tableau.extensions.ui.closeDialog("10");
    }
 
    // Agregamos los valores configurados a nuestro libro de trabajo. 
    function saveButton() {
        // El formato para agregar configuraciones es nombre del parámetro, valor
        tableau.extensions.settings.set("worksheet", $("#selectWorksheet").val());
        tableau.extensions.settings.set("filterName", $("#filterName").val());
        tableau.extensions.settings.set("parameterName", $("#parameterName").val());
        tableau.extensions.settings.set("timeInterval", $("#timeInterval").val());
 
        tableau.extensions.settings.saveAsync().then((currentSettings) => {
            tableau.extensions.ui.closeDialog("10");
        });
    }
})();