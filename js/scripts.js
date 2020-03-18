// paramètres par défaut
let nbCase=11;
let largeurCase=20;

const game = {
  // Paramètres de base
   nbCase:nbCase,
   largeurCase:largeurCase,
   couleurs:{
     "0":"blue",
     "1":"yellow",
     "2":"red",
     "3":"light-green",
     "4":"pink",
     "5":"brown",
     "6":"teal",
     "7":"orange",
     "8":"black",
     "9":"white",
   },
   couleurChoisie:'blue',
   dessin:{},


   trace() { // Dessine le quadrillage du jeu
     for (let i=0; i<game.nbCase*game.nbCase; i++) {
       $ajout='<div class="casejeu"></div>';
       $base= $('#game').html();
        $('#game').html($base+$ajout);
     }
   },

   adjustCases() { // Ajuste la taille des cases du jeu à celle définie dans les paramètres et du jeu lui même
     $topmenu=$(window).height()/2 - largeurJeu/2 - 90;
     $leftmenu = $(window).width()/2 +50;
     // On calcule et affecte la taille et la position du conteneur pour le quadrillage
     largeurJeu=game.largeurCase * game.nbCase;
     $('#game').css('width', largeurJeu+'px');
     $('#game').css('height', largeurJeu+'px');
     $('#game').css('margin-top', $(window).height()/2 - largeurJeu/2+'px');
     $('#game').css('margin-left', $(window).width()/2 - largeurJeu/2+'px');
     $('#menu').css('margin-top', $topmenu+'px');
     $('#menu').css('left', $leftmenu+'px');

     // On ajuste la taille de chaque case
     $('.casejeu').each(function() {
       $(this).css('width', game.largeurCase+'px');
       $(this).css('height', game.largeurCase+'px');
     });

     // On fait pareil pour le nuancier
     $('.casenuancier').each(function() {
       $(this).css('width', game.largeurCase+'px');
       $(this).css('height', game.largeurCase+'px');
     });
   },

   traceNuancier() { // Dessine le nuancier de couleur
     $('#nuancier').css('width', game.largeurCase+'px');
     $('#outils').css('width', game.largeurCase+'px');

     game.hauteurNuancier=game.largeurCase * Object.keys(game.couleurs).length;

// On créé les cases couleur du nancier
     for (let i =0; i<Object.keys(game.couleurs).length; i++) {
       $ajout='<div class="casenuancier '+game.couleurs[i];
        if (game.couleurs[i]===game.couleurChoisie) {
          $ajout+=' active ';
        }
       $ajout+='"></div>';
       $base= $('#nuancier').html();
        $('#nuancier').html($base+$ajout); // On remplit le nuancier
     }


// On ajuste la taille et la position du nancier
     largeurJeu=game.largeurCase * game.nbCase;
     marginLeftNuancier=(game.largeurCase * game.nbCase)/2 + game.largeurCase*2;
     marginTopNuancier = (game.largeurCase * game.nbCase)/2;
     $('#nuancier').css('top', $(window).height()/2 - largeurJeu/2 +'px');
     $('#nuancier').css('left', $(window).width()/2 - largeurJeu/2 +'px');
     $('#nuancier').css('margin-left', '-'+2*game.largeurCase+'px');

     $('#outils').css('top', $(window).height()/2 - largeurJeu/2 +'px');
     $('#outils').css('left', $(window).width()/2 - largeurJeu/2 +'px');
     $('#outils').css('margin-left', '-'+4*game.largeurCase+'px');


   },

   efface() {
     $('.casejeu').each(function() {
       $(this).attr('class', 'casejeu');
     });
   },

   remplir() {
     $('.casejeu').each(function() {
       $(this).attr('class', 'casejeu');
       $(this).addClass(game.couleurChoisie);
     });
   },

   reset() {
     $('#nuancier').html('');
     $('#game').html('');
   }



}


$(document).ready(function() {
  $('.tooltipped').tooltip();
  // Initialisation du jeu au chargement de la page
  game.traceNuancier();
  game.trace();
  game.adjustCases();

  // effacement de toutes les cases du jeu
  $(document).on('click', '.delete', function(e) {
    e.preventDefault();
    game.efface();
  });

  // Tout colorer
  $(document).on('click', '.paint', function(e) {
    e.preventDefault();
    game.remplir();
  });

  // Changement de la taille du jeu
  $('.changeSize').click(function(e) {
    e.preventDefault();
    $this=$(this);

    $('.changeSize').each(function() {
      $btn=$(this);
      if ($btn != $this) {
        $(this).removeClass('active');
        $(this).addClass('nobg');
      }
    });

    $this.addClass('active');
    $this.removeClass('nobg');

    num=$(this).attr('href');
    game.nbCase=num;
    game.efface();
    game.reset();
    game.traceNuancier();
    game.trace();
    game.adjustCases();
  });

// Choix de la couleur en cliquant sur le nuancier
$(document).on('click', '.casenuancier', function(e) {
    $this=$(this);

    if ($this.hasClass('paint')) {

    }
    else {
      $('.casenuancier').each(function() { // On desactive toutes les cases couleur
        $case=$(this);
        if ($case != $this) {
          $case.removeClass('active');
        }
      });

      $this.addClass('active'); // On active la case cliquée
      //On récupère la couleur de la case cliquée
      $couleur=$(this).attr('class').split('casenuancier ');
      $couleur=$couleur[1].split(' active');
      $couleur=$couleur[0];
      // Et on l'applique au jeu
      game.couleurChoisie=$couleur;
    }
    });


// Coloration d'une case du jeu
  $(document).on('click', '.casejeu', function() {
    $(this).attr('class', 'casejeu');
    $(this).addClass(game.couleurChoisie)
  });

  var keyPressed = false;

  $(window).keydown(function(evt) {
    if (evt.which == 65) { // ctrl
      keyPressed = true;
    }
  }).keyup(function(evt) {
    if (evt.which == 65) { // ctrl
      keyPressed = false;
    }
  });

  $(document).on('mouseenter', '.casejeu', function() {
    if (keyPressed) {
      $(this).attr('class', 'casejeu');
      $(this).addClass(game.couleurChoisie);
    }
  });

// Enregistrer l'image
$('.capture').click(function(e) {
  e.preventDefault;

  html2canvas(document.querySelector('#game')).then(function(canvas) {
        console.log(canvas);
        saveAs(canvas.toDataURL(), 'mypixel.png');
    });
});


function saveAs(uri, filename) {

    var link = document.createElement('a');

    if (typeof link.download === 'string') {

        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);

    } else {

        window.open(uri);

    }
}



}); // Document ready
