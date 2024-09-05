/*
    Hei.
    Dette er et oppgave sett i MM-912.
    Meningen er å trene på et fåtall ting av gangen. 
    Du gjør dette ved å skrive inn ditt svar etter at en oppgave er gitt (se på eksempelet)
*/

/*
    Oppgave: Eksempel
    Lag en variabel som skal kunne endres. Variabelen skal representer din alder
*/

let myAge = 42;

/*
    Oppgave: A
    Lag en variabel som representerer ditt fornavn.
*/
const mittFornavn= "Aleksander"

/*
    Oppgave: B
    Lag en variabel for å lagre poeng score i et spill
*/
let currentScore= 5

/*
    Oppgave: C
    Øk verdien av variabelen din fra oppgave B med 5 (dvs dersom den var 0 så skal den bli 5)
    NB! Du skal øke verdien, ikke bare sette den til 5 (husk +)
*/
currentScore+=5
console.log(currentScore)

/*
    Oppgave: D
    Ta variabelen din fra oppgave B og gjør den 10 ganger større. 
*/
currentScore*=10
console.log(currentScore)

/*
    Oppgave: E
    Lag en variabel for å lagre et telefon nummer (bruk et fiktift nummer)
*/
let phoneNumber= "+4787127653"
console.log(phoneNumber)

/*
    Oppgave: F
    Lag en variabel som representerer hvorvidt du er en student eller ikke.
*/
let activeStudent=false
console.log("Am I an active student?",activeStudent)
if(activeStudent){
    console.log("The Student is Active")
}else{
    console.log("The student is not an active student")
}
/*
    Oppgave: G
    Skriv koden som skal til for at det skal stå noe alla "Hei spiller xxxx din score er xx"
    Her skal xxxx være hentet fra variabelen i oppgave A og xx fra variabelen i oppgave B
*/
//let gameInfo="Hei spiller " +mittFornavn+ " din score er "+currentScore
let gameInfo=`Hei Spiller ${mittFornavn} din score er ${currentScore}`
console.log(gameInfo)
/*
    Oppgave: H
    Lag en variabel som skal representere høyest oppnåd score i et spill.
    Set verdien av denne nye variabelen til verdien av variabelen fra oppgave B
*/
//let highScore=currentScore
let highScore=0
highScore=currentScore
console.log(highScore)