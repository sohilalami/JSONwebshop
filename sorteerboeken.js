let xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        sortBookObjects.data = JSON.parse(this.responseText);
        sortBookObjects.addJSDate();

        //caps
        sortBookObjects.data.forEach( boek => {
        boek.titelUpper = boek.titel.toUpperCase();
        //naam schrijvers 
        boek.sortAuteur = boek.auteur[0];

        });

       //sorteer boeken
        sortBookObjects.sorteren();
    }
}

xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();

const makeHead = (arr) => {
    let kop = "<table class='boeken'><tr>";
    arr.forEach((item) => {
        kop += "<th>" + item + "</th>";
    });
    kop += "</tr>";
    return kop;
}

const giveMonthNumber = (month) => {
    let number;
    switch(month){
        case "januari":     number = 0; break;
        case "februari":    number = 1; break;
        case "maart":       number = 2; break;
        case "april":       number = 3; break;
        case "mei":         number = 4; break;
        case "juni":        number = 5; break;
        case "juli":        number = 6; break;
        case "augustus":    number = 7; break;
        case "september":   number = 8; break;
        case "oktober":     number = 9; break;
        case "november":    number = 10; break;
        case "december":    number = 11; break;

        default: number = 0;
    }
    return number;
}

const makeValidDate = (monthYear) => {
    let myArray = monthYear.split(" ");
    let date = new Date(myArray[1], giveMonthNumber(myArray[0]));
    return date;
}

const makeSummary = (array) => {
    let string = "";
    for(let i=0; i<array.length; i++){
        switch (i) {
            case array.length-1 : string += array[i]; break;
            case array.length-2 : string += array[i] + " en "; break;
            default: string += array[i] + ", ";
        }
    }
    return string;
}

const keerTekstOn = (string) => {
    if(string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }
    return string;
}



//sorteren
let sortBookObjects = {
    data: "",   
    unique: "titelUpper",
    oplopend: 1,
    addJSDate: function () {
        this.data.forEach((item) => {
            item.JSDate = makeValidDate(item.uitgave);
        });
    },
    //sorteren2
    sorteren: function(){
        this.data.sort( (a,b) => a[this.unique] > b[this.unique] ? 1*this.oplopend :  -1*this.oplopend);
        this.uitvoeren(this.data);
    },
    //tabel
    uitvoeren: function(data){
        //leeg
        document.getElementById("boeken").innerHTML = "";

        data.forEach(boek => {
            let sectie = document.createElement('section');
            sectie.className = 'boekSelectie';

            //grid
            let main = document.createElement('main');
            main.className = "boekSelectie__main";

            //cover
            let afbeelding = document.createElement("img");
            afbeelding.className = "boekSelectie__cover";
            afbeelding.setAttribute("src", boek.cover);
            afbeelding.setAttribute("alt", keerTekstOn(boek.titel));

            //titel
            let titel = document.createElement('h3');
            titel.className = "boekSelectie__titel";
            titel.textContent = keerTekstOn(boek.titel);

            //schrijvers
            let auteurs = document.createElement('p');
            auteurs.className = 'boekSelectie__auteurs';
            //namen
            boek.auteur[0] = keerTekstOn(boek.auteur[0]);
            auteurs.textContent = makeSummary(boek.auteur);

            //informatie boeken
            let overig = document.createElement('p');
            overig.className = "boekSelectie__overig";
            overig.textContent = "Datum: " + boek.uitgave + " | Pagina's: " + boek.paginas + " | Taal: " + boek.taal + " | EAN: " + boek.ean;


            //prijs van boekem
            let prijs = document.createElement("div");
            prijs.className = "boekSelectie__prijs";
            //prijs van boeken 2
            prijs.textContent = boek.prijs.toLocaleString('nl-NL', {currency: 'EUR', style: "currency"});


            sectie.appendChild(afbeelding);
            main.appendChild(titel);
            main.appendChild(auteurs);
            main.appendChild(overig);
            sectie.appendChild(main)
            sectie.appendChild(prijs);
            document.getElementById("boeken").appendChild(sectie);
        });
    }
}

document.getElementById('kenmerk').addEventListener('change', (e) => {
    sortBookObjects.unique = e.target.value;
    sortBookObjects.sorteren();
});

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        sortBookObjects.oplopend = parseInt(e.target.value);
        sortBookObjects.sorteren();
    })
})