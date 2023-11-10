module.exports = {
    sum: function(a,b) {
        return a+b
    },
    multiply: function(a,b) {
        return a*b
    },
    isEmailValid: function (email) {
        const at = email.indexOf('@');
        const dot = email.lastIndexOf('.');
        const space = email.indexOf(' ');
    
        return ( (at !== -1) && 
        (at !== 0) && 
        (dot !== 0) && 
        (dot !== -1) && 
        (dot > at + 1) && 
        (email.length > dot + 1) && 
        (space === -1) );
    },
    isPhoneValid (str) {
        if((str.indexOf(")") - str.indexOf("(") > 4) || (str.indexOf("(") === -1 && str.indexOf(")") > -1) || (str[0] === "-") || (str[2] === " ")){
            return false;
        }
        let reducedPhoneN = str.replace(/-| /g, "");
    
        if(reducedPhoneN.indexOf("(")!== -1 && reducedPhoneN.indexOf(")") !== -1){
            reducedPhoneN = reducedPhoneN.replace(/\(|\)/g, "");
        }
        if(reducedPhoneN.length === 10 && Number(reducedPhoneN)){
            return true;
        }
        else if(reducedPhoneN.length === 11 && reducedPhoneN[0] === "1"){
            return true;
        }
    
      return false;
    }
};