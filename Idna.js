var NormalizationData=require("./NormalizationData").NormalizationData;
var IdnaData=require("./IdnaData").IdnaData;
(function(){

var Encodings={
  "InputToString":function(obj) {
         var ret=[]
         while(true){
     var c=obj.ReadChar();
     if(c<0)break;
     if(c<0x10000){
       ret.push(String.fromCharCode(c))
     } else if(c<0x110000){
                         ret.push(String.fromCharCode(((((c - 0x10000) >> 10) & 0x3ff) + 0xd800)));
       ret.push(String.fromCharCode(((c - 0x10000) & 0x3ff) + 0xdc00));
        } else throw new Error();
   }
   return ret.join("");
    }};

if(typeof StringBuilder=="undefined"){
var StringBuilder=function(){
this.str="";
}
}
StringBuilder.prototype.append=function(ch){
if(typeof ch=="number")
 this.str+=String.fromCharCode(ch);
else
 this.str+=ch
}
StringBuilder.prototype.insert=function(index,ch,o,len){
 if(len==1){
  var c=(typeof ch[o]=="number") ?
  String.fromCharCode(ch[o]) : ch[o]
  this.str=this.str.substr(0,index)+c+this.str.substr(index)
 } else {
   var sb=new StringBuilder();
   for(var i=0;i<len;i++){
     sb.append(ch[o+i])
   }
   this.str=this.str.substr(0,index)+sb.toString()+this.str.substr(index)
 }
}
StringBuilder.prototype.length=function(){
return this.str.length
}
StringBuilder.prototype.charAt=function(index){
// Get the character code, since that's what the caller expects
return this.str.charCodeAt(index)
}
StringBuilder.prototype.toString=function(){
return this.str;
}
if(typeof JSInteropFactory=="undefined"){
var JSInteropFactory={};
}

JSInteropFactory.createStringBuilder=function(param){
 return new StringBuilder();
}

var ByteData = function(array) {
    this.array = array;
};
(function(constructor,prototype){
    prototype.array = null;

    constructor.DecompressLz4 = function(input) {
        var index = 0;
        var copy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var output = [];
        for (var arrfillI = 0; arrfillI < 8 + ((input.length * 3 / 2)|0); arrfillI++)
            output[arrfillI] = 0;
        var outputPos = 0;
         while (index < input.length){
            var b = input[index];
            var literalLength = (b >> 4) & 15;
            var matchLength = b & 15;
            ++index;
            if (literalLength == 15) {
                 while (index < input.length){
                    b = ((input[index])|0) & 255;
                    literalLength = literalLength + (b);
                    ++index;
                    if (b != 255) {
                        break;
                    }
                    if (index >= input.length) {
                         throw new Error("Invalid LZ4");
                    }
                }
            }
            if (index + literalLength - 1 >= input.length) {
                 throw new Error("Invalid LZ4");
            }
            if (literalLength > 0) {
                if (output.length - outputPos < literalLength) {
                    var newSize = (outputPos + literalLength + 1000);
                    var newoutput = [];
                    for (var arrfillI = 0; arrfillI < newSize; arrfillI++)
                        newoutput[arrfillI] = 0;
                    for (var arrfillI = 0; arrfillI < outputPos; arrfillI++)
                        newoutput[arrfillI] = output[arrfillI];
                    output = newoutput;
                }
                for (var arrfillI = 0; arrfillI < literalLength; arrfillI++)
                    output[outputPos + arrfillI] = input[index + arrfillI];
                outputPos = outputPos + (literalLength);
                index = index + (literalLength);
            }
            if (index == input.length) {
                break;
            }
            if (index + 1 >= input.length) {
                 throw new Error("Invalid LZ4");
            }
            var offset = ((input[index])|0) & 255;
            offset |= (input[index + 1] & 255) << 8;
            index = index + (2);
            if (offset == 0) {
                 throw new Error("Invalid LZ4");
            }
            if (matchLength == 15) {
                 while (index < input.length){
                    b = ((input[index])|0) & 255;
                    matchLength = matchLength + (b);
                    ++index;
                    if (b != 255) {
                        break;
                    }
                    if (index >= input.length) {
                         throw new Error("Invalid LZ4");
                    }
                }
            }
            matchLength = matchLength + (4);
            var pos = outputPos - offset;
            if (pos < 0) {
                 throw new Error("Invalid LZ4");
            }
            if (matchLength > offset) {
                 throw new Error("Invalid LZ4");
            }
            if (matchLength > copy.length) {
                copy = [];
                for (var arrfillI = 0; arrfillI < matchLength; arrfillI++)
                    copy[arrfillI] = 0;
            }
            if (pos > outputPos) {
                 throw new Error("pos (" + pos + ") is more than " + output.length);
            }
            if (matchLength < 0) {
                 throw new Error("matchLength (" + matchLength + ") is less than 0");
            }
            if (matchLength > outputPos) {
                 throw new Error("matchLength (" + matchLength + ") is more than " + outputPos);
            }
            if (outputPos - pos < matchLength) {
                 throw new Error("outputPos minus " + pos + " (" + (outputPos - pos) + ") is less than " + matchLength);
            }
            for (var arrfillI = 0; arrfillI < matchLength; arrfillI++)
                copy[arrfillI] = output[pos + arrfillI];
            if (output.length - outputPos < matchLength) {
                var newSize = (outputPos + matchLength + 1000);
                var newoutput = [];
                for (var arrfillI = 0; arrfillI < newSize; arrfillI++)
                    newoutput[arrfillI] = 0;
                for (var arrfillI = 0; arrfillI < outputPos; arrfillI++)
                    newoutput[arrfillI] = output[arrfillI];
                output = newoutput;
            }
            for (var arrfillI = 0; arrfillI < matchLength; arrfillI++)
                output[outputPos + arrfillI] = copy[arrfillI];
            outputPos = outputPos + (matchLength);
        }
        var ret = [];
        for (var arrfillI = 0; arrfillI < outputPos; arrfillI++)
            ret[arrfillI] = 0;
        for (var arrfillI = 0; arrfillI < outputPos; arrfillI++)
            ret[arrfillI] = output[arrfillI];
        return ret;
    };
    constructor.Decompress = function(data) {
        return new ByteData(ByteData.DecompressLz4(data));
    };
    prototype.GetBoolean = function(cp) {
        if (cp < 0) {
             throw new Error("cp (" + cp + ") is less than 0");
        }
        if (cp > 1114111) {
             throw new Error("cp (" + cp + ") is more than " + 1114111);
        }
        var b = this.array[cp >> 13] & 255;
        switch (b) {
            case 254:
                return false;
            case 255:
                return true;
            default:
                {
                    var index = 136 + (b << 10) + ((cp & 8191) >> 3);
                    return (this.array[index] & (1 << (cp & 7))) > 0;
                }}
    };
    prototype.GetByte = function(cp) {
        if (cp < 0) {
             throw new Error("cp (" + cp + ") is less than 0");
        }
        if (cp > 1114111) {
             throw new Error("cp (" + cp + ") is more than " + 1114111);
        }
        var index = (cp >> 9) << 1;
        var x = this.array[index + 1];
        if ((x & 128) != 0) {
            return this.array[index];
        }
        x = (x << 8) | ((this.array[index]) & 255);
        index = 4352 + (x << 9) + (cp & 511);
        return this.array[index];
    };
})(ByteData,ByteData.prototype);
var DomainUtility = function() {};
(function(constructor,prototype){
    constructor.CodePointAt = function(str, index, endIndex) {
        if (str == null) {
             throw new Error("str");
        }
        if (index >= endIndex) {
            return -1;
        }
        if (index < 0) {
            return -1;
        }
        var c = str.charCodeAt(index);
        if ((c & 64512) == 55296 && index + 1 < endIndex && str.charCodeAt(index + 1) >= 56320 && str.charCodeAt(index + 1) <= 57343) {
            c = 65536 + ((c - 55296) << 10) + (str.charCodeAt(index + 1) - 56320);
        } else if ((c & 63488) == 55296) {
            return 65533;
        }
        return c;
    };

    constructor.PunycodeLength = function(str, index, endIndex) {
        if (str == null) {
             throw new Error("str");
        }
        if (index < 0) {
             throw new Error("index (" + index + ") is less than 0");
        }
        if (index > str.length) {
             throw new Error("index (" + index + ") is more than " + str.length);
        }
        if (endIndex < 0) {
             throw new Error("endIndex (" + endIndex + ") is less than 0");
        }
        if (endIndex > str.length) {
             throw new Error("endIndex (" + endIndex + ") is more than " + str.length);
        }
        if (endIndex < index) {
             throw new Error("endIndex (" + endIndex + ") is less than " + index);
        }
        var n = 128;
        var delta = 0;
        var bias = 72;
        var h = 0;
        var tmpIndex;
        var firstIndex = -1;
        var codePointLength = 0;
        var basicsBeforeFirstNonbasic = 0;
        var allBasics = true;
        tmpIndex = index;
         while (tmpIndex < endIndex){
            if (str.charCodeAt(tmpIndex) >= 128) {
                allBasics = false;
                break;
            }
            ++tmpIndex;
        }
        if (allBasics) {
            return endIndex - index;
        }
        var outputLength = 4;
        tmpIndex = index;
         while (tmpIndex < endIndex){
            var c = DomainUtility.CodePointAt(str, tmpIndex, endIndex);
            ++codePointLength;
            if (c < 128) {
                ++outputLength;
                ++h;
            } else if (firstIndex < 0) {
                firstIndex = tmpIndex;
            }
            tmpIndex = tmpIndex + ((c >= 65536) ? 2 : 1);
        }
        if (h != 0) {
            ++outputLength;
        }
        var b = h;
        if (firstIndex >= 0) {
            basicsBeforeFirstNonbasic = firstIndex - index;
        } else {
            return endIndex - index;
        }
         while (h < codePointLength){
            var min = 1114112;
            tmpIndex = firstIndex;
             while (tmpIndex < endIndex){
                var c = DomainUtility.CodePointAt(str, tmpIndex, endIndex);
                tmpIndex = tmpIndex + ((c >= 65536) ? 2 : 1);
                if (c >= n && c < min) {
                    min = c;
                }
            }
            var d = min - n;
            if (d > ((2147483647 / (h + 1))|0)) {
                return -1;
            }
            d *= h + 1;
            n = min;
            if (d > 2147483647 - delta) {
                return -1;
            }
            delta = delta + (d);
            tmpIndex = firstIndex;
            if (basicsBeforeFirstNonbasic > 2147483647 - delta) {
                return -1;
            }
            delta = delta + (basicsBeforeFirstNonbasic);
             while (tmpIndex < endIndex){
                var c = DomainUtility.CodePointAt(str, tmpIndex, endIndex);
                tmpIndex = tmpIndex + ((c >= 65536) ? 2 : 1);
                if (c < n) {
                    if (delta == 2147483647) {
                        return -1;
                    }
                    ++delta;
                } else if (c == n) {
                    var q = delta;
                    var k = 36;
                     while (true){
                        var t;
                        t = (k <= bias) ? 1 : ((k >= bias + 26) ? 26 : (k - bias));
                        if (q < t) {
                            break;
                        }
                        ++outputLength;
                        q -= t;
                        q = (q / (36 - t))|0;
                        k = k + (36);
                    }
                    ++outputLength;
                    delta = (h == b) ? ((delta / 700)|0) : delta >> 1;
                    delta = delta + ((delta / (h + 1))|0);
                    k = 0;
                     while (delta > 455){
                        delta = ((delta / 35)|0);
                        k = k + (36);
                    }
                    bias = k + (((36 * delta) / (delta + 38))|0);
                    delta = 0;
                    ++h;
                }
            }
            ++n;
            ++delta;
        }
        return outputLength;
    };
    constructor.ValueDigitValues = [(-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), (-1), 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, (-1), (-1), (-1), (-1), (-1), (-1), (-1), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, (-1), (-1), (-1), (-1), (-1), (-1), 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, (-1), (-1), (-1), (-1), (-1)];
    constructor.PunycodeDecode = function(str, index, endIndex) {
        if (str == null) {
             throw new Error("str");
        }
        if (index < 0) {
             throw new Error("index (" + index + ") is less than 0");
        }
        if (index > str.length) {
             throw new Error("index (" + index + ") is more than " + str.length);
        }
        if (endIndex < 0) {
             throw new Error("endIndex (" + endIndex + ") is less than 0");
        }
        if (endIndex > str.length) {
             throw new Error("endIndex (" + endIndex + ") is more than " + str.length);
        }
        if (endIndex < index) {
             throw new Error("endIndex (" + endIndex + ") is less than " + index);
        }
        if (index == endIndex) {
            return "";
        }
        var lastHyphen = endIndex - 1;
         while (lastHyphen >= index){
            if (str.charAt(lastHyphen) == '-') {
                break;
            }
            --lastHyphen;
        }
        var i = 0;
        if (lastHyphen >= index) {
            for (i = index; i < lastHyphen; ++i) {
                if (str.charCodeAt(i) >= 128) {
                    return null;
                }
            }
        }
        var builder = JSInteropFactory.createStringBuilder(16);
        for (var k = index; k < lastHyphen; ++k) {
            var c = str.charCodeAt(k);
            if (c >= 65 && c <= 90) {
                c = c + (32);
            }
            builder.append(c|0);
        }
        if (lastHyphen >= index) {
            index = lastHyphen + 1;
        }
        i = 0;
        var n = 128;
        var bias = 72;
        var stringLength = builder.length();
        var chararr = [0, 0];
         while (index < endIndex){
            var old = index;
            var w = 1;
            var k = 36;
             while (true){
                if (index >= endIndex) {
                    return null;
                }
                var c = str.charCodeAt(index);
                ++index;
                if (c >= 128) {
                    return null;
                }
                var digit = DomainUtility.ValueDigitValues[(c|0)];
                if (digit < 0) {
                    return null;
                }
                if (digit > ((2147483647 / w)|0)) {
                    return null;
                }
                var temp = digit * w;
                if (i > 2147483647 - temp) {
                    return null;
                }
                i = i + (temp);
                var t = k - bias;
                if (k <= bias) {
                    t = 1;
                } else if (k >= bias + 26) {
                    t = 26;
                }
                if (digit < t) {
                    break;
                }
                temp = 36 - t;
                if (w > ((2147483647 / temp)|0)) {
                    return null;
                }
                w *= temp;
                k = k + (36);
            }
            var futureLength = stringLength + 1;
            var delta = (old == 0) ? (((i - old) / 700)|0) : (i - old) >> 1;
            delta = delta + ((delta / futureLength)|0);
            k = 0;
             while (delta > 455){
                delta = ((delta / 35)|0);
                k = k + (36);
            }
            bias = k + (((36 * delta) / (delta + 38))|0);
            var idiv;
            idiv = ((i / futureLength)|0);
            if (n > 2147483647 - idiv) {
                return null;
            }
            n = n + (idiv);
            i %= futureLength;
            if (n <= 65535) {
                chararr[0] = (n|0);
                builder.insert(i, chararr, 0, 1);
            } else if (n <= 1114111) {
                chararr[0] = ((((((n - 65536) >> 10) & 1023) + 55296))|0);
                chararr[1] = ((((n - 65536) & 1023) + 56320)|0);
                builder.insert(i, chararr, 0, 2);
            } else {
                return null;
            }
            ++stringLength;
            ++i;
        }
        return builder.toString();
    };
    constructor.PunycodeAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    constructor.PunycodeEncode = function(str) {
        return DomainUtility.PunycodeEncodePortion(str, 0, str.length);
    };
    constructor.PunycodeEncodePortion = function(str, index, endIndex) {
        if (str == null) {
             throw new Error("str");
        }
        if (index < 0) {
             throw new Error("index (" + index + ") is less than 0");
        }
        if (index > str.length) {
             throw new Error("index (" + index + ") is more than " + str.length);
        }
        if (endIndex < 0) {
             throw new Error("endIndex (" + endIndex + ") is less than 0");
        }
        if (endIndex > str.length) {
             throw new Error("endIndex (" + endIndex + ") is more than " + str.length);
        }
        if (endIndex < index) {
             throw new Error("endIndex (" + endIndex + ") is less than " + index);
        }
        var n = 128;
        var delta = 0;
        var bias = 72;
        var h = 0;
        var tmpIndex;
        var firstIndex = -1;
        var codePointLength = 0;
        var basicsBeforeFirstNonbasic = 0;
        var allBasics = true;
        tmpIndex = index;
         while (tmpIndex < endIndex){
            if (str.charCodeAt(tmpIndex) >= 128) {
                allBasics = false;
                break;
            }
            if (str.charCodeAt(tmpIndex) >= 65 && str.charCodeAt(tmpIndex) <= 90) {
                allBasics = false;
                break;
            }
            ++tmpIndex;
        }
        if (allBasics) {
            return str.substring(index, (index) + (endIndex - index));
        }
        var builder = JSInteropFactory.createStringBuilder(16);
        builder.append("xn--");
        tmpIndex = index;
         while (tmpIndex < endIndex){
            var c = Idna.CodePointAt(str, tmpIndex);
            ++codePointLength;
            if (c >= 65 && c <= 90) {
                builder.append((c + 32)|0);
                ++h;
            } else if (c < 128) {
                builder.append(c|0);
                ++h;
            } else if (firstIndex < 0) {
                firstIndex = tmpIndex;
            }
            if (c >= 65536) {
                ++tmpIndex;
            }
            ++tmpIndex;
        }
        var b = h;
        if (firstIndex >= 0) {
            basicsBeforeFirstNonbasic = firstIndex - index;
        } else {
            return builder.toString();
        }
        if (h != 0) {
            builder.append('-');
        }
         while (h < codePointLength){
            var min = 1114112;
            tmpIndex = firstIndex;
             while (tmpIndex < endIndex){
                var c = Idna.CodePointAt(str, tmpIndex);
                if (c >= n && c < min) {
                    min = c;
                }
                if (c >= 65536) {
                    ++tmpIndex;
                }
                ++tmpIndex;
            }
            var d = min - n;
            if (d > ((2147483647 / (h + 1))|0)) {
                return null;
            }
            d *= h + 1;
            n = min;
            if (d > 2147483647 - delta) {
                return null;
            }
            delta = delta + (d);
            tmpIndex = firstIndex;
            if (basicsBeforeFirstNonbasic > 2147483647 - delta) {
                return null;
            }
            delta = delta + (basicsBeforeFirstNonbasic);
             while (tmpIndex < endIndex){
                var c = Idna.CodePointAt(str, tmpIndex);
                if (c >= 65536) {
                    ++tmpIndex;
                }
                ++tmpIndex;
                if (c < n) {
                    if (delta == 2147483647) {
                        return null;
                    }
                    ++delta;
                } else if (c == n) {
                    var q = delta;
                    var k = 36;
                    if(q<0)throw new Error();
                     while (true){
                        var t;
                        t = (k <= bias) ? 1 : ((k >= bias + 26) ? 26 : (k - bias));
                        if (q < t) {
                            break;
                        }
                        var digit = t + ((q - t) % (36 - t));
                        builder.append(DomainUtility.PunycodeAlphabet.charAt(digit));
                        q -= t;
                        q = (q / (36 - t))|0;
                        k = k + (36);
                    }
                    if(q<0)throw new Error();
                    builder.append(DomainUtility.PunycodeAlphabet.charAt(q));
                    delta = (h == b) ? ((delta / 700)|0) : delta >> 1;
                    delta = delta + ((delta / (h + 1))|0);
                    k = 0;
                     while (delta > 455){
                        delta = ((delta / 35)|0);
                        k = k + (36);
                    }
                    bias = k + (((36 * delta) / (delta + 38))|0);
                    delta = 0;
                    ++h;
                }
            }
            ++n;
            ++delta;
        }
        return builder.toString();
    };
})(DomainUtility,DomainUtility.prototype);
var Idna = function() {};
(function(constructor,prototype){
    constructor.Unassigned = 0;
    constructor.Disallowed = 2;
    constructor.ContextJ = 3;
    constructor.ContextO = 4;
    constructor.BidiClassL = 0;
    constructor.BidiClassR = 1;
    constructor.BidiClassAL = 2;
    constructor.BidiClassEN = 3;
    constructor.BidiClassES = 4;
    constructor.BidiClassET = 5;
    constructor.BidiClassAN = 6;
    constructor.BidiClassCS = 7;
    constructor.BidiClassNSM = 8;
    constructor.BidiClassBN = 9;
    constructor.BidiClassON = 10;
    constructor.ValueBidiClassesSync = new Object();
    constructor.ValueJoiningTypesSync = new Object();
    constructor.ValueScriptsSync = new Object();
    constructor.bidiClasses = null;
    constructor.joiningTypes = null;
    constructor.scripts = null;
    constructor['CodePointBefore'] = constructor.CodePointBefore = function(str, index) {
        if (str == null) {
             throw new Error("str");
        }
        if (index <= 0) {
            return -1;
        }
        if (index > str.length) {
            return -1;
        }
        var c = str.charCodeAt(index - 1);
        if ((c & 64512) == 56320 && index - 2 >= 0 && str.charCodeAt(index - 2) >= 55296 && str.charCodeAt(index - 2) <= 56319) {
            return 65536 + ((str.charCodeAt(index - 2) - 55296) << 10) + (c - 56320);
        }
        return ((c & 63488) == 55296) ? 65533 : c;
    };
    constructor.CodePointAt = function(str, index) {
        if (str == null) {
             throw new Error("str");
        }
        if (index >= str.length) {
            return -1;
        }
        if (index < 0) {
            return -1;
        }
        var c = str.charCodeAt(index);
        if ((c & 64512) == 55296 && index + 1 < str.length && str.charCodeAt(index + 1) >= 56320 && str.charCodeAt(index + 1) <= 57343) {
            return 65536 + ((c - 55296) << 10) + (str.charCodeAt(index + 1) - 56320);
        }
        return ((c & 63488) == 55296) ? 65533 : c;
    };
    constructor.GetBidiClass = function(ch) {
        var table = null;
        {
            Idna.bidiClasses = (Idna.bidiClasses == null) ? (ByteData.Decompress(IdnaData.BidiClasses)) : Idna.bidiClasses;
            table = Idna.bidiClasses;
        }return table.GetByte(ch);
    };
    constructor.GetJoiningType = function(ch) {
        var table = null;
        {
            Idna.joiningTypes = (Idna.joiningTypes == null) ? (ByteData.Decompress(IdnaData.JoiningTypes)) : Idna.joiningTypes;
            table = Idna.joiningTypes;
        }return table.GetByte(ch);
    };
    constructor.GetScript = function(ch) {
        var table = null;
        {
            Idna.scripts = (Idna.scripts == null) ? (ByteData.Decompress(IdnaData.IdnaRelevantScripts)) : Idna.scripts;
            table = Idna.scripts;
        }return table.GetByte(ch);
    };
    constructor.JoiningTypeTransparent = function(ch) {
        return Idna.GetJoiningType(ch) == 1;
    };
    constructor.JoiningTypeLeftOrDual = function(ch) {
        var jtype = Idna.GetJoiningType(ch);
        return jtype == 3 || jtype == 4;
    };
    constructor.JoiningTypeRightOrDual = function(ch) {
        var jtype = Idna.GetJoiningType(ch);
        return jtype == 2 || jtype == 4;
    };
    constructor.IsGreek = function(ch) {
        return Idna.GetScript(ch) == 1;
    };
    constructor.IsHebrew = function(ch) {
        return Idna.GetScript(ch) == 2;
    };
    constructor.IsKanaOrHan = function(ch) {
        return Idna.GetScript(ch) == 3;
    };
    constructor.IsValidConjunct = function(str, index) {
        var found = false;
        var oldIndex = index;
         while (index > 0){
            var ch = Idna.CodePointBefore(str, index);
            index -= (ch >= 65536) ? 2 : 1;
            if (Idna.JoiningTypeLeftOrDual(ch)) {
                found = true;
            } else if (!Idna.JoiningTypeTransparent(ch)) {
                return false;
            }
        }
        if (!found) {
            return false;
        }
        index = oldIndex + 1;
         while (index < str.length){
            var ch = Idna.CodePointAt(str, index);
            index = index + ((ch >= 65536) ? 2 : 1);
            if (Idna.JoiningTypeRightOrDual(ch)) {
                return true;
            }
            if (!Idna.JoiningTypeTransparent(ch)) {
                return false;
            }
        }
        return false;
    };
    constructor.HasRtlCharacters = function(str) {
        for (var i = 0; i < str.length; ++i) {
            if (str.charCodeAt(i) >= 128) {
                var c = Idna.CodePointAt(str, i);
                if (c >= 65536) {
                    ++i;
                }
                var bidiClass = Idna.GetBidiClass(c);
                if (bidiClass == Idna.BidiClassAL || bidiClass == Idna.BidiClassAN || bidiClass == Idna.BidiClassR) {
                    return true;
                }
            }
        }
        return false;
    };

    constructor['EncodeDomainName'] = constructor.EncodeDomainName = function(value) {
        if (value == null) {
             throw new Error("value");
        }
        if (value.length == 0) {
            return "";
        }
        var builder = JSInteropFactory.createStringBuilder(16);
        var retval = null;
        var lastIndex = 0;
        for (var i = 0; i < value.length; ++i) {
            var c = value.charAt(i);
            if (c == '.') {
                if (i != lastIndex) {
                    retval = DomainUtility.PunycodeEncodePortion(value, lastIndex, i);
                    if (retval == null) {
                        builder.append(value.substring(lastIndex, (lastIndex) + ((i + 1) - lastIndex)));
                    } else {
                        builder.append(retval);
                        builder.append('.');
                    }
                }
                lastIndex = i + 1;
            }
        }
        retval = DomainUtility.PunycodeEncodePortion(value, lastIndex, value.length);
        if (retval == null) {
            builder.append(value.substring(lastIndex, (lastIndex) + (value.length - lastIndex)));
        } else {
            builder.append(retval);
        }
        return builder.toString();
    };

    constructor['IsValidDomainName'] = constructor.IsValidDomainName = function(str, lookupRules) {
        if ((str) == null || (str).length == 0) {
            return false;
        }
        var bidiRule = Idna.HasRtlCharacters(str);
        var lastIndex = 0;
        for (var i = 0; i < str.length; ++i) {
            var c = str.charAt(i);
            if (c == '.') {
                if (i == lastIndex) {
                    return false;
                }
                if (!Idna.IsValidLabel(str.substring(lastIndex, (lastIndex) + (i - lastIndex)), lookupRules, bidiRule)) {
                    return false;
                }
                lastIndex = i + 1;
            }
        }
        return (str.length != lastIndex) && Idna.IsValidLabel(str.substring(lastIndex, (lastIndex) + (str.length - lastIndex)), lookupRules, bidiRule);
    };
    constructor.ToLowerCaseAscii = function(str) {
        if (str == null) {
            return null;
        }
        var len = str.length;
        var c = 0;
        var hasUpperCase = false;
        for (var i = 0; i < len; ++i) {
            c = str.charCodeAt(i);
            if (c >= 65 && c <= 90) {
                hasUpperCase = true;
                break;
            }
        }
        if (!hasUpperCase) {
            return str;
        }
        var builder = JSInteropFactory.createStringBuilder(16);
        for (var i = 0; i < len; ++i) {
            c = str.charCodeAt(i);
            if (c >= 65 && c <= 90) {
                builder.append((c + 32)|0);
            } else {
                builder.append(c);
            }
        }
        return builder.toString();
    };
    constructor.IsValidLabel = function(str, lookupRules, bidiRule) {
        if ((str) == null || (str).length == 0) {
            return false;
        }
        var maybeALabel = str.length >= 4 && (str.charAt(0) == 'x' || str.charAt(0) == 'X') && (str.charAt(1) == 'n' || str.charAt(1) == 'N') && str.charAt(2) == '-' && str.charAt(3) == '-';
        var allLDH = true;
        for (var i = 0; i < str.length; ++i) {
            if ((str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122) || (str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) || (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) || str.charAt(i) == '-') {
                continue;
            }
            if (str.charCodeAt(i) >= 128) {
                allLDH = false;
                continue;
            }
            return false;
        }
        if (maybeALabel) {
            str = Idna.ToLowerCaseAscii(str);
            var ustr = DomainUtility.PunycodeDecode(str, 4, str.length);
            if (ustr == null) {
                return false;
            }
            if (!Idna.IsValidULabel(ustr, lookupRules, bidiRule)) {
                return false;
            }
            var astr = DomainUtility.PunycodeEncodePortion(ustr, 0, ustr.length);
            return (astr != null) && astr==str;
        }
        if (allLDH) {
            if (str.length >= 4 && str.charAt(2) == '-' && str.charAt(3) == '-') {
                return false;
            }
            if (str.charAt(0) != '-' && str.charAt(str.length - 1) != '-' && !(str.charCodeAt(0) >= 48 && str.charCodeAt(0) <= 57)) {
                return true;
            }
        }
        return Idna.IsValidULabel(str, lookupRules, bidiRule);
    };
    constructor.IsValidULabel = function(str, lookupRules, bidiRule) {
        if ((str) == null || (str).length == 0) {
            return false;
        }
        if (str.length > 63 && !lookupRules) {
            return false;
        }
        if (str.length >= 4 && str.charAt(2) == '-' && str.charAt(3) == '-') {
            return false;
        }
        if (!lookupRules) {
            if (str.charAt(0) == '-' || str.charAt(str.length - 1) == '-') {
                return false;
            }
        }
        if (!Normalizer.IsNormalized(str, Normalization.NFC)) {
            return false;
        }
        var ch;
        var first = true;
        var haveContextual = false;
        var rtl = false;
        var bidiClass;
        for (var i = 0; i < str.length; ++i) {
            ch = Idna.CodePointAt(str, i);
            if (ch >= 65536) {
                ++i;
            }
            var category = UnicodeDatabase.GetIdnaCategory(ch);
            if (category == Idna.Disallowed || category == Idna.Unassigned) {
                return false;
            }
            if (first) {
                if (UnicodeDatabase.IsCombiningMark(ch)) {
                    return false;
                }
                if (bidiRule) {
                    bidiClass = Idna.GetBidiClass(ch);
                    if (bidiClass == Idna.BidiClassR || bidiClass == Idna.BidiClassAL) {
                        rtl = true;
                    } else if (bidiClass != Idna.BidiClassL) {
                        return false;
                    }
                }
            }
            haveContextual |= category == Idna.ContextO || category == Idna.ContextJ;
            first = false;
        }
        if (haveContextual) {
            var regArabDigits = false;
            var extArabDigits = false;
            var haveKatakanaMiddleDot = false;
            var haveKanaOrHan = false;
            var lastChar = 0;
            for (var i = 0; i < str.length; ++i) {
                var thisChar = Idna.CodePointAt(str, i);
                if (thisChar >= 1632 && thisChar <= 1641) {
                    if (extArabDigits) {
                        return false;
                    }
                    regArabDigits = true;
                } else if (thisChar >= 1776 && thisChar <= 1785) {
                    if (regArabDigits) {
                        return false;
                    }
                    extArabDigits = true;
                } else if (thisChar == 183) {
                    if (!(i - 1 >= 0 && i + 1 < str.length && lastChar == 108 && str.charCodeAt(i + 1) == 108)) {
                        return false;
                    }
                } else if (thisChar == 8205) {
                    if (UnicodeDatabase.GetCombiningClass(lastChar) != 9) {
                        return false;
                    }
                } else if (thisChar == 8204) {
                    if (UnicodeDatabase.GetCombiningClass(lastChar) != 9 && !Idna.IsValidConjunct(str, i)) {
                        return false;
                    }
                } else if (thisChar == 885) {
                    if (i + 1 >= str.length || !Idna.IsGreek(Idna.CodePointAt(str, i + 1))) {
                        return false;
                    }
                } else if (thisChar == 1523 || thisChar == 1524) {
                    if (i <= 0 || !Idna.IsHebrew(lastChar)) {
                        return false;
                    }
                } else if (thisChar == 12539) {
                    haveKatakanaMiddleDot = true;
                } else {
                    var category = UnicodeDatabase.GetIdnaCategory(thisChar);
                    if (category == Idna.ContextJ || category == Idna.ContextO) {
                        return false;
                    }
                }
                if (!haveKanaOrHan && Idna.IsKanaOrHan(thisChar)) {
                    haveKanaOrHan = true;
                }
                if (thisChar >= 65536) {
                    ++i;
                }
                lastChar = thisChar;
            }
            if (haveKatakanaMiddleDot && !haveKanaOrHan) {
                return false;
            }
        }
        if (bidiRule) {
            var found = false;
            for (var i = str.length; i > 0; --i) {
                var c = Idna.CodePointBefore(str, i);
                if (c >= 65536) {
                    --i;
                }
                bidiClass = Idna.GetBidiClass(c);
                if (rtl && (bidiClass == Idna.BidiClassR || bidiClass == Idna.BidiClassAL || bidiClass == Idna.BidiClassAN)) {
                    found = true;
                    break;
                }
                if (!rtl && (bidiClass == Idna.BidiClassL)) {
                    found = true;
                    break;
                }
                if (bidiClass == Idna.BidiClassEN) {
                    found = true;
                    break;
                }
                if (bidiClass != Idna.BidiClassNSM) {
                    return false;
                }
            }
            if (!found) {
                return false;
            }
            var haveEN = false;
            var haveAN = false;
            for (var i = 0; i < str.length; ++i) {
                var c = Idna.CodePointAt(str, i);
                if (c >= 65536) {
                    ++i;
                }
                bidiClass = Idna.GetBidiClass(c);
                if (rtl && (bidiClass == Idna.BidiClassR || bidiClass == Idna.BidiClassAL || bidiClass == Idna.BidiClassAN)) {
                    if (bidiClass == Idna.BidiClassAN) {
                        if (haveEN) {
                            return false;
                        }
                        haveAN = true;
                    }
                    continue;
                }
                if (!rtl && (bidiClass == Idna.BidiClassL)) {
                    continue;
                }
                if (bidiClass == Idna.BidiClassEN) {
                    if (rtl) {
                        if (haveAN) {
                            return false;
                        }
                        haveEN = false;
                    }
                    continue;
                }
                if (bidiClass == Idna.BidiClassES || bidiClass == Idna.BidiClassCS || bidiClass == Idna.BidiClassET || bidiClass == Idna.BidiClassON || bidiClass == Idna.BidiClassBN || bidiClass == Idna.BidiClassNSM) {
                    continue;
                }
                return false;
            }
        }
        var aceLength = DomainUtility.PunycodeLength(str, 0, str.length);
        if (aceLength < 0) {
            return false;
        }
        if (!lookupRules) {
            if (aceLength > 63) {
                return false;
            }
        }
        return true;
    };
})(Idna,Idna.prototype);

if(typeof exports!=="undefined")exports['Idna']=Idna;
if(typeof window!=="undefined")window['Idna']=Idna;
var Normalization=function(){};Normalization.NFC=0;Normalization['NFC']=0;Normalization.NFD=1;Normalization['NFD']=1;Normalization.NFKC=2;Normalization['NFKC']=2;Normalization.NFKD=3;Normalization['NFKD']=3;

if(typeof exports!=="undefined")exports['Normalization']=Normalization;
if(typeof window!=="undefined")window['Normalization']=Normalization;
var Normalizer =
function(stream, form) {
    if (stream == null) {
         throw new Error("stream");
    }
    if(typeof stream=="string"){
      stream=new Normalizer.StringCharacterInput2(stream,0,stream.length);
    }
    this.lastQcsIndex = -1;
    this.iterator = stream;
    this.form = form;
    this.readbuffer = [0];
    this.lastCharBuffer = [0, 0];
    this.compatMode = form == Normalization.NFKC || form == Normalization.NFKD;
};
(function(constructor,prototype){
    constructor['DecompToBufferInternal'] = constructor.DecompToBufferInternal = function(ch, compat, buffer, index) {
        var offset = UnicodeDatabase.GetDecomposition(ch, compat, buffer, index);
        if (buffer[index] != ch) {
            var copy = [];
            for (var arrfillI = 0; arrfillI < offset - index; arrfillI++)
                copy[arrfillI] = 0;
            for (var arrfillI = 0; arrfillI < copy.length; arrfillI++)
                copy[arrfillI] = buffer[index + arrfillI];
            offset = index;
            for (var i = 0; i < copy.length; ++i) {
                offset = Normalizer.DecompToBufferInternal(copy[i], compat, buffer, offset);
            }
        }
        return offset;
    };
    constructor.DecompToBuffer = function(ch, compat, buffer, index) {
        if (ch >= 44032 && ch < 44032 + 11172) {
            var syllable = ch - 44032;
            var trail = syllable % 28;
            buffer[index++] = 4352 + ((syllable / 588)|0);
            buffer[index++] = 4449 + (((syllable % 588) / 28)|0);
            if (trail != 0) {
                buffer[index++] = 4519 + trail;
            }
            return index;
        }
        return Normalizer.DecompToBufferInternal(ch, compat, buffer, index);
    };
    constructor.ReorderBuffer = function(buffer, index, length) {
        var i;
        if (length < 2) {
            return;
        }
        var changed;
        do {
            changed = false;
            var lead = UnicodeDatabase.GetCombiningClass(buffer[index]);
            var trail;
            for (i = 1; i < length; ++i) {
                var offset = index + i;
                trail = UnicodeDatabase.GetCombiningClass(buffer[offset]);
                if (trail != 0 && lead > trail) {
                    var c = buffer[offset - 1];
                    buffer[offset - 1] = buffer[offset];
                    buffer[offset] = c;
                    changed = true;
                } else {
                    lead = trail;
                }
            }
        } while (changed);
    };
    constructor.ComposeBuffer = function(array, length) {
        if (length < 2) {
            return length;
        }
        var starterPos = 0;
        var retval = length;
        var starter = array[0];
        var last = UnicodeDatabase.GetCombiningClass(starter);
        if (last != 0) {
            last = 256;
        }
        var endPos = 0 + length;
        var composed = false;
        for (var decompPos = 0; decompPos < endPos; ++decompPos) {
            var ch = array[decompPos];
            var valuecc = UnicodeDatabase.GetCombiningClass(ch);
            if (decompPos > 0) {
                var lead = starter - 4352;
                if (0 <= lead && lead < 19) {
                    var vowel = ch - 4449;
                    if (0 <= vowel && vowel < 21 && (last < valuecc || last == 0)) {
                        starter = 44032 + (((lead * 21) + vowel) * 28);
                        array[starterPos] = starter;
                        array[decompPos] = 1114112;
                        composed = true;
                        --retval;
                        continue;
                    }
                }
                var syllable = starter - 44032;
                if (0 <= syllable && syllable < 11172 && (syllable % 28) == 0) {
                    var trail = ch - 4519;
                    if (0 < trail && trail < 28 && (last < valuecc || last == 0)) {
                        starter = starter + (trail);
                        array[starterPos] = starter;
                        array[decompPos] = 1114112;
                        composed = true;
                        --retval;
                        continue;
                    }
                }
            }
            var composite = UnicodeDatabase.GetComposedPair(starter, ch);
            var diffClass = last < valuecc;
            if (composite >= 0 && (diffClass || last == 0)) {
                array[starterPos] = composite;
                starter = composite;
                array[decompPos] = 1114112;
                composed = true;
                --retval;
                continue;
            }
            if (valuecc == 0) {
                starterPos = decompPos;
                starter = ch;
            }
            last = valuecc;
        }
        if (composed) {
            var j = 0;
            for (var i = 0; i < endPos; ++i) {
                if (array[i] != 1114112) {
                    array[j++] = array[i];
                }
            }
        }
        return retval;
    };
    prototype.lastQcsIndex = 0;
    prototype.endIndex = 0;
    prototype.buffer = null;
    prototype['compatMode'] = prototype.compatMode = false;
    prototype['form'] = prototype.form = null;
    prototype.processedIndex = 0;
    prototype.flushIndex = 0;
    prototype['iterator'] = prototype.iterator = null;

    constructor['Normalize'] = constructor.Normalize = function(str, form) {
        if (str == null) {
             throw new Error("str");
        }
        if (str.length <= 1024 && Normalizer.IsNormalized(str, form)) {
            return str;
        }
        return Encodings.InputToString(new Normalizer(new Normalizer.StringCharacterInput2(str, 0, str.length), form));
    };

    constructor['IsNormalized'] = constructor.IsNormalized = function(str, form) {
        if (str == null) {
             throw new Error("str");
        }
        var mask = (form == Normalization.NFC) ? 255 : 127;
        var lastQcsIndex = 0;
        var haveNonQcs = false;
        for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if ((c & 64512) == 55296 && i + 1 < str.length && str.charCodeAt(i + 1) >= 56320 && str.charCodeAt(i + 1) <= 57343) {
                c = 65536 + ((c - 55296) << 10) + (str.charCodeAt(i + 1) - 56320);
            } else if ((c & 63488) == 55296) {
                return false;
            }
            var isQcs = false;
            if ((c & mask) == c && (i + 1 == str.length || (str.charCodeAt(i + 1) & mask) == str.charCodeAt(i + 1))) {
                isQcs = true;
            } else {
                isQcs = (c >= 983040) ? true : UnicodeDatabase.IsQuickCheckStarter(c, form);
            }
            if (isQcs) {
                if (haveNonQcs) {
                    if (!Normalizer.NormalizeAndCheckString(str, lastQcsIndex, i - lastQcsIndex, form)) {
                        return false;
                    }
                }
                lastQcsIndex = i;
                haveNonQcs = false;
            } else {
                haveNonQcs = true;
            }
            if (c >= 65536) {
                ++i;
            }
        }
        if (haveNonQcs) {
            if (!Normalizer.NormalizeAndCheckString(str, lastQcsIndex, str.length - lastQcsIndex, form)) {
                return false;
            }
        }
        return true;
    };
    constructor.NormalizeAndCheckString = function(charString, start, length, form) {
        var i = start;
        var norm = new Normalizer(new Normalizer.StringCharacterInput2(charString, start, length), form);
        var ch = 0;
        var endIndex = start + length;
         while ((ch = norm.ReadChar()) >= 0){
            var c = charString.charCodeAt(i);
            if ((c & 2096128) == 55296 && i + 1 < endIndex && charString.charCodeAt(i + 1) >= 56320 && charString.charCodeAt(i + 1) <= 57343) {
                c = 65536 + ((c - 55296) << 10) + (charString.charCodeAt(i + 1) - 56320);
                ++i;
            } else if ((c & 2095104) == 55296) {
                c = 65533;
            }
            ++i;
            if (c != ch) {
                return false;
            }
        }
        return i == endIndex;
    };
    prototype['readbuffer'] = prototype.readbuffer = null;

    prototype['ReadChar'] = prototype.ReadChar = function() {
        var r = this.Read(this.readbuffer, 0, 1);
        return r == 1 ? this.readbuffer[0] : -1;
    };
    prototype.endOfString = false;
    prototype.lastCharBuffer = null;
    prototype.lastCharPos = 0;
    prototype.PrependOne = function(c) {
        if (this.lastCharPos + 1 > this.lastCharBuffer.length) {
            var newbuffer = [];
            for (var arrfillI = 0; arrfillI < this.lastCharPos + 8; arrfillI++)
                newbuffer[arrfillI] = 0;
            for (var arrfillI = 0; arrfillI < this.lastCharPos; arrfillI++)
                newbuffer[arrfillI] = this.lastCharBuffer[arrfillI];
            this.lastCharBuffer = newbuffer;
        }
        this.lastCharBuffer[this.lastCharPos++] = c;
    };
    prototype.PrependTwo = function(c1, c2) {
        if (this.lastCharPos + 2 > this.lastCharBuffer.length) {
            var newbuffer = [];
            for (var arrfillI = 0; arrfillI < this.lastCharPos + 8; arrfillI++)
                newbuffer[arrfillI] = 0;
            for (var arrfillI = 0; arrfillI < this.lastCharPos; arrfillI++)
                newbuffer[arrfillI] = this.lastCharBuffer[arrfillI];
            this.lastCharBuffer = newbuffer;
        }
        this.lastCharBuffer[this.lastCharPos++] = c2;
        this.lastCharBuffer[this.lastCharPos++] = c1;
    };
    prototype.GetNextChar = function() {
        var ch;
        if (this.lastCharPos > 0) {
            --this.lastCharPos;
            ch = this.lastCharBuffer[this.lastCharPos];
            return ch;
        }
        ch = this.iterator.ReadChar();
        if (ch < 0) {
            this.endOfString = true;
        } else if (ch > 1114111 || ((ch & 2095104) == 55296)) {
             throw new Error("Invalid character: " + ch);
        }
        return ch;
    };

    prototype['Read'] = prototype.Read = function(chars, index, length) {
        if (chars == null) {
             throw new Error("chars");
        }
        if (index < 0) {
             throw new Error("index (" + index + ") is less than 0");
        }
        if (index > chars.length) {
             throw new Error("index (" + index + ") is more than " + chars.length);
        }
        if (length < 0) {
             throw new Error("length (" + length + ") is less than 0");
        }
        if (length > chars.length) {
             throw new Error("length (" + length + ") is more than " + chars.length);
        }
        if (chars.length - index < length) {
             throw new Error("chars's length minus " + index + " (" + (chars.length - index) + ") is less than " + length);
        }
        if (length == 0) {
            return 0;
        }
        var total = 0;
        var count = 0;
        if (this.processedIndex == this.flushIndex && this.flushIndex == 0) {
             while (total < length){
                var c = this.GetNextChar();
                if (c < 0) {
                    return (total == 0) ? -1 : total;
                }
                if (c < 128 || UnicodeDatabase.IsQuickCheckStarter(c, this.form)) {
                    if (this.form == Normalization.NFD || this.form == Normalization.NFKD) {
                        chars[index] = c;
                        ++total;
                        ++index;
                    } else {
                         while (total < length){
                            var c2 = this.GetNextChar();
                            if (c2 < 0) {
                                chars[index] = c;
                                ++total;
                                return total;
                            } else {
                                this.PrependTwo(c, c2);
                                break;
                            }
                        }
                        break;
                    }
                } else {
                    this.PrependOne(c);
                    break;
                }
            }
            if (total == length) {
                return total;
            }
        }
        do {
            count = (this.processedIndex - this.flushIndex < length - total ? this.processedIndex - this.flushIndex : length - total);
            if (count < 0) {
                count = 0;
            }
            if (count != 0) {
                {
                    var arrfillSrc = this.flushIndex, arrfillDst = index;
                    for (var arrfillI = 0; arrfillI < count; arrfillI++)
                        chars[arrfillDst + arrfillI] = this.buffer[arrfillSrc + arrfillI];
                }}
            index = index + (count);
            total = total + (count);
            this.flushIndex += count;
            var decompForm = this.form == Normalization.NFD || this.form == Normalization.NFKD;
             while (total < length && this.processedIndex == this.endIndex){
                var c = this.GetNextChar();
                if (c < 0) {
                    this.endOfString = true;
                    break;
                }
                if (UnicodeDatabase.IsQuickCheckStarter(c, this.form)) {
                    if (decompForm) {
                        chars[index] = c;
                        ++total;
                        ++index;
                    } else {
                         while (total < length){
                            var c2 = this.GetNextChar();
                            if (c2 < 0) {
                                chars[index] = c;
                                ++total;
                                return total;
                            } else {
                                this.PrependTwo(c, c2);
                                break;
                            }
                        }
                        break;
                    }
                } else {
                    this.PrependOne(c);
                    break;
                }
            }
            if (total < length && this.flushIndex == this.processedIndex) {
                if (this.lastQcsIndex > 0) {
                    {
                        var arrfillSrc = this.lastQcsIndex, arrfillDst = 0;
                        for (var arrfillI = 0; arrfillI < this.buffer.length - this.lastQcsIndex; arrfillI++)
                            this.buffer[arrfillDst + arrfillI] = this.buffer[arrfillSrc + arrfillI];
                    }this.endIndex -= this.lastQcsIndex;
                    this.lastQcsIndex = 0;
                } else {
                    this.endIndex = 0;
                }
                if (!this.LoadMoreData()) {
                    break;
                }
            }
        } while (total < length);
        if (this.processedIndex != this.flushIndex) {}
        count = (0 > (this.processedIndex - this.flushIndex < length - total ? this.processedIndex - this.flushIndex : length - total) ? 0 : (this.processedIndex - this.flushIndex < length - total ? this.processedIndex - this.flushIndex : length - total));
        {
            var arrfillSrc = this.flushIndex, arrfillDst = index;
            for (var arrfillI = 0; arrfillI < count; arrfillI++)
                chars[arrfillDst + arrfillI] = this.buffer[arrfillSrc + arrfillI];
        }index = index + (count);
        total = total + (count);
        this.flushIndex += count;
        return (total == 0) ? -1 : total;
    };
    prototype.LoadMoreData = function() {
        var done = false;
         while (!done){
            this.buffer = (this.buffer == null) ? ([]) : this.buffer;
             while (this.endIndex + 18 <= this.buffer.length){
                var c = this.GetNextChar();
                if (c < 0) {
                    this.endOfString = true;
                    break;
                }
                this.endIndex = Normalizer.DecompToBuffer(c, this.compatMode, this.buffer, this.endIndex);
            }
            if (!this.endOfString) {
                var haveNewQcs = false;
                var decompForm = this.form == Normalization.NFD || this.form == Normalization.NFKD;
                var nextIsQCS = false;
                for (var i = this.endIndex - 1; i > this.lastQcsIndex; --i) {
                    if (UnicodeDatabase.IsQuickCheckStarter(this.buffer[i], this.form)) {
                        if (decompForm) {
                            this.lastQcsIndex = i;
                            haveNewQcs = true;
                            break;
                        } else if (i + 1 < this.endIndex && (nextIsQCS || UnicodeDatabase.IsQuickCheckStarter(this.buffer[i + 1], this.form))) {
                            this.lastQcsIndex = i;
                            haveNewQcs = true;
                            break;
                        } else {
                            nextIsQCS = true;
                        }
                    } else {
                        nextIsQCS = false;
                    }
                }
                if (!haveNewQcs || this.lastQcsIndex <= 0) {
                    var newBuffer = [];
                    for (var arrfillI = 0; arrfillI < (this.buffer.length + 4) * 2; arrfillI++)
                        newBuffer[arrfillI] = 0;
                    for (var arrfillI = 0; arrfillI < this.buffer.length; arrfillI++)
                        newBuffer[arrfillI] = this.buffer[arrfillI];
                    this.buffer = newBuffer;
                    continue;
                }
            } else {
                this.lastQcsIndex = this.endIndex;
            }
            done = true;
        }
        if (this.endIndex == 0) {
            return false;
        }
        this.flushIndex = 0;
        Normalizer.ReorderBuffer(this.buffer, 0, this.lastQcsIndex);
        if (this.form == Normalization.NFC || this.form == Normalization.NFKC) {
            this.processedIndex = Normalizer.ComposeBuffer(this.buffer, this.lastQcsIndex);
        } else {
            this.processedIndex = this.lastQcsIndex;
        }
        return true;
    };
    constructor['StringCharacterInput2'] = constructor.StringCharacterInput2 = function(str, index, length) {
        if (str == null) {
             throw new Error("str");
        }
        if (index < 0) {
             throw new Error("index (" + index + ") is less than 0");
        }
        if (index > str.length) {
             throw new Error("index (" + index + ") is more than " + str.length);
        }
        if (length < 0) {
             throw new Error("length (" + length + ") is less than 0");
        }
        if (length > str.length) {
             throw new Error("length (" + length + ") is more than " + str.length);
        }
        if (str.length - index < length) {
             throw new Error("str's length minus " + index + " (" + (str.length - index) + ") is less than " + length);
        }
        this.str = str;
        this.index = index;
        this.endIndex = index + length;
    };
    (function(constructor,prototype){
        prototype['str'] = prototype.str = null;
        prototype.endIndex = 0;
        prototype.index = 0;
        prototype['ReadChar'] = prototype.ReadChar = function() {
            if (this.index >= this.endIndex) {
                return -1;
            }
            var c = this.str.charCodeAt(this.index);
            if ((c & 64512) == 55296 && this.index + 1 < this.endIndex && this.str.charCodeAt(this.index + 1) >= 56320 && this.str.charCodeAt(this.index + 1) <= 57343) {
                c = 65536 + ((c - 55296) << 10) + (this.str.charCodeAt(this.index + 1) - 56320);
                ++this.index;
            } else if ((c & 63488) == 55296) {
                c = 1114112;
            }
            ++this.index;
            return c;
        };
        prototype['Read'] = prototype.Read = function(chars, index, length) {
            if (chars == null) {
                 throw new Error("chars");
            }
            if (index < 0) {
                 throw new Error("index (" + index + ") is less than 0");
            }
            if (index > chars.length) {
                 throw new Error("index (" + index + ") is more than " + chars.length);
            }
            if (length < 0) {
                 throw new Error("length (" + length + ") is less than 0");
            }
            if (length > chars.length) {
                 throw new Error("length (" + length + ") is more than " + chars.length);
            }
            if (chars.length - index < length) {
                 throw new Error("chars's length minus " + index + " (" + (chars.length - index) + ") is less than " + length);
            }
            if (this.endIndex == this.index) {
                return -1;
            }
            if (length == 0) {
                return 0;
            }
            for (var i = 0; i < length; ++i) {
                var c = this.ReadChar();
                if (c == -1) {
                    return (i == 0) ? -1 : i;
                }
                chars[index + i] = c;
            }
            return length;
        };
    })(Normalizer.StringCharacterInput2,Normalizer.StringCharacterInput2.prototype);
})(Normalizer,Normalizer.prototype);

if(typeof exports!=="undefined")exports['Normalizer']=Normalizer;
if(typeof window!=="undefined")window['Normalizer']=Normalizer;
if(typeof exports!=="undefined")exports['DomainUtility']=DomainUtility;
if(typeof window!=="undefined")window['DomainUtility']=DomainUtility;
var UnicodeDatabase = function() {};
(function(constructor,prototype){
    constructor.ValueClassesSyncRoot = new Object();
    constructor.ValueIdnaCatSyncRoot = new Object();
    constructor.ValuePairsSyncRoot = new Object();
    constructor.ValueQcsSyncRoot = new Object();
    constructor.ValueCmSyncRoot = new Object();
    constructor.classes = null;
    constructor.combmark = null;
    constructor.decomps = null;
    constructor.idnaCat = null;
    constructor.pairs = null;
    constructor.pairsLength = 0;
    constructor.qcsnfc = null;
    constructor.qcsnfd = null;
    constructor.qcsnfkc = null;
    constructor.qcsnfkd = null;
    constructor.GetCombiningClass = function(cp) {
        if (cp < 768 || cp >= 917504) {
            return 0;
        }
        {
            UnicodeDatabase.classes = (UnicodeDatabase.classes == null) ? (ByteData.Decompress(NormalizationData.CombiningClasses)) : UnicodeDatabase.classes;
        }return ((UnicodeDatabase.classes.GetByte(cp))|0) & 255;
    };
    constructor.GetComposedPair = function(first, second) {
        if (((first | second) >> 17) != 0) {
            return -1;
        }
        if (first < 128 && second < 128) {
            return -1;
        }
        UnicodeDatabase.EnsurePairs();
        var left = 0;
        var right = UnicodeDatabase.pairsLength - 1;
         while (left <= right){
            var index = (left + right) >> 1;
            var realIndex = index * 3;
            if (UnicodeDatabase.pairs[realIndex] == first) {
                if (UnicodeDatabase.pairs[realIndex + 1] == second) {
                    return UnicodeDatabase.pairs[realIndex + 2];
                }
                if (UnicodeDatabase.pairs[realIndex + 1] < second) {
                    left = index + 1;
                } else {
                    right = index - 1;
                }
            } else if (UnicodeDatabase.pairs[realIndex] < first) {
                left = index + 1;
            } else {
                right = index - 1;
            }
        }
        return -1;
    };
    constructor.GetDecomposition = function(cp, compat, buffer, offset) {
        if (cp < 128) {
            buffer[offset++] = cp;
            return offset;
        }
        UnicodeDatabase.decomps = NormalizationData.DecompMappings;
        var left = 0;
        var right = (UnicodeDatabase.decomps.length >> 1) - 1;
         while (left <= right){
            var index = (left + right) >> 1;
            var realIndex = (index << 1);
            var dri = UnicodeDatabase.decomps[realIndex];
            var dricp = dri & 2097151;
            if (dricp == cp) {
                var data = dri;
                var data1 = UnicodeDatabase.decomps[realIndex + 1];
                if ((data & (1 << 23)) > 0 && !compat) {
                    buffer[offset++] = cp;
                    return offset;
                }
                if ((data & (1 << 22)) > 0) {
                    buffer[offset++] = data1;
                    return offset;
                }
                if ((data & (1 << 24)) > 0) {
                    buffer[offset++] = data1 & 65535;
                    buffer[offset++] = (data1 >>> 16);
                    return offset;
                }
                var size = data1 >> 24;
                if (size <= 0) {
                     throw new Error();
                }
                realIndex = data1 & 2097151;
                for (var arrfillI = 0; arrfillI < size; arrfillI++)
                    buffer[offset + arrfillI] = NormalizationData.ComplexDecompMappings[realIndex + arrfillI];
                return offset + size;
            }
            if (dricp < cp) {
                left = index + 1;
            } else {
                right = index - 1;
            }
        }
        buffer[offset++] = cp;
        return offset;
    };
    constructor.GetIdnaCategory = function(cp) {
        {
            UnicodeDatabase.idnaCat = (UnicodeDatabase.idnaCat == null) ? (ByteData.Decompress(IdnaData.IdnaCategories)) : UnicodeDatabase.idnaCat;
        }return ((UnicodeDatabase.idnaCat.GetByte(cp))|0) & 255;
    };
    constructor.IsCombiningMark = function(cp) {
        {
            UnicodeDatabase.combmark = (UnicodeDatabase.combmark == null) ? (ByteData.Decompress(IdnaData.CombiningMarks)) : UnicodeDatabase.combmark;
            return UnicodeDatabase.combmark.GetBoolean(cp);
        }};
    constructor.IsQuickCheckStarter = function(cp, form) {
        var bd = null;
        if (form == Normalization.NFC && (cp < NormalizationData.QCSNFCMin || cp > NormalizationData.QCSNFCMax)) {
            return true;
        }
        if (form == Normalization.NFD && (cp < NormalizationData.QCSNFDMin || cp > NormalizationData.QCSNFDMax)) {
            return true;
        }
        if (form == Normalization.NFKC && (cp < NormalizationData.QCSNFKCMin || cp > NormalizationData.QCSNFKCMax)) {
            return true;
        }
        if (form == Normalization.NFKD && (cp < NormalizationData.QCSNFKDMin || cp > NormalizationData.QCSNFKDMax)) {
            return true;
        }
        {
            if (form == Normalization.NFC) {
                bd = UnicodeDatabase.qcsnfc = (UnicodeDatabase.qcsnfc == null) ? (ByteData.Decompress(NormalizationData.QCSNFC)) : UnicodeDatabase.qcsnfc;
            }
            if (form == Normalization.NFD) {
                bd = UnicodeDatabase.qcsnfd = (UnicodeDatabase.qcsnfd == null) ? (ByteData.Decompress(NormalizationData.QCSNFD)) : UnicodeDatabase.qcsnfd;
            }
            if (form == Normalization.NFKC) {
                bd = UnicodeDatabase.qcsnfkc = (UnicodeDatabase.qcsnfkc == null) ? (ByteData.Decompress(NormalizationData.QCSNFKC)) : UnicodeDatabase.qcsnfkc;
            }
            if (form == Normalization.NFKD) {
                bd = UnicodeDatabase.qcsnfkd = (UnicodeDatabase.qcsnfkd == null) ? (ByteData.Decompress(NormalizationData.QCSNFKD)) : UnicodeDatabase.qcsnfkd;
            }
        }return bd != null && bd.GetBoolean(cp);
    };
    constructor.EnsurePairs = function() {
        {
            if (UnicodeDatabase.pairs == null) {
                UnicodeDatabase.pairs = NormalizationData.ComposedPairs;
                UnicodeDatabase.pairsLength = ((UnicodeDatabase.pairs.length / 3)|0);
            }
        }};
})(UnicodeDatabase,UnicodeDatabase.prototype);
})();
