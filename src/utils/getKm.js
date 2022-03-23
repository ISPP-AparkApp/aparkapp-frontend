function rad(x) { return x * Math.PI / 180; }

export function getKm(lat1, lng1, lat2, lng2) {
    var R = 6378.137; //earth radius
    var dLat = rad(lat2 - lat1);
    var dLng = rad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d.toFixed(3);
}