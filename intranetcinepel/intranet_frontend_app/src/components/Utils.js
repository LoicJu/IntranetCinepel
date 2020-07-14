import {getDatas} from './Table';

/* -------------------
functions for the dates
------------------- */

// get the name of the month to parse in the planning
export function getMonthName(date){
    let monthNumber = (date.getMonth());
    let monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
    return(monthNames[monthNumber])
}

// compare if 2 days are the same
export function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

// get the name of the day
export function getDayName(date){
    let dateNumber = date.getDay();
    let dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return (dayNames[dateNumber]);
}

// get the name in french of the day
export function getDayNameDate(date){
  let dateNumber = date.getDay();
  let dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  return (dayNames[dateNumber] + ' ' + date.getDate() + ' ' + getMonthName(date));
}
// this function take the numbers of the month and year and return the days in this month
export function getDaysInMonth(month, year){
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

// get the date of a day
export function getDayDate(dateToDay){
  var date = new Date(dateToDay);
  return date;
}

// only get the hour and minute
export function getHour(dateToHour){
  var date = new Date(dateToHour);
  return date.getHours() + ':' +  (date.getMinutes()<10?'0':'') + date.getMinutes()
}

// return only different dates
export function onlyUniqueDate(dayToFind, allDays) {
  for (var i = 0; i < allDays.length; i++) {
    if (dayToFind.getDay() === allDays[i].getDay()) {
      return true;
    }
  }
  return false;
}

/* -------------------
general functions
------------------- */

// return only unique 
export function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

// replace in str
export function replaceAllStr(string, search, replace) {
  return string.split(search).join(replace);
}

/* -------------------
functions for the tables
------------------- */

// get rows for template
export function getRowsDataTemplate(state){
  var items = state;
  return items.map((row, index)=>{
    return row
  })
}

// set Datas
export function setDatas(state){
    let datas = state;
    let datasToSave = getDatas();
    datas.map((row, index)=>{
        Object.entries(row).map(([key1,value1])=>{
        if(typeof value1 === 'object'){
            Object.entries(value1).map(([key2,value2])=>{
            if(key2 in datasToSave[index]){
                datas[index][key1][key2] = datasToSave[index][key2]
            }
            })
        }
        else{
            if(key1 in datasToSave[index]){
            datas[index][key1] = datasToSave[index][key1]
            }
        }
        });
    });
    return datas;
}

// get Header in a good way to react-table
export function getHeader(state){
  var keys = getKeys(state);
  var nestedKeys = getNestedKeys(state);
  return keys.map((key, index)=>{
    let isNested = false;
    let nesting = [];
    for(var obj in nestedKeys){
      if (nestedKeys[obj].key == key){
        isNested = true;
        nesting.push({'Header' : nestedKeys[obj].value  ,  'accessor' : nestedKeys[obj].value },);
      }
    }
    if(isNested){
      return{
        Header: key,
        columns:nesting,
      }
    }
    else{
      return {
        Header: key,
        accessor: key
      };
    }
  })
}

// get the nested key (headers) if multiple ones
const getNestedKeys = (state) =>{
  let nestedKeys = [];
  for (var keyCont in state[0]){
      for (var value in state[0][keyCont]){
      if(state[0][keyCont] instanceof Object){
          nestedKeys.push({
          key : keyCont,
          value : value
          })
      }
      } 
  }
  return nestedKeys;
}

// get keys
const getKeys = (state) =>{
    return Object.keys(state[0]);
}

// get rows
export function getRowsData(state){
    var items = state;
    var datas = [];
    items.map((row, index)=>{
        var rowData = {}
        Object.entries(row).map(([key1,value1])=>{
        if(typeof value1 === 'object'){
            Object.entries(value1).map(([key2,value2])=>{
            rowData[key2] = value2;
            })
        }
        else{
            rowData[key1] = value1;
        }
        });
        datas.push(rowData)
    });
    return datas;
}

// get header to parse pdf
export function getHeaderPdf(state){
  var keys = getKeys(state);
  var nestedKeys = getNestedKeys(state);
  return keys.map((key, index)=>{
    let isNested = false;
    let nesting = [];
    for(var obj in nestedKeys){
      if (nestedKeys[obj].key == key){
        isNested = true;
        nesting.push({Header : nestedKeys[obj].value});
      }
    }
    if(isNested){
      return{
        nesting
      }
    }
    else{
      return {
        Header: key,
      };
    }
  })
}