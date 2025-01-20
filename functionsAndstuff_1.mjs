/* 
    NB! There is absolutly no point to these tasks if you use AI or "google" to solve them.
    The point is to learn and practice, not to get the perfect answer.
*/

/*  Task 1
    Create a function that given an array of integers returns the largers number in the array.
    Do not use any built in functionality, use only basic js.
*/



/*  Task 2
    Create a function that returns an array of n posetive numbers (only integers), where n is given as a parameter.
    The numbers should be unique but not consecutive.
    Do not use any built in functionality for sorting, matching etc. (You may use Random and Math functions)
*/



/*  Task 3
    Create a function that given a string and a pattern returns true if the pattern matches the string.
    Do not use any built in functionality for matching (no regex)etc.

    A pattern is defined as a series of *,n,s and -.
    * matches anything except an empty string.
    n matches any number.
    s matches any string.
    - matches a single space.

    Example:
    pattern: sssss-nnn-*****
    string: "Hello 123 World"

*/




/*  Task 4
    Create a function that reads an indetermind number of integers from the console and returns the sum of the numbers.
*/



/*  Task 5
    Create a function that given a string returns the number of words in the string.
    Do not use any built in functionality for splitting strings etc.
*/



/*  Task 6
    Create the functions that given a color value in hex format reutns the RGB and CMYK values .
    Do not use any built in functionality.

    Hex is defined as #RRGGBB. Where RR, GG and BB are two digit hexadecimal numbers.
    RGB is defined as three integers between 0 and 255.
    CMYK is defined as four floats between 0 and 1.

    The conversion from RGB to CMYK is defined as:
    K = 1 - max(R, G, B) / 255
    C = (1 - R / 255 - K) / (1 - K)
    M = (1 - G / 255 - K) / (1 - K)
    Y = (1 - B / 255 - K) / (1 - K)

    Tip: 
    - You can use int.Parse("FF", System.Globalization.NumberStyles.HexNumber) to convert a hex number to an integer.
    - You can read a substring from a string using str.Substring(startIndex, length)
    - You can return multiple values from a function by using {}.

*/


/*
Task1 
*/
function findLargest(arr) {
    let largest = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > largest) {
            largest = arr[i];
        }
    }
    return largest;
}

console.log(findLargest([1, 45, 32, 98, 24]));

/*
Task2
*/
function generateNumbers(n) {
    let result = [];
    while (result.length < n) {
        let num = Math.floor(Math.random() * 100) + 1;
        let isUnique = true;
        for (let i = 0; i < result.length; i++) {
            if (result[i] === num) {
                isUnique = false;
                break;
            }
        }
        if (isUnique) {
            result.push(num);
        }
    }
    return result;
}
console.log(generateNumbers(5));

/*task3
*/

function patternMatches(pattern, str) {
    let i = 0, j = 0;
    while (i < pattern.length && j < str.length) {
        if (pattern[i] === '*') {
            j++;
        } else if (pattern[i] === 'n') {
            if (str[j] < '0' || str[j] > '9') return false;
            j++;
        } else if (pattern[i] === 's') {
            if (str[j] === ' ' || (str[j] >= '0' && str[j] <= '9')) return false;
            j++;
        } else if (pattern[i] === '-') {
            if (str[j] !== ' ') return false;
            j++;
        } else {
            return false;
        }
        i++;
    }
    return i === pattern.length && j === str.length;
}

console.log(patternMatches('sssss-nnn-*****', 'Hello 123 World'));


/*
Task 4
*/

import readline from 'readline';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function sumIntegers() {
    let sum = 0;

    function ask() {
        rl.question("Enter a number (or type 'exit' to stop): ", (input) => {
            if (input.toLowerCase() === 'exit') {
                console.log("The sum of the numbers is:", sum);
                rl.close();
            } else {
                let num = parseInt(input, 10);
                if (!isNaN(num)) {
                    sum += num;
                } else {
                    console.log("Invalid input, please enter a number.");
                }
                ask();
            }
        });
    }

    ask();
}

console.log(sumIntegers())

/*
Task 5
*/
function countWords(str) {
    let count = 0, inWord = false;
    for (let i = 0; i < str.length; i++) {
        if (str[i] !== ' ' && !inWord) {
            inWord = true;
            count++;
        } else if (str[i] === ' ') {
            inWord = false;
        }
    }
    return count;
}

console.log(countWords("This is an example string."));




