function StandartDT({
    idtabla = '',
    lenguage = {
        "decimal": "",
        "emptyTable": "No hay información",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Mostrar _MENU_ Entradas",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Buscar:",
        "zeroRecords": "Sin resultados encontrados",
        "paginate": {
            "first": "Primero",
            "last": "Ultimo",
            "next": "Siguiente",
            "previous": "Anterior"
        }
    },
    columnDefs = [],
    columns = [],
    responsive = false,
    order = [[1, "asc"]],
    lengthMenu = [5, 10],
    autoWidth = false,
    destroy = true,
    dom = 'Bfrtipl',
    buttons = [
        { extend: 'excel', className: 'btn btn-sm rounded-0 btn-info', filename: 'export excel' },
        { extend: 'print', className: 'btn btn-sm rounded-0 btn-success', filename: 'print' }
    ],
    table = null,
    data = [],
    hideColumns = [],
    currencyColumns = [],
    maxShow = 500,
    scrollX = false,
    optionsColumn = false,
}) {
    this.idtabla = idtabla;
    this.lenguage = lenguage;
    this.columnDefs = columnDefs;
    this.columns = columns;
    this.responsive = responsive;
    this.order = order;
    this.lengthMenu = lengthMenu;
    this.autoWidth = autoWidth;
    this.destroy = destroy;
    this.dom = dom;
    this.buttons = buttons;
    this.table = table;
    this.data = data;
    this.hideColumns = hideColumns;
    this.currencyColumns = currencyColumns;
    this.maxShow = maxShow;
    this.scrollX = scrollX;
    this.optionsColumn = optionsColumn;

    this.colNames = [];
    this.ColumnIndexToHide = [];
    this.ColumnIndexToCurrency = [];

    this.createOptions = function () {
        this.colNames = Object.keys(this.data[0])

        return new Promise((resolve, reject) => {
            if (this.optionsColumn) {
                this.colNames.push("Opciones")

                console.log(this.colNames)
            }
            resolve();
        }).then(res => {
            this.data.forEach(function (element) {
                element.Opciones = [optionsColumn][0];
            })
        });
    }

    this.createColumsOfArray = function () {
       

        return new Promise((resolve, reject) => {

  
            
            
            for (let columna in this.colNames) {
                this.columns.push({ data: this.colNames[columna], title: this.colNames[columna] })

                if (this.hideColumns.indexOf(this.colNames[columna]) >= 0)
                    this.ColumnIndexToHide.push(this.colNames.indexOf(this.colNames[columna]))


                if (this.currencyColumns.indexOf(this.colNames[columna]) >= 0)
                    this.ColumnIndexToCurrency.push(this.colNames.indexOf(this.colNames[columna]))

            }


            resolve(true);
            reject(false);
        }).then(res => {

            this.columnDefs.push({ targets: this.ColumnIndexToHide, visible: false })
            this.columnDefs.push({
                targets: this.ColumnIndexToCurrency,
                className: "text-right",
                render: function (data, type, row, meta) {
                    return Intl.NumberFormat("en-US").format(data)
                }
            })

        })

    }

    this.createTable = function () {
        return new Promise((resolve, reject) => {
            this.table = $(this.idtabla).DataTable({
                columnDefs: this.columnDefs,
                columns: this.columns,
                responsive: this.responsive,
                order: this.order,
                lengthMenu: this.lengthMenu,
                language: this.lenguage,
                autoWidth: this.autoWidth,
                destroy: this.destroy,
                dom: this.dom,
                buttons: this.buttons,
                scrollX: this.scrollX,
            });

            $(this.idtabla + ' tbody').addClass('rounded-0 ');
            $(this.idtabla + '_filter label input').addClass('rounded-0 ');
            $(this.idtabla + '_length label select').addClass('rounded-0 ');
            $(this.idtabla + '_paginate').addClass('rounded-0 pagination-sm');


            resolve(true);
            reject(false);
        });
    }

    this.fillTable = function () {
        return new Promise((resolve, reject) => {

            if (this.data.length > 0)
                this.table.rows.add(this.data).draw();




            resolve(true);
            reject(false);
        })
    }

    this.start = function ({ finalFunc }) {
        if (this.data.length > 0)
            this.createOptions().then(res => {
                this.createColumsOfArray().then(res => {
                    this.createTable().then(res => {
                        this.fillTable().then(res => {
                            console.log('termino');
                            this.table.columns.adjust().draw();
                            finalFunc();
                        });
                    });
                });
            });
        else
            $(this.idtabla + '_msg').append("<div class='alert alert-info' role='alert'>No hay datos para renderizar la tabla</div>");
    }

    this.clear = function () {
        if (this.table != null)
            this.table.clear().draw();
    }
};