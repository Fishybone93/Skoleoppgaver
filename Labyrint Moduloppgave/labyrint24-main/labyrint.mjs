//#region 
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout
});
//#endregion
import ANSI from "./ANSI.mjs";
import KeyBoardManager from "./keyboardManager.mjs";
import "./prototypes.mjs"
import { level1, level2 } from "./levels.mjs";

const FPS = 250; // 60 frames i sekundet sån sirkus..
let rawLevel = level1;

// Brettet som er lastet inn er i form av tekst, vi må omgjøre teksten til en 
// to dimensjonal liste [][] for å kunne tolke hva som er hvor etc.
let tempLevel = rawLevel.split("\n");
let level = [];
for (let i = 0; i < tempLevel.length; i++) {
    let row = tempLevel[i];
    let outputRow = row.split("");
    level.push(outputRow);
}

// Dette er farge palleten for de ulike symbolene, brukes når vi skriver dem ut.
let pallet = {
    "█": ANSI.COLOR.LIGHT_GRAY,
    "H": ANSI.COLOR.RED,
    "$": ANSI.COLOR.YELLOW,
    "B": ANSI.COLOR.GREEN,
    "D": ANSI.COLOR.MAGENTA,
    "+": ANSI.COLOR.RED,
}


let isDirty = true; // For å ungå at vi tegner på hver oppdatering (kan skape flimring) så bruker vi denne variabelen til å indikere at det skal tegnes på nytt,

// Hvor er spilleren på brettet. Dersom row og col er null så kan vi anta at vi akkurat har lastet brettet.
let playerPos = {
    row: null,
    col: null,
}

// Konstanter for ulike elementer av spillet. 
const EMPTY = " ";
const HERO = "H";
const LOOT = "$";
const DOOR = "D";
const HEART = "+";
const THINGS = [LOOT, EMPTY, DOOR, HEART];
const BAD_THINGS = ["B"];
const NPCs = [];
const POSSIBLE_PICKUPS = [
    { name: "Sword", attribute: "attack", value: 5 },
    { name: "Spear", attribute: "attack", value: 3 },
]
const HP_MAX = 10;
const MAX_ATTACK = 2;
const playerStats = { hp: HP_MAX, cash: 0, attack: 1.1 }
const MIN_ENEMY_DAMAGE = 0;
const MAX_ENEMY_DAMAGE = 2;
let eventText = ""; // Dersom noe intreffer så vil denne variabelen kunne brukes til å fortelle spilleren om det
const LOOT_PROBABILITY = 0.95;
const MIN_LOOT_AMOUNT = 3;
const MAX_LOOT_AMOUNT = 7;
const GAME_OVER_TEXT = `
 ██████   █████  ███    ███ ███████      ██████  ██    ██ ███████ ██████  
██       ██   ██ ████  ████ ██          ██    ██ ██    ██ ██      ██   ██ 
██   ███ ███████ ██ ████ ██ █████       ██    ██ ██    ██ █████   ██████  
██    ██ ██   ██ ██  ██  ██ ██          ██    ██  ██  ██  ██      ██   ██ 
 ██████  ██   ██ ██      ██ ███████      ██████    ████   ███████ ██   ██ 
`;
const EVENT_TEXT_PERSIST = 2;
let eventTextCounter = 0;
const MIN_HEAL = 2;
const MAX_HEAL = 4;

// I dette spillet brukker vi ikke en vanlig loop til å kjøre spill logikken vår.
// Men setInterval funksjonen virker litt på samme måte som en loop, bare at den venter x antall millisekunder mellom hver gang den utfører koden vår.
let gl = setInterval(gameLoop, FPS)

