import test from "./test.mjs";

/*
    There is a function sum that takes two parameters of type number.
    The function is to return the sum of the numbers received.
    If one or more of the parameters are not valid numbers, then return NaN (Not a Number).

    Using the included test "framework", do the following: 
    - Write the tests (within the tests region of this document) that correspond to the description of the function.
    
    Then finally:
    - Complete the logic of the function.
*/

//#region function -----------------------------------------------------------------
// Write your function her.
function sum(a, b) {
    // Check if both parameters are numbers
    if (isNaN(a) || isNaN(b) || typeof a !== "number" || typeof b !== "number") {
        return NaN;
    }
    // Return the sum of the numbers
    return a + b;
}

//#endregion

//#region Tests --------------------------------------------------------------------
// Write your tests her.

const tests = test("Sum function");

// Valid inputs
tests.isEqual(sum(1, 2), 3, "Sum of 1 and 2 should be 3");
tests.isEqual(sum(-5, 5), 0, "Sum of -5 and 5 should be 0");
tests.isEqual(sum(2.5, 3.5), 6, "Sum of 2.5 and 3.5 should be 6");

// Invalid inputs
tests.isNotANumber(sum("1", 2), 'Sum of "1" and 2 should return NaN');
tests.isNotANumber(sum(1, null), "Sum of 1 and null should return NaN");
tests.isNotANumber(sum(undefined, 3), "Sum of undefined and 3 should return NaN");
tests.isNotANumber(sum(NaN, 3), "Sum of NaN and 3 should return NaN");

// Edge cases
tests.isEqual(sum(0, 0), 0, "Sum of 0 and 0 should be 0");
tests.isEqual(sum(Infinity, 1), Infinity, "Sum of Infinity and 1 should be Infinity");
tests.isEqual(sum(-Infinity, 1), -Infinity, "Sum of -Infinity and 1 should be -Infinity");

//#endregion