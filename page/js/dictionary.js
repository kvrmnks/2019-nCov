var Dictionary=function() {
    this.elements = new Array();
    //Length of Dictionary
    this.length = function () {
        return this.elements.length;
    };
    //Check whether the Dictionary is empty
    this.isEmpty = function () {
        return (this.length() < 1);
    };
    //remove all elements from the Dictionary
    this.removeAll = function () {
        this.elements = new Array();
    };
    //get specify element of the dictionary
    this.element = function (index) {
        var rlt = null;
        if (index >= 0 && index < this.elements.length) {
            rlt = this.elements[index];
        }
        return rlt;
    }
    //check whether the Dictionary contains this key
    this.Exists = function (key) {
        var rlt = false;
        try {
            for (var i = 0, iLen = this.length(); i < iLen; i++) {
                if (this.elements[i].key == key) {
                    rlt = true;
                    break;
                }
            }
        }
        catch (ex) {
        }
        return rlt;
    };
    //check whether the Dictionary contains this value
    this.containsValue = function (value) {
        var rlt = false;
        try {
            for (var i = 0, iLen = this.length(); i < iLen; i++) {
                if (this.elements[i].value == value) {
                    rlt = true;
                    break;
                }
            }
        }
        catch (ex) {
        }
        return rlt;
    };
    //remove this key from the Dictionary
    this.remove = function (key) {
        var rlt = false;
        try {
            for (var i = 0, iLen = this.length(); i < iLen; i++) {
                if (this.elements[i].key == key) {
                    this.elements.splice(i, 1);
                    rlt = true;
                    break;
                }
            }
        }
        catch (ex) {
        }
        return rlt;
    };
    //add this key/value to the Dictionary,if key is exists,replace the value
    this.add = function (key, value) {
        this.remove(key);
        this.elements.push({
            key: key,
            value: value
        });
    };
    //add this key/value to the Dictionary,if key is exists,append value
    this.set = function (key, value) {
        var arr = this.getItem(key);
        if (arr != null) {
            if (typeof(arr) == "object") {
                arr.unshift.apply(arr, value);
                value = arr;
            }
            else {
                var array = [];
                array.push(arr);
                array.unshift.apply(array, value);
                value = array;
            }
            this.remove(key);
        }
        this.elements.push({
            key: key,
            value: value
        });
    }
    //get value of the key
    this.getItem = function (key) {
        var rlt = null;
        try {
            for (var i = 0, iLen = this.length(); i < iLen; i++) {
                if (this.elements[i].key == key) {
                    rlt = this.elements[i].value;
                    break;
                }
            }
        }
        catch (ex) {
        }
        return rlt;
    };
    //get all keys of the dictionary
    this.keys = function () {
        var arr = [];
        for (var i = 0, iLen = this.length(); i < iLen; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    }
    //get all values of the dictionary
    this.values = function () {
        var arr = [];
        for (var i = 0, iLen = this.length(); i < iLen; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    }
}