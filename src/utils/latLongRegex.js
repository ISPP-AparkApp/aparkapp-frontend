export function regexLatitudeLongitude(location){
    var regexLatitudeLongitude = /^([-+]?)([\d]{1,2})(((.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((.)(\d+))?)$/g;
    return regexLatitudeLongitude.test(location);
}