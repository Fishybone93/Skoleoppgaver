import test from "./test.mjs";

/*
    Challenge: Implement the `formatName` function.

    The function `formatName` takes a single parameter `name` (a string) and formats it based on the following rules:

    1. If `name` is not a string, return null.
    2. Remove any leading or trailing whitespace from the string.
    3. Capitalize the first letter of each word in the name (e.g., "john doe" becomes "John Doe").
    4. If the string is empty (after trimming), return an empty string.
    5. If the string contains special characters (e.g., "@", "#", etc.), return null.

    Your task:
    1. Write the tests (within the tests region) that correspond to the described behavior.
    2. Complete the logic of the `formatName` function to pass all the tests.

*/

//#region function -----------------------------------------------------------------
// Write your function her.

function formatName(name) {
    if (typeof name !== "string") return null;
    const trimmed = name.trim();
    if (trimmed === "") return "";
    if (!/^[A-Za-z\s]+$/.test(trimmed)) return null;
    return trimmed
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
//#endregion

//#region tests
function logIsEqual(received, expected, description) {
    if (typeof received === "string" && typeof expected === "string") {
        if (received === expected) {
            console.log(`🟢 ${description}`);
            return;
        }
        console.log(`🔴 ${description}. Expected "${expected}", received "${received}"`);
        return;
    }
    if (received === expected) {
        console.log(`🟢 ${description}`);
    } else {
        console.log(`🔴 ${description}. Expected ${expected}, received ${received}`);
    }
}

logIsEqual(formatName("ola nordmann"), "Ola Nordmann", 'Test 1: formatName("ola nordmann") should equal "Ola Nordmann"');
logIsEqual(formatName("  kari   nordmann "), "Kari Nordmann", 'Test 2: formatName("  kari   nordmann ") should equal "Kari Nordmann"');
logIsEqual(formatName(""), "", 'Test 3: formatName("") should equal ""');
logIsEqual(formatName("   "), "", 'Test 4: formatName("   ") should equal ""');
logIsEqual(formatName(123), null, 'Test 5: formatName(123) should return null');
logIsEqual(formatName("ola@nordmann"), null, 'Test 6: formatName("ola@nordmann") should return null');
logIsEqual(formatName("ola#nordmann"), null, 'Test 7: formatName("ola#nordmann") should return null');
logIsEqual(formatName("OLA nordmann"), "Ola Nordmann", 'Test 8: formatName("OLA nordmann") should equal "Ola Nordmann"');
logIsEqual(formatName("per hansen"), "Per Hansen", 'Test 9: formatName("per hansen") should equal "Per Hansen"');
logIsEqual(formatName("lars O'Reilly"), null, 'Test 10: formatName("lars O\'Reilly") should return null');
logIsEqual(formatName("Kari Nordmann"), "Kari Nordmann", 'Test 11: formatName("Kari Nordmann") should equal "Kari Nordmann"');

console.log("All tests completed!");
//#endregion