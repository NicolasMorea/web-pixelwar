const PIXEL_URL = "http://pixels-war.oie-lab.net/"

document.addEventListener("DOMContentLoaded", () => {
    fetch(PIXEL_URL+"getmap/")
        .then((response) => response.json())
        .then((json) => {
            let id = json.id;
            //console.log("id = " + id);
            //console.log((json.data[0]).length);
            const grid = document.getElementById("grid");
            for (let i = 0; i < 100; i++) {
                for (let j = 0; j < 100; j++) {
                    //console.log("adding a pixel");
                    pixel = document.createElement("div");
                    //"rgb(json.data[i][j][0],json.data[i][j][1],json.data[i][j][2])";
                    pixel.style.backgroundColor = "rgb(" + json.data[i][j][0].toString() + "," + json.data[i][j][1].toString() + "," + json.data[i][j][2].toString() + ")";
                    pixel.addEventListener('click', () => ChangeColor(i ,j, id));
                    pixel.addEventListener('contextmenu', () => Pick(pixel.style.backgroundColor))
                    grid.appendChild(pixel);
                    }
            }

            

            //TODO: maintenant que j'ai l'id, attacher la fonction refresh(id), à compléter, au clic du bouton refresh
            document.getElementById("refresh").addEventListener('click', () => refresh(id))


            //TODO: attacher au clic de chaque pixel une fonction qui demande au serveur de colorer le pixel sous là forme :
            // la fonction getPickedColorInRGB ci-dessous peut aider
            

            //TODO: pourquoi pas rafraichir la grille toutes les 3 sec ?
            setInterval(ref, 2000)
            function ref(){
                refresh(id);
            }
            //TODO: voire même rafraichir la grille après avoir cliqué sur un pixel ?

            //TODO: pour les avancés: ça pourrait être utile de pouvoir
            // choisir la couleur à partir d'un pixel ?
        })
        
    

    
    //TODO: pour les personnes avancées, comment transformer les deux "then" ci-dessus en "asynch / await" ?
    //A compléter puis à attacher au bouton refresh en passant mon id une fois récupéré
    function refresh(id) {
        fetch(PIXEL_URL+"getmap?id="+id)
            .then((response) => response.json())
            .then((json) => {
                //console.log(json.deltas);
                const grid = document.getElementById("grid");
                let pixels = grid.childNodes;
                for (let i = 0; i < json.deltas.length; i++){
                    
                    let delta = json.deltas[i];
                    //console.log(delta);
                    //console.log(pixels[(i)*100 + j].style.backgroundColor);
                    //console.log(pixels[(delta[0])*100]);
                    pixels[(delta[0])*100 + delta[1]].style.backgroundColor = "rgb(" + delta[2].toString() + "," + delta[3].toString() + "," + delta[4].toString() + ")";
                }

            })
            
    }
    function ChangeColor(i, j, id){
        color = getPickedColorInRGB();
        let url = "http://pixels-war.oie-lab.net/set/" + id + "/" + (i) + "/" + (j + 1) + "/" + color[0] + "/" + color[1] + "/" + color[2];
        console.log(url)
        fetch(url)
        .then((response) => refresh(id))
    }
    function pick(newColor){
        colorpicker = document.getElementById("colorpicker")
        colorpicker.color = newColor;
    }
    //Petite fonction facilitatrice pour récupérer la couleur cliquée en RGB
    function getPickedColorInRGB() {
        let colorHexa = document.getElementById("colorpicker").value

        let r = parseInt(colorHexa.substring(1,3),16);
        let g = parseInt(colorHexa.substring(3,5),16);
        let b = parseInt(colorHexa.substring(5,7),16);

        return [r, g, b];
    }

})

