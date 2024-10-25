//#region 
import * as readlinePromises from 'node:readline/promises';
const rl = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
//#endregion

import { print } from './lib/output.mjs';
import { ANSI } from './lib/ansi.mjs';
import { getRandomItemFromArray } from './lib/random.mjs';
import GAME_DICTIONARY from './dictionary.mjs';
import { start } from 'repl';
import { isAscii } from 'buffer';

const CHOICES = { rock: 1, paper: 2, scissors: 3 };
const LIST_OF_CHOICES = [CHOICES.rock, CHOICES.paper, CHOICES.scissors];
let playAgain; 
let languageSelect="no" // Språk er defaultet til norsk men du får valg om og bytte ved oppstart.
print(ANSI.CLEAR_SCREEN);
print(GAME_DICTIONARY[languageSelect].title, ANSI.COLOR.GREEN);

const isStarting = await askToStart();  //venter til spilleren har svart ja/nei
if (isStarting){
do {
let player = null; // resetter spillervalg
player = await askForPlayerChoice();
let npc = makeAIChoice();

print(`${ANSI.COLOR.GREEN}${GAME_DICTIONARY[languageSelect].youPicked} ${getDesc(player)} 
 ${ANSI.COLOR.RED}${GAME_DICTIONARY[languageSelect].aiPicked} ${getDesc(npc)}`);
print(ANSI.COLOR.GREEN+GAME_DICTIONARY[languageSelect].winner + evaluateWinner(player, npc));

/* Playagain settes i slutten av gameplayloopen for og iverksette askToRestart */
playAgain = await askToRestartGame();
} while (playAgain === "restart"); 
}
// ---- Game functions etc..

function evaluateWinner(p1Ch, p2Ch) {
    // Vi går ut i fra at spiller 2 vinner :)
    let result = ANSI.COLOR.RED+GAME_DICTIONARY[languageSelect].player2;

    // Men vi må sjekke om noe annet skjedde.
    if (p1Ch == p2Ch) {
        result = ANSI.COLOR.YELLOW+GAME_DICTIONARY[languageSelect].draw;
    } else if (p1Ch == CHOICES.rock) {
        if (p2Ch == CHOICES.scissors) {
            result = ANSI.COLOR.GREEN+GAME_DICTIONARY[languageSelect].player1;
        }
    } else if (p1Ch == CHOICES.paper) {
        if (p2Ch == CHOICES.rock) {
            result = ANSI.COLOR.GREEN+GAME_DICTIONARY[languageSelect].player1;
        }
    } else if (p1Ch == CHOICES.scissors) {
        if (p2Ch == CHOICES.paper) {
            result = ANSI.COLOR.GREEN+GAME_DICTIONARY[languageSelect].player1;
        }
    }

    return result;
}

function makeAIChoice() {
    return getRandomItemFromArray(LIST_OF_CHOICES);
}

function getDesc(choice) {
    return GAME_DICTIONARY[languageSelect].choices[choice - 1]
}

async function askForPlayerChoice() {

    let choice = null;

    do {
        print(GAME_DICTIONARY[languageSelect].selectionQuestion, ANSI.COLOR.BLUE);
        let rawChoice = await rl.question("");
        rawChoice = rawChoice.toUpperCase();
        choice = evaluatePlayerChoice(rawChoice);
    } while (choice == null)

    return choice;
}

function evaluatePlayerChoice(rawChoice) {
    let choice = null;

    if (rawChoice == GAME_DICTIONARY[languageSelect].rock) {
        choice = CHOICES.rock;
    } else if (rawChoice == GAME_DICTIONARY[languageSelect].paper) {
        choice = CHOICES.paper;
    } else if (rawChoice == GAME_DICTIONARY[languageSelect].scissors) {
        choice = CHOICES.scissors;
    }
    return choice;
}

async function askToStart() {    
    let response = await rl.question(ANSI.COLOR.YELLOW+GAME_DICTIONARY[languageSelect].startGame); //Spørr om du vil starte spillet / endre språk
    response = response.toLowerCase();
    if (response === GAME_DICTIONARY[languageSelect].ja) {
        console.log(ANSI.COLOR.GREEN+GAME_DICTIONARY[languageSelect].gamestart);
        return true
    } else if (response === "no") {
        languageSelect = "no";           
        return await askToStart()  // spørr på nytt og returner verdien hvis man sier ja    
    } else if (response === "en"){
        languageSelect = "en"
        return await askToStart()  // spørr på nytt og returner verdien hvis man sier ja    
    }
     else {
        console.log(ANSI.COLOR.RED+GAME_DICTIONARY[languageSelect].refuseStart);
        process.exit();}
    } 
    

    async function askToRestartGame() {  //Spørr om du vil restarte spillet etter en runde
        let response = await rl.question(ANSI.COLOR.YELLOW+GAME_DICTIONARY[languageSelect].omstart);
        response = response.toLowerCase();
        if (response === "restart") {     //restarter spillet
            console.log(ANSI.COLOR.WHITE+GAME_DICTIONARY[languageSelect].restartText);
            return "restart"; 
        } else if( response === GAME_DICTIONARY[languageSelect].end) { //avslutter spillet
            console.log(ANSI.COLOR.RED+GAME_DICTIONARY[languageSelect].end);
            process.exit(); // 
        } else {
console.log(ANSI.COLOR.RED+GAME_DICTIONARY[languageSelect].nonValidAnswer) // Gir denne beskjeden om noe annet er skrevet en avslutt / restart 
return await askToRestartGame();    // spørr på nytt og returner verdien hvis man sier ja    
}
    } 

        
    