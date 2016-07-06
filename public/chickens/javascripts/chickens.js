
var waTable; // 引用创建出来的表的全局变量
var buffer = {}; // 存储所有从服务器获取的小鸡的数据

function createTable() {
    //Second example that shows all options.
    waTable = $('#example2').WATable(tableParameter()).data('WATable');//This step reaches into the html data property to get the actual WATable object. Important if you want a reference to it as we want here.

    //Generate some data
//        var data = generateSampleData(500);
//        waTable.setData(data);  //Sets the data.
    //waTable.setData(data, true); //Sets the data but prevents any previously set columns from being overwritten
    //waTable.setData(data, false, false); //Sets the data and prevents any previously checked rows from being reset

    //Get the data
//            var allRows = waTable.getData(false); //Returns the data you previously set.
//            var checkedRows = waTable.getData(true); //Returns only the checked rows.
//            var filteredRows = waTable.getData(false, true); //Returns only the filtered rows.
//            var renderedRows = waTable.getData(false, false, true) //Returns only the rendered rows.

    //Set options on the fly
    var pageSize = waTable.option("pageSize"); //Get option
    //waTable.option("pageSize", pageSize); //Set option

    //Databinding example
//            var row = waTable.getRow(5).row; //Get row with unique value of 5.
//            row.name = "Data-Binding Works"; //This would update the table...but only in ultra modern browsers. (See here http://caniuse.com/#search=observe)
//            Platform.performMicrotaskCheckpoint(); //This make sure it also works in browsers not yet compatible with Object.observe. This is the polyfill that's used.(https://github.com/polymer/observe-js).

//            //More databinding
//            data.rows.shift(); //Removes the first row.
//            var newRow = generateSampleData(1).rows[0];
//            data.rows.push(newRow); //Add new row
//            Platform.performMicrotaskCheckpoint();

    //Example event handler triggered by the custom refresh link above.
//            $('#example2').on('click', '.refresh', function(e) {
////                e.preventDefault();
////                //Get and set some new data
////                var data = generateSampleData(100);
////                waTable.setData(data, true);
//            });
    //Example event handler triggered by the custom export links above.
    /*$('#example2').on('click', '.export', function(e) {
     e.preventDefault();
     var elem = $(e.target);
     var data;
     if (elem.hasClass('all')) data = waTable.getData(false);
     else if (elem.hasClass('checked')) data = waTable.getData(true);
     else if (elem.hasClass('filtered')) data = waTable.getData(false, true);
     else if (elem.hasClass('rendered')) data = waTable.getData(false, false, true);
     console.log(data.rows.length + ' rows returned', data);
     alert(data.rows.length + ' rows returned.\nSee data in console.');
     });*/
}

