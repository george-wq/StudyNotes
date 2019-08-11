var _ = {};

_.isNaN = function(obj) {
    return typeof obj === 'number' && isNaN(obj);
};

_.excludeNaN = function(array) {
    var result = [], i = 0, length = array.length;
    for (;i<length;i++) {
        if (!_.isNaN(array[i]))  result.push(array[i]);
    }
    return result;
}