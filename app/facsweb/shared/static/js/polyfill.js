/* support JS code for browser cross-compatibility */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(item) {
        var i = this.length;
        while (i--)
           if (this[i] === item) return i;
        return -1;
    }
}


/* JavaScript has no intrinsic way to determine numeric */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/* Powers et al. */
var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹",
    formatPower = function(d) { 
        var tmp='';
        if (d<0){tmp+='⁻';}
        return tmp+(Math.abs(d) + "").split("").map(function(c) { return superscript[c]; }).join(""); };