function tableParameter() {
    return {
        //data: generateSampleData(100), //Initiate with data if you already have it
        debug:false,                //Prints some debug info to console
        dataBind: true,             //Auto-updates table when changing data row values. See example below. (Note. You need a column with the 'unique' property)
        pageSize: 10,                //Initial pagesize
        pageSizePadding: true,      //Pads with empty rows when pagesize is not met
        //transition: 'slide',       //Type of transition when paging (bounce, fade, flip, rotate, scroll, slide).Requires https://github.com/daneden/animate.css.
        //transitionDuration: 0.2,    //Duration of transition in seconds.
        filter: true,               //Show filter fields
        sorting: true,              //Enable sorting
        sortEmptyLast:true,         //Empty values will be shown last
        //columnPicker: true,         //Show the columnPicker button
        pageSizes: [10,50],  //Set custom pageSizes. Leave empty array to hide button.
        hidePagerOnEmpty: true,     //Removes the pager if data is empty.
        checkboxes: false,           //Make rows checkable. (Note. You need a column with the 'unique' property)
        checkAllToggle:false,        //Show the check-all toggle
        preFill: true,              //Initially fills the table with empty rows (as many as the pagesize).
        //url: '/someWebservice'    //Url to a webservice if not setting data manually as we do in this example
        //urlData: { report:1 }     //Any data you need to pass to the webservice
        //urlPost: true             //Use POST httpmethod to webservice. Default is GET.
        types: {                    //If you want, you can supply some properties that will be applied for specific data types.
            string: {
                //filterTooltip: "Giggedi..."    //What to say in tooltip when hoovering filter fields. Set false to remove.
                //placeHolder: "Type here..."    //What to say in placeholder filter fields. Set false for empty.
            },
            number: {
                decimals: 1   //Sets decimal precision for float types
            },
            bool: {
                //filterTooltip: false
            },
            date: {
                utc: true,            //Show time as universal time, ie without timezones.
                format: 'MM-dd HH:mm:ss',   //The format. See all possible formats here http://arshaw.com/xdate/#Formatting.
                datePicker: true      //Requires "Datepicker for Bootstrap" plugin (http://www.eyecon.ro/bootstrap-datepicker).
            }
        },
        //actions: {                //This generates a button where you can add elements.
        //    filter: true,         //If true, the filter fields can be toggled visible and hidden.
        //    columnPicker: true,   //if true, the columnPicker can be toggled visible and hidden.
        //    custom: [             //Add any other elements here. Here is a refresh and export example.
        //        $('<a href="#" class="refresh"><span class="glyphicon glyphicon-refresh"></span>&nbsp;Refresh</a>'),
        //        $('<a href="#" class="export all"><span class="glyphicon glyphicon-share"></span>&nbsp;Export all rows</a>'),
        //        $('<a href="#" class="export checked"><span class="glyphicon glyphicon-share"></span>&nbsp;Export checked rows</a>'),
        //        $('<a href="#" class="export filtered"><span class="glyphicon glyphicon-share"></span>&nbsp;Export filtered rows</a>'),
        //        $('<a href="#" class="export rendered"><span class="glyphicon glyphicon-share"></span>&nbsp;Export rendered rows</a>')
        //    ]
        //},
        tableCreated: function(data) {    //Fires when the table is created / recreated. Use it if you want to manipulate the table in any way.
            console.log('table created'); //data.table holds the html table element.
            console.log(data);            //'this' keyword also holds the html table element.
        },
        rowClicked: function(data) {      //Fires when a row or anything within is clicked (Note. You need a column with the 'unique' property).
            console.log('row clicked');   //data.event holds the original jQuery event.
                                          //data.row holds the underlying row you supplied.
                                          //data.index holds the index of row in rows array (Useful when you want to remove the row)
                                          //data.column holds the underlying column you supplied.
                                          //data.checked is true if row is checked. (Set to false/true to have it unchecked/checked)
                                          //'this' keyword holds the clicked element.


            //Removes the row if user clicked on the column called 'remove'.
            /*if (data.column.column == "remove") {
             data.event.preventDefault();
             //Remove fast with dataBind option
             waTable.getData().rows.splice(data.index, 1);
             Platform.performMicrotaskCheckpoint();

             //This would have worked fine as well, but is slower
             //var d = waTable.getData();
             //d.rows.splice(data.index, 1);
             //waTable.setData(d);
             }
             //We can look at classes on the clicked element as well
             if (this.classList.contains('someClass')) {
             //Do something...
             }
             //Example toggle checked state
             if (data.column.column == "check") {
             data.checked = !data.checked;
             }*/
            console.log(data);
        },
        columnClicked: function(data) {    //Fires when a column is clicked
            console.log('column clicked');  //data.event holds the original jQuery event
            console.log(data);              //data.column holds the underlying column you supplied
                                            //data.descending is true when sorted descending (duh)
        },
        pageChanged: function(data) {      //Fires when manually changing page
            console.log('page changed');    //data.event holds the original jQuery event
            console.log(data);              //data.page holds the new page index
        },
        pageSizeChanged: function(data) {  //Fires when manually changing pagesize
            console.log('pagesize changed');//data.event holds teh original event
            console.log(data);              //data.pageSize holds the new pagesize
        }
    }
}

