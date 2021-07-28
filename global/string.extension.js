String.prototype.formatText = function() {
    let string = this.trim();
    string = string.replace(/<\/?strong>/g, '**').replace(/<p>/g, '\n').replace(/<\/p>/g, '');
    return string;
}

String.prototype.cleanWhiteSpace = function() {
    let string = this.trim();
    string = string.replace(/\s{2,}/g, '').replace(/\*/g, '');
    return string;
}

String.prototype.upperCaseFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}