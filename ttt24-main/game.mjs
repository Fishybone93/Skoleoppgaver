//#region
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout
});
//#endregion
/*
let brett = [
    [1, -1, 1],
    [-1, -1, -1],
    [1, 1, 0],
];*/

import ANSI from "./ANSI.mjs"
import { dir } from "console";
let brett = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

const spiller1 = 1;
const spiller2 = -1;
let spiller1Navn = "Spiller 1(X)";
let spiller2Navn = "Spiller 2(O)";
let resultatAvSpill = "";
let spiller = spiller1;
let isGameOver = false;

async function resetGame() {
    brett = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    spiller = spiller1;
    isGameOver = false;
    resultatAvSpill = "";
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    visBrett(brett);
    const rename = await rl.question("Vil du gi nye navn til spillerne? (j/n): ");
    if (rename.toLowerCase() === 'j') {
        await navngiSpillere();
    }
}

function isValidMove(input) {
    // Sjekker om input er r eller q
    if (input.toLowerCase() === 'r' || input.toLowerCase() === 'q' || input.toLowerCase() === 'n') {
        return true;
    }

    // Sjekker om input er rad,kolonne
    const parts = input.split(',');
    if (parts.length !== 2) return false;

    const rad = parseInt(parts[0]);
    const kolone = parseInt(parts[1]);

    // Sjekker om det er et gyldig tall for kolonnene
    if (isNaN(rad) || isNaN(kolone)) return false;
    if (rad < 1 || rad > 3 || kolone < 1 || kolone > 3) return false;

    // Sjekk om posisjonen er ledig
    if (brett[rad - 1][kolone - 1] !== 0) return false;

    return true;
}

while (true) {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    visBrett(brett);
    if (!isGameOver) {
        console.log(`Det er ${spillerNavn()} sin tur`);
        console.log("Skriv 'r' for å starte på nytt, 'q' for å avslutte, eller 'n' for å endre navn");
        let pos;
        do {
            try {
                pos = await rl.question("Hvor setter du merket ditt? (rad,kolone): ");

                // Handle restart
                if (pos.toLowerCase() === 'r') {
                    resetGame();
                    continue;
                }

                // Handle quit
                if (pos.toLowerCase() === 'q') {
                    console.log("Takk for spillet!");
                    process.exit();
                }

                // Handle rename
                if (pos.toLowerCase() === 'n') {
                    await navngiSpillere();
                    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
                    visBrett(brett);
                    continue;
                }
                if (!isValidMove(pos)) {
                    console.log("Ugyldig trekk! Vennligst skriv rad,kolone (f.eks. '1,2')");
                    continue;
                }

                const [rad, kolone] = pos.split(',').map(num => parseInt(num) - 1);
                brett[rad][kolone] = spiller;
                break;

            } catch (error) {
                console.log("Noe gikk galt. Prøv igjen med format: rad,kolone (f.eks. '1,2')");
            }
        } while (true);

        let vinner = harNoenVunnet(brett);
        if (vinner != 0) {
            isGameOver = true;
            resultatAvSpill = `Vinneren er ${spillerNavn(vinner)}`;
        } else if (erSpilletUavgjort(brett)) {
            resultatAvSpill = "Det ble uavgjort";
            isGameOver = true;
        }
        byttAktivSpiller();
    } else {
        console.log(resultatAvSpill);
        console.log("Game Over");
        console.log("Skriv 'r' for å starte på nytt eller 'q' for å avslutte");

        const answer = await rl.question("Hva vil du gjøre? ");
        if (answer.toLowerCase() === 'r') {
            resetGame();
        } else if (answer.toLowerCase() === 'q') {
            console.log("Takk for spillet!");
            process.exit();
        }
    }
}
//#endregion---------------------------------------------------------------------------------------

function harNoenVunnet(brett) {
    for (let rad = 0; rad < brett.length; rad++) {
        let sum = 0;
        for (let kolone = 0; kolone < brett.length; kolone++) {
            sum += brett[rad][kolone];
        }
        if (Math.abs(sum) == 3) {
            return sum / 3;
        }
    }

    for (let kolone = 0; kolone < brett.length; kolone++) {
        let sum = 0;
        for (let rad = 0; rad < brett.length; rad++) {
            sum += brett[rad][kolone];
        }
        if (Math.abs(sum) == 3) {
            return sum / 3;
        }
    }

    // Sjekk diagonalen fra høyre til venstre
    let diagonal1Sum = 0;
    for (let i = 0; i < brett.length; i++) {
        diagonal1Sum += brett[i][i];
    }
    if (Math.abs(diagonal1Sum) == 3) {
        return diagonal1Sum / 3;
    }

    // Sjekk diagonalen fra venstre til høyre
    let diagonal2Sum = 0;
    for (let i = 0; i < brett.length; i++) {
        diagonal2Sum += brett[i][brett.length - 1 - i];
    }
    if (Math.abs(diagonal2Sum) == 3) {
        return diagonal2Sum / 3;
    }

    return 0;
}

function erSpilletUavgjort(brett) {

    // Dersom alle felter er fylt så er spillet over. 
    for (let rad = 0; rad < brett.length; rad++) {
        for (let kolone = 0; kolone < brett[rad].length; kolone++) {
            if (brett[rad][kolone] == 0) { // Dersom vi finner 0 på rad,kolonne så er ikke brettet fylt.
                return false;
            }
        }
    }

    return true;

}

function visBrett(brett) {

    console.log("    1   2   3");

    for (let i = 0; i < brett.length; i++) {
        const rad = brett[i];

        let visningAvRad = (i + 1) + " ";


        visningAvRad += "┌───┐";
        for (let j = 1; j < rad.length; j++) {
            visningAvRad += "┌───┐";
        }
        visningAvRad += "\n  ";


        for (let j = 0; j < rad.length; j++) {
            let verdi = rad[j];
            if (verdi == 0) {
                visningAvRad += "│   │";
            } else if (verdi == spiller1) {
                visningAvRad += "│" + ANSI.COLOR.GREEN + " X " + ANSI.COLOR_RESET + "│";
            } else {
                visningAvRad += "│" + ANSI.COLOR.RED + " O " + ANSI.COLOR_RESET + "│";
            }
        }
        visningAvRad += "\n  ";


        visningAvRad += "└───┘";
        for (let j = 1; j < rad.length; j++) {
            visningAvRad += "└───┘";
        }
        visningAvRad += "\n";

        console.log(visningAvRad);
    }
}

function spillerNavn(sp = spiller) {
    if (sp == spiller1) {
        return spiller1Navn;
    } else {
        return spiller2Navn;
    }
}

function byttAktivSpiller() {
    spiller = spiller * -1;
    /* if (spiller == spiller1) {
         spiller = spiller2
     } else {
         spiller = spiller1;
     }*/
}

async function navngiSpillere() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    spiller1Navn = await rl.question("Skriv navn for Spiller 1 (X): ");
    if (!spiller1Navn.trim()) spiller1Navn = "Spiller 1(X)";

    spiller2Navn = await rl.question("Skriv navn for Spiller 2 (O): ");
    if (!spiller2Navn.trim()) spiller2Navn = "Spiller 2(O)";

    console.log(`Spillerne er nå ${spiller1Navn} og ${spiller2Navn}`);
}
