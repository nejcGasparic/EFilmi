$(document).ready(() => {
  var registerBtn = document.getElementById("Register");
  var validName = false;
  var validCountry = false;
  $("#FirstName").keyup(() => {
    var regex = /^[a-zA-Z-čćžšđČĆŽŠĐ]{2,14}$/ 
    var name = document.getElementById("FirstName").value;
    var vnosnoPolje = document.getElementById("FirstName");
    var symbol = document.querySelector("#FirstNameStatus").firstChild;
    //console.log(vnosnoPolje);
    //console.log(symbol.classList);
    //console.log(regex.test(ime));
    if(regex.test(name)){
      symbol.classList.remove("fa-times");
      symbol.classList.add("fa-check");
      validName = true;
      vnosnoPolje.classList.add("dovoljeno");
    }
    else{
      symbol.classList.remove("fa-check");
      symbol.classList.add("fa-times");
      vnosnoPolje.classList.remove("dovoljeno");
      validName=false; 
    }
    console.log("Preveri ime nove stranke.");
    //console.log(validName);
    //console.log(symbol)
    if(validName&&validCountry) registerBtn.disabled = false;
    else registerBtn.disabled = true;
  });
  var seznamDrzav;
  var trenutnaDrzava;
  $("#Country").keyup(() => {
    $.get("stranke_po_drzavah", function(seznamDrzav) {
      var regex = /^[a-zA-Z]{3,}$/i;
      var vnosnoPolje = document.getElementById("Country");
      var drzava = document.getElementById("Country").value;
      var symbol = document.querySelector("#CountryStatus").firstChild;
      var stStrank = document.querySelector("#obstojeceStrankeId");
      if(drzava!=trenutnaDrzava) stStrank.innerHTML = "0";
    //if(regex.test(drzava));
    //console.log(seznamDrzav)
      for(let i = 0;i < seznamDrzav.length;i++){
        if(drzava.toUpperCase() == seznamDrzav[i].drzava.toUpperCase()){
          stStrank.innerHTML = String(seznamDrzav[i].stUporabnikov);
          trenutnaDrzava = drzava;
        }
      }
      /*parseInt(stStrank.innerHTML)<=5*/
      if(regex.test(drzava)&&parseInt(stStrank.innerHTML)<5){
        vnosnoPolje.classList.add("dovoljeno");
        symbol.classList.remove("fa-times");
        symbol.classList.add("fa-check");
        validCountry = true;
      }else{
        vnosnoPolje.classList.remove("dovoljeno");
        symbol.classList.add("fa-times");
        symbol.classList.remove("fa-check");
        validCountry = false;
      }
      if(validName&&validCountry) registerBtn.disabled = false;
      else registerBtn.disabled = true;
    });
    //console.log("Preveri državo nove stranke.");
  });
  // Poslušalec ob kliku z miško na izbran račun
  $("select#seznamRacunov").change(function (e) {
    let izbranRacunId = $(this).val();
    $.get("/jeziki-racuna/" + izbranRacunId, (racunJeziki) => {
      $("#jezikiRacuna").html(racunJeziki);
    });
  });
});