function renderTable(chickens) {
    // header row data
    var cols = {
        did: {
            index: 1, //The order this column should appear in the table
            type: "string", //The type. Possible are string, number, bool, date(in milliseconds).
            friendly: "设备",  //Name that will be used in header. Can also be any html as shown here.
            format: "<a href=http://www.jumacc.com/chicken?did={0} target='_parent'>{0}</a>",  //Used to format the data anything you want. Use {0} as placeholder for the actual data.
            unique: true,  //This is required if you want checkable rows, databinding or to use the rowClicked callback. Be certain the values are really unique or weird things will happen.
            sortOrder: "asc", //Data will initially be sorted by this column. Possible are "asc" or "desc"
            tooltip: "This column has an initial filter", //Show some additional info about column
            placeHolder: "000001" //Set initial filter.
        },
        steps: {
            index: 2,
            type: "number",
            friendly: "步数",
            //cls: "blue, anotherClass", //apply some css classes
            tooltip: "运动步数", //Show some additional info about column
            filter: "0..65535" //Overrides default placeholder and placeholder specified in data types(row 34).
        },
        volt: {
            index: 3,
            type: "number",
            friendly: "电压",
            sorting: true, //dont allow sorting
            tooltip: "off", //Show some additional info about column
            filter: false //Removes filter field for this column
        },
        time: {
            index: 4,
            type: "date",
            friendly: "时间",
            sorting: true, //dont allow sorting
            tooltip: "time", //Show some additional info about column
            filter: false //Removes filter field for this column
        },
    };

    /*
     Create the rows (This step is of course normally done by your web server).
     What's worth mentioning is the special row properties. See some examples below.
     <column>Format allows you to override column format and have it formatted the way you want.
     <column>Cls allows you to add css classes on the cell(td) element.
     row-checkable allows you to prevent rows from being checkable.
     row-checked allows you to pre-check a row.
     row-cls allows you to add css classes to the row(tr) element.
     */


    var timezoneOffset = -(new Date()).getTimezoneOffset(); // 返回是分钟
    timezoneOffset = timezoneOffset * 60 * 1000; // 转换为毫秒

    var rows = [];
    for (var i = 0; i < chickens.length; i++) {
        var row = {};
        row.did = chickens[i].did;
        row.steps = chickens[i].steps;
        row.volt = chickens[i].volt;
        row.time = Date.parse(chickens[i].time) + timezoneOffset;
        rows.push(row);
    }

    //Create the returning object. Besides cols and rows, you can also pass any other object you would need later on.
    var data = {
        cols: cols,
        rows: rows,
        otherStuff: {
            thatIMight: 1,
            needLater: true
        }
    };

    waTable.setData(data);
    //setDateTimePicker(); // 必须在时间输入框创建完成之后再设置 picker, 当前选择的时机过早
}

function setDateTimePicker() {
    // id = date_date_picker 的元素是写死在 jquery.watable.js 中的
    $('#date_date_picker').appendDtpicker({
//            "current": shownDate,
        "locale": "cn",
        "firstDayOfWeek": 1, // 把周一作为一周的第一天
        "closeOnSelected": true,
        "onHide": function(handler) {
            // to do
        }
    });
}


////////////// net
//function getData(url, handler) {
//    var request = new XMLHttpRequest();
//    request.onreadystatechange = handler;
//    request.open("GET", url, true);
//    request.send(null);
//}

function getChickensDataFromServer(date) {
    var url = "http://www.jumacc.com:3000/chickens_at_hour"
        + "?year=" + date.getFullYear()
        + "&month=" + date.getMonth()
        + "&day=" + date.getDate()
        + "&hour=" + date.getHours();

    //alert("chickens url = " + url);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var chickens = eval ("(" + this.responseText + ")");
                renderTable(chickens);
                buffer[date] = chickens;
            } else  {
                alert("readystate = " + this.readyState + ", status = " + this.status);
            }
        }
    };
    request.open("GET", url, true);
    request.send(null);
}

function getChickensData(date) {
    var chickens = buffer[date];
    //alert("get chickens at " + typeof date + " " + date);

    if (chickens && chickens.length > 0) {
        //alert("从 buffer 获取到 " + chickens.length + " 个数据");
        renderTable(chickens)
    } else {
        getChickensDataFromServer(date);
    }
}
