//#region 
import * as readlinePromises from 'node:readline/promises';
import fs from "node:fs"
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
//#endregion


import dictionary from './dictionary.mjs';
import { asciiArt, HANGMAN_UI } from './graphics.mjs';
import { COLORS, RESET } from './colors.mjs';

const word = getRandomWord();
let guessedWord = createGuessList(word.length);
let wrongGuesses = [];
let correctGuesses = new Set();
let isGameOver = false;
let totalGuesses = 0;
let correctGuessCount = 0;
let wordGuessed = false;
let languageSelect = "no" // Språk er defaultet til norsk men du får valg om og bytte ved oppstart.
const isStarting = await askToStart();

do {
    updateUI();

    // Gjette en bokstav || ord.  (|| betyr eller).
    let guess = (await rl.question(dictionary[languageSelect].guessPrompt)).toLowerCase();
    totalGuesses++;


    if (correctGuesses.has(guess) || wrongGuesses.includes(guess)) {
        continue;
    }

    if (isWordGuessed(word, guess)) {
        print(dictionary[languageSelect].winCelibration, COLORS.GREEN);
        wordGuessed = true;
        isGameOver = true;
    }
    else if (word.includes(guess)) {

        uppdateGuessedWord(guess);
        correctGuesses.add(guess); // Add correct guess to the set
        correctGuessCount++; // Increment correct guess count

        if (isWordGuessed(word, guessedWord)) {
            print(dictionary[languageSelect].winCelibration, COLORS.GREEN);
            wordGuessed = true;  // Player guessed the word successfully
            isGameOver = true;
            updateUI()
            // Display statistics after the game ends
            print(dictionary[languageSelect].statistics, COLORS.CYAN);
            print(dictionary[languageSelect].totalGuessesMade + totalGuesses, COLORS.WHITE);
            print(dictionary[languageSelect].correctGuessesMade + correctGuessCount, COLORS.GREEN);
            print(dictionary[languageSelect].wrongGuessesMade + wrongGuesses.length, COLORS.RED);

            if (wordGuessed) {
                print(dictionary[languageSelect].congratulations, COLORS.GREEN);
            } else {
                print(dictionary[languageSelect].correctWord + word, COLORS.YELLOW);
            }
        }
    } else {
        print(dictionary[languageSelect].wrongGuesses, COLORS.RED);
        wrongGuesses.push(guess);

        if (wrongGuesses.length >= HANGMAN_UI.length - 1) {
            isGameOver = true;
            updateUI()
            // Display statistics after the game ends
            print(dictionary[languageSelect].statistics, COLORS.CYAN);
            print(dictionary[languageSelect].totalGuessesMade + totalGuesses, COLORS.WHITE);
            print(dictionary[languageSelect].correctGuessesMade + correctGuessCount, COLORS.GREEN);
            print(dictionary[languageSelect].wrongGuessesMade + wrongGuesses.length, COLORS.RED);

            if (wordGuessed) {
                print(dictionary[languageSelect].congratulations, COLORS.GREEN);
            } else {
                print(dictionary[languageSelect].correctWord + word, COLORS.YELLOW);
            }

        }

    }

    // Har du lyst å spille igjen?

} while (isGameOver === false)

process.exit();

function uppdateGuessedWord(guess) {
    for (let i = 0; i < word.length; i++) {
        if (word[i] == guess) {
            guessedWord[i] = guess;
            // Banana og vi tipper a.
            // _ -> a
        }
    }
}

function createGuessList(length) {
    let output = [];
    for (let i = 0; i < length; i++) {
        output[i] = "_";
    }
    return output;
}

function isWordGuessed(correct, guess) {
    for (let i = 0; i < correct.length; i++) {
        if (correct[i] != guess[i]) {
            return false;
        }
    }

    return true;
}

function print(msg, color = COLORS.WHITE) {
    console.log(color, msg, RESET);
}

function updateUI() {

    console.clear();
    print(guessedWord.join(""), COLORS.GREEN);
    print(HANGMAN_UI[wrongGuesses.length]);
    if (wrongGuesses.length > 0) {
        print(dictionary[languageSelect].wrongGuesses + COLORS.RED + wrongGuesses.join() + RESET);
    }
}

function getRandomWord() {

    const words = ["Kiwi", "Car", "Dog", "etwas"];
    let index = Math.floor(Math.random() * words.length);
    return words[index].toLowerCase();

}

async function askToStart() {
    console.log(asciiArt)
    let response = await rl.question(COLORS.YELLOW + dictionary[languageSelect].startGame); //Spørr om du vil starte spillet / endre språk
    response = response.toLowerCase();
    if (response === dictionary[languageSelect].ja) {
        console.log(COLORS.GREEN + dictionary[languageSelect].gamestart);
        return true
    } else if (response === "no") {
        languageSelect = "no";
        return await askToStart()  // spørr på nytt og returner verdien hvis man sier ja    
    } else if (response === "en") {
        languageSelect = "en"
        return await askToStart()  // spørr på nytt og returner verdien hvis man sier ja    
    }
    else {
        console.log(COLORS.RED + dictionary[languageSelect].refuseStart);
        process.exit();
    }
} 
