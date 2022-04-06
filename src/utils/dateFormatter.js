export const dateFormatter = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = String(date.getHours());
    if (hour.length < 2) {
        hour = "0" + hour;
    }
    let minutes = String(date.getMinutes());
    if (minutes.length < 2) {
        minutes = "0" + minutes;
    }
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes;
}