function update() {

    // Denne testen spør egentlig, er brettet akkurat lastet inn?
    if (playerPos.row == null) {

        // Vi iterere over alle rader
        for (let row = 0; row < level.length; row++) {
            // Vi iterere over alle koloner
            for (let col = 0; col < level[row].length; col++) {

                // For hver celle ([rad][kolone]) sjekker vi om det er noe for oss å håndtere.

                let value = level[row][col];
                if (value == "H") { // Dersom verdien er H, da har vi funnet helten vår
                    playerPos.row = row;
                    playerPos.col = col;

                } else if (BAD_THINGS.includes(value)) { // Posisjonen inneholder en "fiende" da må vi gi fienden noen stats for senere bruk

                    let hp = Math.round(Math.random() * 6) + 4;
                    let attack = 0.7 + Math.random();
                    let badThing = { hp, attack, row, col };
                    NPCs.push(badThing);
                }
            }
        }
    }


    let drow = 0; // variabel for spillerens ønskede endring vertikalt
    let dcol = 0; // varianel for spillerens ænskede endring horizontalt. 

    // Nå sjekker vi om spilleren har prøvd å bevege seg vertikalt
    if (KeyBoardManager.isUpPressed()) {
        drow = -1;
    } else if (KeyBoardManager.isDownPressed()) {
        drow = 1;
    }
    // Nå sjekker vi horisontalt 
    if (KeyBoardManager.isLeftPressed()) {
        dcol = -1;
    } else if (KeyBoardManager.isRightPressed()) {
        dcol = 1;
    }

    // Så bruker vi den ønskede endringen til å kalulere ny posisjon på kartet.
    // Merk at vi ikke flytter spilleren dit enda, for det er ikke sikkert det er mulig.
    let tRow = playerPos.row + (1 * drow);
    let tCol = playerPos.col + (1 * dcol);

    if (THINGS.includes(level[tRow][tCol])) { // Er det en gjenstand der spilleren prøver å gå?

        let currentItem = level[tRow][tCol];
        if (currentItem === LOOT) {

            if (Math.random() < LOOT_PROBABILITY) { // 95% av tiden gir vi "cash" som loot
                let loot = Math.floor(Math.random() * (MAX_LOOT_AMOUNT - MIN_LOOT_AMOUNT + 1)) + MIN_LOOT_AMOUNT; // Tilfeldig beløp mellom 3 og 7
                playerStats.cash += loot;
                setEventText(`Spilleren fikk ${loot}$`); // Vi bruker eventText til å fortelle spilleren hva som har intruffet.
            } else { // i 5% av tilfellen tildeler vi en tilfeldig gjenstand fra listen over gjenstander. 
                let item = POSSIBLE_PICKUPS.random();
                playerStats.attack += item.value;
                setEventText(`Spilleren fant en ${item.name}, ${item.attribute} er endret med ${item.value}`); // Vi bruker eventText til å fortelle spilleren hva som har intruffet.
            }
        } else if (currentItem === DOOR) {
            // Load level 2
            rawLevel = level2;

            // Reset level array
            tempLevel = rawLevel.split("\n");
            level = [];
            for (let i = 0; i < tempLevel.length; i++) {
                let row = tempLevel[i];
                let outputRow = row.split("");
                level.push(outputRow);
            }

            // Finn og sett ny spillerposisjon
            playerPos = findHeroPosition(level);

            setEventText("Spilleren gikk gjennom døren til neste nivå!");
            isDirty = true;
        } else if (currentItem === HEART) {
            const healAmount = Math.floor(Math.random() * (MAX_HEAL - MIN_HEAL + 1)) + MIN_HEAL;
            playerStats.hp = Math.min(HP_MAX, playerStats.hp + healAmount);
            setEventText(`Spilleren fant et hjerte og ble helbredet for ${healAmount} HP!`);
            isDirty = true;
        }

        level[playerPos.row][playerPos.col] = EMPTY; // Der helten står nå settes til tom 
        level[tRow][tCol] = HERO; // Den nye plaseringen på kartet settes til å inneholde helten

        // Oppdaterer heltens posisjon
        playerPos.row = tRow;
        playerPos.col = tCol;

        // Sørger for at vi tegner den nye situasjonen. 
        isDirty = true;
    } else if (BAD_THINGS.includes(level[tRow][tCol])) {
        // Spilleren har forsøkt å gå inn der hvor det står en "motstander"

        // Finner motstanderen
        let antagonist = null;
        for (let i = 0; i < NPCs.length; i++) {
            let b = NPCs[i];
            if (b.row === tRow && b.col === tCol) {
                antagonist = b;
                break;
            }
        }

        // Beregner skade spilleren påfører motstanderen
        let playerAttack = ((Math.random() * MAX_ATTACK) * playerStats.attack).toFixed(2);
        antagonist.hp -= playerAttack;

        // Beregner motstanderens motangrep
        let enemyDamage = Math.floor(Math.random() * (MAX_ENEMY_DAMAGE - MIN_ENEMY_DAMAGE + 1)) + MIN_ENEMY_DAMAGE;
        playerStats.hp -= enemyDamage;

        // Oppdaterer eventText med både spiller og motstander skade
        setEventText(`Spilleren påførte ${playerAttack} poeng skade og mottok ${enemyDamage} poeng skade tilbake!`);

        // Sørger for at HUD oppdateres
        isDirty = true;
    }
}

