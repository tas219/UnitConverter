/**
 * Script file :D
 * last updated: Apr 20 2024
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
        let opt = document.createElement("option");
        opt.text = arr[i];
        opt.value = i;
        unit1.appendChild(opt);
        //for some reason if I try to append option consecutively it only works for the second one
        //making a second option variable fixed it though
        //note sure if there is another fix
        let opt2 = document.createElement("option");
        opt2.text = arr[i];
        opt2.value = i;
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
    if(bool){
        v1 = value1.value;
        v2 = conv_funcs[mode](v1, u1, u2);
        v2 = Math.round(v2*100)/100;
        value2.value = v2;
    }
    else{
        v1 = value2.value;
        v2 = conv_funcs[mode](v1, u2, u1);
        v2 = Math.round(v2*100)/100;
        value1.value = v2;
    }

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
            //currency
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

function convertArea(v1, u1, u2){return 1;}
function convertCurrency(v1, u1, u2){return 1;}
function convertLength(v1, u1, u2){return 1;}
function convertMass(v1, u1, u2){return 1;}
function convertSpeed(v1, u1, u2){return 1;}


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
    //now convert everything from celsius to unit2
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
