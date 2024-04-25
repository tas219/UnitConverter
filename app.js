/**
 * Script file :D
 * last updated: Apr 24 2024
 * @author Taisia Zhizhina
 */

//mode is changed by button press determines what kind of units we are using(area, time, etc.)
var mode = -1; //mode is initioalized to -1 when nothing is selected

//--------------------field and selector stuff-----------------------------------
//Declaring the 4 main elements from html (2 number fields and 2 select lists)
var value1 = document.getElementById('val1');
var value2 = document.getElementById('val2');
var unit1 = document.querySelector('#Unit1');
var unit2 = document.querySelector('#Unit2');

//Declaring arrays of units for all unit types
const Area_Units = ["Squared Kilometer", "Squared Meter", "Squared Mile", "Squared Yard", "Squared Foot", "Squared Inch", "Hectare", "Acre"];
//currency array is technically missing
const Length_Units = ["Kilometer", "Meter", "Centimeter", "Millimeter", "Nanometer", "Mile", "Yard", "Foot", "Inch", "Nautical Mile"];
const Mass_Units = ["Tonne", "Kilogram", "Gram", "Milligram", "Microgram", "Imperial Ton", "US Ton", "Stone", "Pound", "Ounce"];
const Speed_Units= ["Miles/Hour", "Foot/Second", "Meter/Second", "Kilometer/Hour", "Knot"];
const Temp_Units = ["C", "F", "K"];
const Time_Units = ["Nanosecond", "Microsecond", "Millisecond", "Second", "Minute", "Hour"];
const Volume_Units = [];

//Declaring Array of functions
const conv_funcs = [convertArea, convertCurrency, convertLength, convertMass, convertSpeed, convertTemp, convertTime, convertVolume];

//then fields or selectors change keep conversion updated
value1.addEventListener('input', function(){ callConvert(true);});
value2.addEventListener('input', function(){ callConvert(false);});

unit1.addEventListener('change', function(){ callConvert(true);});
unit2.addEventListener('change', function(){ callConvert(false);});

/**
 * fills in option elements in both selectors
 * @param {String[]} arr array of strings to put as options
 */
function fillOptions(arr){
    for(let i = 0; i < arr.length; i ++)
    {
        //for some reason if I try to append option consecutively it only works for the second one
        //making a second option variable fixed it though
        //note sure if there is another fix
        let opt = document.createElement("option");
        let opt2 = document.createElement("option");
        if(mode != 1)
        {
            opt.text = arr[i];
            opt.value = i;
            opt2.text = arr[i];
            opt2.value = i;
        }
        else{
            opt.text = arr[i][1];
            opt.value = arr[i][0];
            opt2.text = arr[i][1];
            opt2.value = arr[i][0];
        }
            
        unit1.appendChild(opt);
        unit2.appendChild(opt2);
        
    }
    
}

/**
 * calls appropriate conversion method based on mode
 * @param {boolean} bool true if unit1 is Input and unit2 is output, false if reverse
 */
function callConvert(bool)
{
    console.log("Call Convert Called, Mode: " + mode);
    if(mode == -1){
        console.log("Call Convert -1 if statement");
        return;
    } 
    
    let u1 = unit1.value;
    let u2 = unit2.value;
    let v1 = value1.value;
    let v2 = value2.value;

    //dont convert anything if there is nothing to convert 
    if((( v1 == "") && bool)|| (( v2 == "") && (!bool))){
        console.log("Call Convert undefined if statement");
        //make sure the other field is empty too if someone cleared the text box
        value1.value = "";
        value2.value = "";
        return;
    }
    if(mode == 1){
        conv_funcs[mode](bool);
    }
    else if(bool){
        v1 = value1.value;
        v2 = conv_funcs[mode](v1, u1, u2);
        v2 = formatOutput(v2);
        value2.value = v2;
    }
    else{
        v1 = value2.value;
        v2 = conv_funcs[mode](v1, u2, u1);
        v2 = formatOutput(v2);
        value1.value = v2;
    }

}

/**
 * formatt specifications: 2 decimal pts for currency and temperature, 4 for everything else,
 * Scientific notation form (with 4 fraction digits) for all n where 0.0001<|n|<99999
 * @param {int} n output to be formatted
 * @returns formatted version of n
 */
function formatOutput(n){
    if(mode == 1 ) {return Math.round(n*100)/100;}

    if((Math.abs(n) > 99999 || Math.abs(n) < 0.0001)){
        n = n.toExponential(4);
    }

    else{
        if(mode == 5) {return Math.round(n*100)/100;}
        n = Math.round(n*10000)/10000;
    }

    return n;
}

//--------------------button stuff-----------------------------------------------
/**
 * Function 
 * @param {*} btnObj button obj that was pressed
 * @param {int} i Mode associated with button that was pressed
 */
