function validate(item, predicate) {
    if(typeof item === "string") return validateString(item, predicate);
    if(typeof item === "number") return validateNumber(item, predicate);
    
    return predicate(item);
}

function validateString(item, predicate) {
    if(typeof predicate === "string") item.includes(predicate);
    else if(predicate instanceof RegExp) return predicate.test(item);
    else if(typeof predicate === "number") return item.length >= predicate;
    else if(Array.isArray(predicate)) return predicate.includes(item);
    else if(predicate.min !== undefined && predicate.max !== undefined) return item.length >= predicate.min && item.length <= predicate.max;

    return predicate(item);
}
function validateNumber(item, predicate) {
    if(typeof predicate === "number") return item === predicate;
    else if(predicate.min !== undefined && predicate.max !== undefined) return item >= predicate.min && item <= predicate.max;

    return predicate(item);
}

if(typeof module !== "undefined") module.exports = {validate, validateString, validateNumber};