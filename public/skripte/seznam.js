// Premakni film iz seznama (desni del) v košarico (levi del)
const premakniFilmIzSeznamaVKosarico = (
  id,
  naslov,
  jezik,
  ocena,
  trajanje,
  azuriraj
) => {
  if (azuriraj)
    $.get("/kosarica/" + id, (podatki) => {
      /* Dodaj izbran film v sejo */
    });

  // Dodaj film v desni seznam
  $("#kosarica").append(
    "<div id='" +
    id +
    "' class='film'> \
         <button type='button' class='btn btn-light btn-sm'> \
           <i class='fas fa-minus'></i> \
             <strong><span class='naslov'>" +
    naslov +
    "</span></strong> \
         <i class='fas fa-globe-europe'></i><span class='jezik'>" +
    jezik +
    "</span> \
        <i class='fas fa-signal'></i><span class='ocena'>" +
    ocena +
    "</ocena>\
        <i class='far fa-clock'></i><span class='trajanje'>" +
    trajanje +
    "</span> min \
          </button> \
          <input type='button' onclick='vecPodrobnostiFilma(" +
    id +
    ")' class='btn btn-info btn-sm' value='...'> \
        </div>"
  );

  // Dogodek ob kliku na film v košarici (na desnem seznamu)
  $("#kosarica #" + id + " button").click(function () {
    let film_kosarica = $(this);
    $.get("/kosarica/" + id, (podatki) => {
      /* Odstrani izbrano film iz seje */
      // Če je košarica prazna, onemogoči gumbe za pripravo računa
      if (!podatki || podatki.length == 0) {
        $("#racun_html").prop("disabled", true);
        $("#racun_xml").prop("disabled", true);
      }
    });
    // Izbriši film iz desnega seznama
    film_kosarica.parent().remove();
    // Pokaži film v levem seznamu
    $("#filmi #" + id).show();
  });

  // Skrij film v levem seznamu
  $("#filmi #" + id).hide();
  // Ker košarica ni prazna, omogoči gumbe za pripravo računa
  $("#racun_html").prop("disabled", false);
  $("#racun_xml").prop("disabled", false);
};

// Vrni več podrobnosti filmi
var trenutniId = null;
var numClick = 0;
const vecPodrobnostiFilma = (id) => {
  $.get("/vec-o-filmu/" + id, (podatki) => {
    //console.log("Dodaj podrobnosti o filmu.");
    let sporocilo = document.getElementById("sporocilo");
    var leto = podatki.datumIzdaje;
    if (id != trenutniId) {
      numClick = 0;
      trenutniId = id;
      sporocilo.style.display = "block";
    }
    numClick++;
    //console.log(leto.substring(0,leto.indexOf("-")))
    if (numClick == 1) {
      trenutniId = id;
      sporocilo.innerHTML = "<div class='alert alert-info'>\
    <strong>Trajanje:</strong>"+ podatki.trajanje + "min<br><strong>Žanri:</strong>" + podatki.zanri + "<br><strong>Leto izdaje:</strong>" + leto.substring(0, leto.indexOf("-")) + "<br></div>";
    }
    if (numClick > 1 && id == trenutniId) {
      trenutniId = null;
      sporocilo.style.display = "none";
    }
  });
};

$(document).ready(() => {
  // Posodobi podatke iz košarice na spletni strani
  $.get("/kosarica", (kosarica) => {
    kosarica.forEach((film) => {
      premakniFilmIzSeznamaVKosarico(
        film.stevilkaArtikla,
        film.opisArtikla.split(" (")[0],
        film.jezik,
        film.ocena,
        film.trajanje,
        false
      );
    });
  });

  // Klik na film v levem seznamu sproži
  // dodajanje filma v desni seznam (košarica)
  $("#filmi .film button").click(function () {
    let film = $(this);
    premakniFilmIzSeznamaVKosarico(
      film.parent().attr("id"),
      film.find(".naslov").text(),
      film.find(".jezik").text(),
      film.find(".ocena").text(),
      film.find(".trajanje").text(),
      true
    );
  });

  // Nariši graf
  $.get("/podroben-seznam-filmov", (seznam) => {

    let randomCifra = Math.floor(Math.random() * 100);
    //console.log(seznam[randomCifra])
    while (seznam[randomCifra] == null) {
      randomCifra = Math.floor(Math.random() * 100);
    }
    let naslov = seznam[randomCifra].naslov;
    let dobicekIzguba;

    if (seznam[randomCifra].dobicek - seznam[randomCifra].stroski > 0) dobicekIzguba = "Dobiček";
    else dobicekIzguba = "Izguba";

    let vrednost = seznam[randomCifra].dobicek - seznam[randomCifra].stroski;
    let podatkiZaGraf = [];
    let i = 0;
    if (Math.abs(vrednost) >= 1e6) {
      vrednost /= 1e6;
      vrednost = Math.floor(vrednost)
    }
    seznam.forEach((film) => {
      //if(film.dobicek == 0 && film.stroski == 0)console.log(film)
      if (film != null) {
        let str;
        let vrednost = film.dobicek - film.stroski;
        let milStr = "";
        if (film.dobicek - film.stroski > 0) str = "dobiček";
        else str = "izguba"
        if (Math.abs(vrednost) >= 1e6) {
          vrednost /= 1e6;
          vrednost = Math.floor(vrednost);
          milStr = "miljonov";
        }
        //podatkiZaGraf[i] = {x: new Date(film.datumIzdaje), y: film.ocena,naslov:film.naslov,str:str,dobicekIzguba:vrednost,milStr:milStr};
        podatkiZaGraf[i] = { x: new Date(film.datumIzdaje), y: film.ocena, label: film.naslov + ", " + str + " " + vrednost + milStr + " €" };
        i++;
      }
    })

    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: false,
      title: {
        text: "Najboljši filmi čez čas: ocene in donosnost",
        fontColor: "#400080",
        fontWeight: "bold"
      },
      subtitles: [
        {
          text: naslov + "::" + dobicekIzguba + " " + vrednost + " milijonov €",
          fontColor: "#009900",
          fontWeight: "bold"
        },
      ],
      data: [{
        type: "scatter",
        markerType: "cross",
        markerSize: "8",
        //toolTipContent:"{naslov},{str} {dobicekIzguba} {milStr} €: {y}",
        dataPoints: podatkiZaGraf
      }]
    });
    chart.render();
  });

  // Klik na gumba za pripravo računov
  $("#racun_html").click(() => (window.location = "/izpisiRacun/html"));
  $("#racun_xml").click(() => (window.location = "/izpisiRacun/xml"));
});