function changeMode(btnObj, i){
    console.log("Change Mode Called");
    //change previous button colour back
    if(mode != -1)//check if in default mode (if so no need to change colour)
    {
        let str = "btn" + mode;//created previous btn's id based on mode
        let prevBtn = document.getElementById(str);
        prevBtn.style.background = "#caa78a";
    }
    else //when going from default to other modes enable input fields
    {
        value1.disabled = false;
        value2.disabled = false;
    }
    mode = i;//set current mode
    //change button colour
    btnObj.style.background = "#a87a54";
    //clear text fields
    value1.value = "";
    value2.value = "";
    //clear options
    unit1.innerHTML = "";
    unit2.innerHTML = "";
    
    //call fillOptions() with appropriate options
    switch(mode)
    {
        
        case 0:
            fillOptions(Area_Units);
            break
        case 1:
            //get the array from frankfurter api and pass to fillOptions
            const host = 'api.frankfurter.app';
            fetch(`https://${host}/currencies`)
            .then((data) => data.json())
            .then((data) => {
            const entries = Object.entries(data);
            console.log(entries);
            fillOptions(entries);
            });
            break
        case 2:
            fillOptions(Length_Units);
            break
        case 3:
            fillOptions(Mass_Units);
            break
        case 4:
            fillOptions(Speed_Units);
            break
        case 5:
            fillOptions(Temp_Units);
            break
        case 6:
            fillOptions(Time_Units);
            break
        case 7:
            fillOptions(Volume_Units);
            break
    }
    
}

//--------------------conversion methods-----------------------------------------
/**
 * Area converter method
 * @param {int} v1 value to be converted
 * @param {*} u1 value of selected option in unit1 selector
 * @param {*} u2 value of selected option in unit2 selector
 * @returns int v2, (v1 converted from u1 to u2)
 */
function convertArea(v1, u1, u2){
//convert everything to 1 (square metre)
    switch(u1){
        case "0": //In km^2
            v1 *= 1e6;
            break;
        case "2"://In mile^2
            v1 *=  2.59e6;
            break;
        case "3"://In yard^2
            v1 /= 1.196;
            break;
        case "4"://In foot^2
            v1 /= 10.764;
            break;
        case "5"://In inch^2
            v1 *= 0.00064516;
            break;
        case "6"://In hectare
            v1 *= 10000;
            break;
        case "7"://In acre
            v1 *= 4046.86;
            break;
    }
//now convert everything from m^2 to unit2
    switch(u2){
        case "0": //In km^2
            return v1 / 1e6;
        case "1": //In m^2
            return v1;
        case "2"://In mile^2
            return v1 /  2.59e6;
        case "3"://In yard^2
            return v1 * 1.196;
        case "4"://In foot^2
            return v1 * 10.764;
        case "5"://In inch^2
            return v1 / 0.00064516;
        case "6"://In hectare
            return v1 / 10000;
        case "7"://In acre
            return v1 / 4046.86;
    }
}
/**
 * Currency converter method
 * speciallized as it uses an api 
 * @param {*} bool same as in callConvert
 */
function convertCurrency(bool){
    let u1 = unit1.value;
    let u2 = unit2.value;
    let v1;
    //if top box is the input
    if(bool){
        v1= value1.value;
        const host = 'api.frankfurter.app';
        fetch(`https://${host}/latest?amount=${v1}&from=${u1}&to=${u2}`)
        .then((val) => val.json())
        .then((val) => {
            //update appropriate field with output value
            value2.value = Object.values(val.rates)[0];
        });
    }
    //if bottom box is the input
    else {
        v1= value2.value;
        const host = 'api.frankfurter.app';
        fetch(`https://${host}/latest?amount=${v1}&from=${u2}&to=${u1}`)
        .then((val) => val.json())
        .then((val) => {
            //update appropriate field with output value
            value1.value = Object.values(val.rates)[0];
        });
    }

    //use the api to convert v1 from u1 to u2
    
}

/**
 * Length converter method
 * @param {int} v1 value to be converted
 * @param {*} u1 value of selected option in unit1 selector
 * @param {*} u2 value of selected option in unit2 selector
 * @returns int v2, (v1 converted from u1 to u2)
 */
function convertLength(v1, u1, u2){
//convert everything to 1(metre)
    switch(u1){
        case "0": //In km
            v1 *= 1000;
            break;
        case "2"://In cm
            v1 /= 100;
            break;
        case "3"://In mm
            v1 /= 1000;
            break;
        case "4"://In micrometre
            v1 /=  1e6;
            break;
        case "5"://In nm
            v1 /= 1e9;
            break;
        case "6"://In mile
            v1 *= 1609.34;
            break;
        case "7"://In yard
            v1 *= 0.9144;
            break;
        case "8"://In foot
            v1 *= 0.3048;
            break;
        case "9"://In inch
            v1 /= 39.37;
            break;
        case "10"://In nautical mile
            v1 *= 1852;
            break;
    }

    //convert everything to unit 2
    switch(u2){
        case "0": //In km
            return v1 / 1000;
        case "1":
            return v1;
        case "2"://In cm
            return v1 * 100;
        case "3"://In mm
            return v1 * 1000;
        case "4"://In micrometre
            return v1 * 1e6;
        case "5"://In nm
            return v1 * 1e9;
        case "6"://In mile
            return v1 / 1609.34;
        case "7"://In yard
            return v1 / 0.9144;
        case "7"://In foot
            return v1 / 0.3048;
        case "7"://In inch
            return v1 * 39.37;
        case "7"://In nautical mile
            return v1 / 1852;
    }
}

