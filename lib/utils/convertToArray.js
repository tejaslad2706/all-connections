module.exports.convertToArray = function(item){
    Array.isArray(item) ? item : [item];
    return item;
}