function draw() {
    let rendring = "";
    rendring += renderHUD();

    // Hovedspillets rendering
    for (let row = 0; row < level.length; row++) {
        let rowRendering = "";
        for (let col = 0; col < level[row].length; col++) {
            let symbol = level[row][col];
            if (pallet[symbol] !== undefined) {
                rowRendering += pallet[symbol] + symbol + ANSI.COLOR_RESET;
            } else {
                rowRendering += symbol;
            }
        }
        rowRendering += "\n";
        rendring += rowRendering;
    }

    // Visk ut og render på nytt
    console.clear();
    console.log(rendring);

    // Modifisert event-text håndtering
    if (eventText !== "") {
        console.log(eventText);
        if (eventTextCounter > 0) {
            eventTextCounter--;
        }
        if (eventTextCounter <= 0) {
            eventText = "";
            eventTextCounter = 0;
        }
    }

    isDirty = false;
}

// Når man setter en eventtekst, tilbakestiller man telleren:
function setEventText(text) {
    eventText = text;
    eventTextCounter = EVENT_TEXT_PERSIST;
}

function renderHUD() {
    const currentHP = Math.max(0, Math.min(HP_MAX, Math.round(playerStats.hp)));

    if (currentHP <= 0) {
        return "";
    }

    // Regner ut fulle / tomme hjerter
    const filledHearts = Math.ceil(currentHP / 1); // 1 heart = 10 HP
    const emptyHearts = Math.floor((HP_MAX - currentHP) / 10);

    // Skaper en helse-bar med fargede hjerter.
    const hpBar = `[${ANSI.COLOR.RED}${pad(filledHearts, "❤️")}${ANSI.COLOR_RESET}${ANSI.COLOR.BLUE}${pad(emptyHearts, "❤️")}${ANSI.COLOR_RESET}]`;

    // Viser hvor mye penger spilleren har
    const cash = `$:${playerStats.cash}`;

    return `${hpBar} HP:${currentHP}/${HP_MAX} ${cash}\n`;
}

function pad(len, text) {
    return text.repeat(Math.max(0, len));
}

function gameLoop() {
    if (playerStats.hp <= 0) {
        console.clear();
        console.log(GAME_OVER_TEXT);
        console.log("\nSPILLEREN HAR 0 HP!");
        clearInterval(gl); // Stopper spill loopen ved game over
        return;
    }

    update();

    // Oppdater kun om noe er forandret
    if (isDirty) {
        draw();
    }
}

function findHeroPosition(levelArray) {
    for (let row = 0; row < levelArray.length; row++) {
        for (let col = 0; col < levelArray[row].length; col++) {
            if (levelArray[row][col] === HERO) {
                return { row, col };
            }
        }
    }
    return { row: null, col: null };
}