/**
 * Mass converter method
 * @param {int} v1 value to be converted
 * @param {*} u1 value of selected option in unit1 selector
 * @param {*} u2 value of selected option in unit2 selector
 * @returns int v2, (v1 converted from u1 to u2)
 */
function convertMass(v1, u1, u2){ 
    //convert everything to 1(kg)
    switch(u1){
        case "0": //In tonne
            v1 *= 1000;
            break;
        case "2"://In g
            v1 /= 1000;
            break;
        case "3"://In mg
            v1 /= 1e6;
            break;
        case "4"://In microgram
            v1 /=  1e9;
            break;
        case "5"://In imperial ton
            v1 *= 1016.05;
            break;
        case "6"://In US ton
            v1 *= 9077.185;
            break;
        case "7"://In Stone
            v1 *= 6.35029;
            break;
        case "8"://In lbs
            v1 *= 0.45359237;
            break;
        case "9"://In oz
            v1 /= 35.274;
            break;
    }
    //convert v1 to desired unit
    switch(u2){
        case "0": //In tonne
            return v1 / 1000;
        case "1": //In kg
            return v1;
        case "2"://In g
            return v1 * 1000;
        case "3"://In mg
            return v1 * 1e6;
        case "4"://In microgram
            return v1 *  1e9;
        case "5"://In imperial ton
            return v1 / 1016.05;
        case "6"://In US ton
            return v1 / 9077.185;
        case "7"://In Stone
            return v1 / 6.35029;
        case "8"://In lbs
            return v1 / 0.45359237;
        case "9"://In oz
            return v1 * 35.274;
    }
}

/**
 * Speed converter method
 * @param {int} v1 value to be converted
 * @param {*} u1 value of selected option in unit1 selector
 * @param {*} u2 value of selected option in unit2 selector
 * @returns int v2, (v1 converted from u1 to u2)
 */
function convertSpeed(v1, u1, u2){
    //convert everything to 3 (km/h)
    switch(u1){
        case "0"://in mi/h
            v1 *= 1.60934;
            break;
        case "1": //In f/s
            v1 *= 1.09728;
            break;
        case "2"://In m/s
            v1 *= 3.6;
            break;
        case "4"://In knot
            v1 *= 1.852;
            break;
    }
    //convert everything to unit 2
    switch(u2){
        case "0"://in mi/h
            return v1 / 1.60934;
        case "1": //In f/s
            return v1 / 1.09728;
        case "2"://In m/s
            return v1 / 3.6;
        case "3"://In km/h
            return v1;
        case "4"://In knot
            return v1 / 1.852;
    }
}

/**
 * Temperature converter method
 * @param {int} v1 value to be converted
 * @param {*} u1 value of selected option in unit1 selector
 * @param {*} u2 value of selected option in unit2 selector
 * @returns int v2, (v1 converted from u1 to u2)
 */
function convertTemp(v1, u1, u2){
    console.log("Convert Temp Called");
//convert everything to celsius 
    switch(u1){
        case "1": //In F
            v1 =  (v1 - 32) * 5/9;
            break;
        case "2"://In K
            v1 =  v1 - 273.15;
            break;
    }
//now convert everything from celsius to unit2
    switch(u2){
    case "0"://return C
        return v1;

    case "1"://Return F
        return v1 * 9/5 + 32;

    case "2"://Return K
        return Number(v1) + 273.15
    }
}

/**
 * Time converter method
 * @param {int} v1 value to be converted
 * @param {*} u1 value of selected option in unit1 selector
 * @param {*} u2 value of selected option in unit2 selector
 * @returns int v2, (v1 converted from u1 to u2)
 */
function convertTime(v1, u1, u2){
    console.log("Convert Time Called");
    //convert everything to 3 (sec)
        switch(u1){
            case "0": //In nanosec
                v1 /= 1e9;
                break;
            case "1"://In microsec
                v1 /=  1e6;
                break;
            case "2"://In millisec
                v1 /= 1000;
                break;
            case "4"://In min
                v1 *= 60;
                break;
            case "5"://In hour
                v1 *= 3600;
                break;
        }
    //now convert everything from sec to unit2
        switch(u2){
            case "0": //In nanosec
                return v1 *= 1e9;
            case "1"://In microsec
                return v1 *=  1e6;
            case "2"://In millisec
                return v1 *= 1000;
            case "3"://In sec
                return v1;
            case "4"://In min
                return v1 / 60;
            case "5"://In hour
                return v1 / 3600;
        }
    }

    /**
 * Volume converter method
 * @param {int} v1 value to be converted
 * @param {*} u1 value of selected option in unit1 selector
 * @param {*} u2 value of selected option in unit2 selector
 * @returns int v2, (v1 converted from u1 to u2)
 */
function convertVolume(v1, u1, u2){
 //volume is disabled rn :D
    }