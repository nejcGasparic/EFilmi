$(document).ready(() => {
  $("#prijavaOdjavaGumb").click(() => {
    let idIzbraneStranke = $("#seznamStrank").val();
    //console.log(window.location.href)
    if(idIzbraneStranke == null&&!window.location.href.endsWith("/")){
      alert("Za prijavo je potrebno izbrati stranko!");
      window.location = "/prijava";
       
    }else{
      window.location = idIzbraneStranke
        ? "/prijavaOdjava/" + idIzbraneStranke
        : "/prijavaOdjava/brezStranke";
    }
  });
});
