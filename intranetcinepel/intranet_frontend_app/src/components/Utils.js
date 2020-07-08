import {getDatas} from './Table';

// get the name of the month to parse in the planning
export function getMonthName(date){
    let monthNumber = (date.getMonth());
    let monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
    return(monthNames[monthNumber])
}

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

export function getDayDate(dateToDay){
  var date = new Date(dateToDay);
  return date;
}

export function getHour(dateToHour){
  var date = new Date(dateToHour);
  return date.getHours() + ':' +  (date.getMinutes()<10?'0':'') + date.getMinutes()
}

export function onlyUniqueDate(needle, haystack) {
  for (var i = 0; i < haystack.length; i++) {
    if (needle.getDay() === haystack[i].getDay()) {
      return true;
    }
  }
  return false;
}

export function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

export function getRowsDataTemplate(state){
    var items = state;
    return items.map((row, index)=>{
      return row
    })
  }

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

const getKeys = (state) =>{
    return Object.keys(state[0]);
}

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