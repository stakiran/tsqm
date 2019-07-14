var DATETIME = DATETIME || {};
DATETIME.________________start________________ = function(){}

DATETIME.init = function(){
    moment.locale('ja');
}

// @param datestr A string with YYYY-MM-DD format.
DATETIME.datestr_to_dtobj = function(datestr){
    var dtobj = new DATETIME.Datetime();
    dtobj.from_string(datestr);
    return dtobj;
}

DATETIME.todaystr = function(){
    var dtobj = new DATETIME.Datetime();
    return dtobj.to_string();
}

DATETIME.is_invalid_datestr = function(datestr){
    if(datestr.length != "yyyy-mm-dd".length){
        return true;
    }
    if(datestr.split('-').length != 3){
        return true;
    }

    var is_valid = moment(datestr).isValid();
    return !is_valid;
}

DATETIME.is_a_before_b = function(datestr_a, datestr_b){
    return moment(datestr_a).isBefore(datestr_b);
}

DATETIME.Datetime = (function(){
    var Datetime = function(){
        this._moment = moment();
        this._format = 'YYYY-MM-DD'
        return this;
    }

    var p = Datetime.prototype;

    p.walk = function(v, mode){
        if(v === 0){
            return;
        }
        this._moment.add(v, mode);
        return this;
    }

    p.walk_with_day = function(v){
        return this.walk(v, 'days');
    }

    p.walk_with_week = function(v){
        return this.walk(v, 'weeks');
    }

    p.walk_with_month = function(v){
        return this.walk(v, 'months');
    }

    p.to_string = function(){
        var obj = this._moment;
        var fmt = this._format;
        return obj.format(fmt);
    }

    // @param datestr A string with YYYY-MM-DD format.
    p.from_string = function(datestr){
        this._moment = moment(datestr, this._format)
        return this;
    }

    return Datetime;
})();
