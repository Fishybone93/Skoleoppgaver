import test from "./test.mjs";

/*
    Challenge: Implement the `multiply` function.

    The function `multiply` takes an indefinit number of parameters (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
    It should return the product of the numbers, with the following constraints:

    1. If one or more of the parameters are not valid numbers, the function should return NaN (Not a Number).
    2. If either parameter is a string that can be converted to a number (e.g., "3"), it should be parsed into a number before multiplying.
    3. If either parameter is Infinity or -Infinity, return Infinity or -Infinity based on the rules of multiplication.
    4. Handle edge cases like multiplying by 0 and NaN appropriately.

    Your task:
    1. Write the tests (within the tests region) that correspond to the described behavior.
    2. Complete the logic of the `multiply` function to pass all the tests.

*/

//#region function -----------------------------------------------------------------
// Write your function her.
//#region functions
function multiply(...args) {
    let product = 1;
    for (const arg of args) {
        let num;
        if (typeof arg === "string") {
            num = Number(arg);
            if (isNaN(num)) return NaN;
        } else if (typeof arg === "number") {
            num = arg;
            if (isNaN(num)) return NaN;
        } else {
            return NaN;
        }
        product *= num;
    }
    return product;
}
//#endregion

//tests
function logIsEqual(received, expected, description) {
    if (typeof received === "number" && typeof expected === "number") {
        if (isNaN(received) && isNaN(expected)) {
            console.log(`🟢 ${description}`);
            return;
        }
    }
    if (received === expected) {
        console.log(`🟢 ${description}`);
    } else {
        console.log(`🔴 ${description}. Expected ${expected}, received ${received}`);
    }
}

logIsEqual(multiply(2, 3), 6, "Test 1: multiply(2, 3) should equal 6");
logIsEqual(multiply("2", "3"), 6, 'Test 2: multiply("2", "3") should equal 6');
logIsEqual(multiply(2, "3"), 6, 'Test 3: multiply(2, "3") should equal 6');
logIsEqual(multiply(0, 5), 0, "Test 4: multiply(0, 5) should equal 0");
logIsEqual(multiply(Infinity, 2), Infinity, "Test 5: multiply(Infinity, 2) should equal Infinity");
logIsEqual(multiply(-Infinity, 2), -Infinity, "Test 6: multiply(-Infinity, 2) should equal -Infinity");
logIsEqual(multiply("not a number", 3), NaN, 'Test 7: multiply("not a number", 3) should return NaN');
logIsEqual(multiply(2, NaN), NaN, "Test 8: multiply(2, NaN) should return NaN");
logIsEqual(multiply(), 1, "Test 9: multiply() should equal 1");
logIsEqual(multiply(2, "3a"), NaN, 'Test 10: multiply(2, "3a") should return NaN');
logIsEqual(multiply("2", 3, "4"), 24, 'Test 11: multiply("2", 3, "4") should equal 24');
logIsEqual(multiply(-2, 3), -6, "Test 12: multiply(-2, 3) should equal -6");
logIsEqual(multiply(2, true), NaN, "Test 13: multiply(2, true) should return NaN");

console.log("All tests completed!");
//#endregion