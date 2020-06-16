
// get the date of today
export function getCurrentDate(){
    let newDate = new Date()
    return newDate
}

export function getMonth(date){
    let monthNumber = (date.getMonth()+1);
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return(monthNames[monthNumber])
}


export function getDay(date){
    let dateNumber = date.getDay();
    let dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return (dayNames[dateNumber]);
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