
// get the name of the month to parse in the planning
export function getMonthName(date){
    let monthNumber = (date.getMonth()+1);
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return(monthNames[monthNumber])
}

// get the name of the day
export function getDayName(date){
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

