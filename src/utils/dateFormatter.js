export function dateFormatter(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes;
}
