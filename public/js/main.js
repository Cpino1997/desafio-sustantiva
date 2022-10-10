document.getElementById('btnAutos').addEventListener("click", listar, false);

function listar(){

    var app=document.getElementById("app");
    app.style.display="block"

    app.innerHTML=` Me Precionaste `;
}