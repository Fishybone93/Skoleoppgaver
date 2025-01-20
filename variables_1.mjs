/*
    NB! There is absolutely no point to these tasks if you use AI or "google" to solve them.
    The point is to learn and practice, not to get the perfect answer.
*/

/* Task 1
    Declare two variables, set the value of the first variable to 1 and the value of the second to 2.
    Now swap so the first variable gets the value of the second and vice versa.
*/


/* Task 2
    Without using built-in Math functionality or constants in JavaScript.
    Calculate the area of a circle with the radius 6.
*/


/* Task 3
    Given the two strings "If at first you do not succeed, try, try again" and "Fall seven times, stand up eight".
    Create a variable that contains all the letters that are in both strings but only once and in alphabetical order.
    Consider 'A' and 'a' the same letter.
*/

/* Task 4
    Declare three variables. The first two should have the values 6 and 2.
    Make it so that the third variable is 10.
*/


/* Task 5
    Given a variable set to a random floating point value (you pick the value).
    Instantiate a second variable that is true if the first variable is greater than 22.34.
*/


/* Task 6
    Given the string "Life is short. Smile while you still have teeth." and the string "The best therapy is a good laugh and great friends.".
    Create a new variable that is the intersection of words between the two strings.
    Create a new variable that is the union of words between the two strings.
*/

let first = 1;
let second = 2;
let temp = first;
first = second;
second = temp;

let radius = 6;
let pi = 22 / 7;
let area = pi * radius * radius;
console.log("The area of the circle with radius", radius, "is:", area);

let streng1 = "If at first you do not succeed, try, try again";
let streng2 = "Fall seven times, stand up eight";
let combined = (streng1 + streng2).toLowerCase();
let uniqueLetters = [...new Set(combined.replace(/[^a-z]/g, ''))];
uniqueLetters.sort();

let num1 = 6;
let num2 = 2;
let num3 = num1 + num2 + 2;
console.log("The third variable is:", num3);

let randomValue = 18.75;
let isGreater = randomValue > 22.34;
console.log("Random value is:", randomValue);
console.log("Is the random value greater than 22.34?", isGreater);

let string1 = "Life is short. Smile while you still have teeth.";
let string2 = "The best therapy is a good laugh and great friends.";
let words1 = new Set(string1.toLowerCase().replace(/[^\w\s]/g, '').split(' '));
let words2 = new Set(string2.toLowerCase().replace(/[^\w\s]/g, '').split(' '));
let intersection = [...words1].filter(word => words2.has(word));
let union = [...new Set([...words1, ...words2])];

console.log(union)