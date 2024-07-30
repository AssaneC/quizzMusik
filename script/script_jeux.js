const lesQuestions = [
    {
        "id": 1,
        "parole": "Incroyablement puissantes, rapides et obéissantes les machines sont aussi totalement stupides.",
        "célébrité": "Gérard Berry",
        "possibilités": [ "Tim Berners Lee", "Ada Lovelace","Gérard Berry"]
    },
    {
    "id": 2,
    "parole": "The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect.",
    "célébrité": "Tim Berners Lee",
    "possibilités": [ "Tim Berners Lee", "Ada Lovelace","Gérard Berry"]
    },
    {
        "id": 3,
        "parole": "La machine analytique n'a nullement la prétention de créer quelque chose par elle-même.",
        "célébrité": "Ada Lovelace",
        "possibilités": [ "Tim Berners Lee", "Ada Lovelace","Gérard Berry"]
    }
]

const questionComplete =  {
    "id": 1,
    "parole": "Incroyablement puissantes, rapides et obéissantes les machines sont aussi totalement stupides.",
    "célébrité": "Gérard Berry",
    "possibilités": [ "Tim Berners Lee", "Ada Lovelace","Gérard Berry"]
}


document.addEventListener("DOMContentLoaded", () => { // Après que le contenu soit chargé 
    const display_menu = () => {
        const navUl = document.querySelector("nav ul");
        if (navUl) {
            navUl.classList.toggle("afficher_menu");
        } else {
            console.error("Element nav ul not found");
        }
    }

    const navDiv = document.querySelector("nav div");
    if (navDiv) {
        navDiv.addEventListener("click", display_menu);
    } else {
        console.error("Element nav div not found");
    }
});











const inserer_une_question = question => {
    let data = '';
    data += `<section id="${question.id}" class="question">`;//ouverture section,
    data += `<h2 class="paroles">Parole: "${question.parole}"</h2>`;
    data += `<h3 class="qui_la_dit"> Qui la dit ?</h3>`;
    data += `<ul class="ul_quest">`; //ouverure ul
    question.possibilités.forEach(element => {
        data += `<li><input class="checkbox" type="checkbox" name= "${element}" id="${element}">${element}</li>`;
    });
    data += `</ul>`;//fermiture ul
    // ouverure container des boutons de navigation
    data += `<span class="navig">`;
    data += `<input class="precedant" type="button" value="précédant"> <input class="suivant" type="button" value="suivant"></input>`;
    // fermiture container des boutons de navigation
    data += `</span>`;
    const bodyJeux = document.getElementById("body_jeux");
    if (bodyJeux) {
        bodyJeux.insertAdjacentHTML('beforeend', data); // Insère à la fin du body_jeux
    } else {
        console.error("Element #body_jeux not found");
    }
}


document.querySelector('#commencer').addEventListener('click',() => {
    // insertion des questions
    document.querySelector("#explication").style.display = "none";
    document.querySelector("#time").style.display = "flex";
    lesQuestions.forEach( (quest) => inserer_une_question(quest) ); 

    // affihage de la premiere question 
    document.querySelectorAll('.question').forEach((question, ind_question ) => {
        // non cliquable pour le premier bouton precedant
        if (ind_question === 0) {
            precedant = question.querySelector('.precedant');
            precedant.disabled = true
            precedant.style.pointerEvents = 'none';
            precedant.style.opacity = '0.5';  
        //Si c'est la dernier question 
        } else if (ind_question === document.querySelectorAll('.question').length - 1 ) {
            suivant = question.querySelector('.suivant');
            suivant.disabled = true
            suivant.style.pointerEvents = 'none';
            suivant.style.opacity = '0.5';
        }
        // aficher que la premiere question
        question.style.display = ind_question === 0 ? 'block' : 'none';
    })

    // // De tel sorte qu'une seul selection soit possible
    // document.querySelectorAll('.question').forEach(question => {
    //     const checkboxs = question.querySelectorAll('input[type="checkbox"]');
    //     console.log(checkboxs)
    //     checkboxs.forEach(checkbox => {
    //         checkbox.addEventListener('input', () => {
    //             if (checkbox && checkbox.checked === true){
    //                 checkboxs.forEach( chkbx => {
    //                     chkbx.checked = false;
    //                     console.log(chkbx.checked )
    //                 })
    //                 checkbox.checked = false;
    //             }
    //         })
    //     })
    // })

    // dynamisation des bouton precedant et suivants
    document.querySelectorAll('.suivant').forEach(suivant => {
        suivant.addEventListener('click', () => {
            const question_actuelle = suivant.closest('section');
            const question_suivante = question_actuelle.nextElementSibling;
            if (question_suivante)  {
                question_actuelle.style.display = 'none';
                question_suivante.style.display = 'block';
            }
            
        })
    })
    

    document.querySelectorAll('.precedant').forEach(precedant => {
        precedant.addEventListener('click', () => {
            const question_actuelle = precedant.closest('section');
            const question_precedante = question_actuelle.previousElementSibling;
    
            if (question_precedante) {
                question_actuelle.style.display = 'none';
                question_precedante.style.display = 'block';
            }
        })
    })

    const optionsObservateur = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const boutonEvaluer = document.querySelector('#evaluer'); // recuperation du bouton #evaluer
    // definition de la fonction pour faire apparaitre le bouton a la derniere question 

    const fonctionRappelObservateur = (entrees, observateur) => {
        entrees.forEach(entree => {
            const boutonEvaluer = document.querySelector('#evaluer'); // Définition à l'intérieur de la fonction
            if (entree.isIntersecting) {
                boutonEvaluer.style.display = 'flex'; // Affiche le bouton si la dernière question est visible
            } else {
                boutonEvaluer.style.display = 'none'; // Masque le bouton si la dernière question n'est pas visible
            }
        });
    };

    const observateur = new IntersectionObserver(fonctionRappelObservateur, optionsObservateur);


    const derniereSectionQuestion = document.querySelector('.question:last-of-type');
    if (derniereSectionQuestion) {
        observateur.observe(derniereSectionQuestion); // Observation de la dernière question
    }


    // gestion des choix des celebrites
    document.querySelectorAll('.question').forEach(question => {

    const les_li_celebrites = question.querySelectorAll("li");
    
    les_li_celebrites.forEach(une_li_celebrite => {

        une_li_celebrite.addEventListener('click', (event) => {
            event.stopPropagation();
            const checkbox = une_li_celebrite.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                checkbox.checked = false
            } else {
                const checkboxs = question.querySelectorAll('input[type="checkbox"]');
                checkboxs.forEach(chckbx => {
                    chckbx.checked = false;
                });
                checkbox.checked = true;

            }
        });

        const checkbox = une_li_celebrite.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.addEventListener('click', (event) => {
                    checkbox.checked = !checkbox.checked;
                });
            }

    });

    });
});



function afficherChrono() {
    let secondes = parseInt(document.querySelector('#sec').innerHTML);
    let minutes = parseInt(document.querySelector('#min').innerHTML);

    if (secondes === 59) {
        minutes += 1;
        secondes = 0;
    } else {
        secondes += 1;
    }

    document.querySelector('#sec').innerHTML = secondes.toString().padStart(2, '0');
    document.querySelector('#min').innerHTML = minutes.toString().padStart(2, '0');    
}

// Fonction pour gérer l'intervalle en fonction de l'affichage de #time
function gererchrono() {   
    if (document.querySelector("#time").style.display === "flex") {
        if (!window.intervalID) {
            window.intervalID = window.setInterval(afficherChrono, 1000);
        }
    } else {
        clearInterval(window.intervalID);
        window.intervalID = null;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Vérification périodique de l'affichage de #time
    window.setInterval(gererchrono, 1000);
});


function evaluer_une_question(section_question) {
    let answer = false;
    lesQuestions.forEach(quest => {//Parcourir la liste des questions
        if (section_question.id == quest.id){ //Si la question dans la page est la meme que celle dans la base de donnees
            const checkedInput = section_question.querySelector("input[type='checkbox']:checked");
            
            if (checkedInput) {//Si y a un element selectionne 
                checkedInput.id === quest.célébrité ? answer = true : answer = false;
            }

        }
    })
    return answer;  
}


document.querySelector("#evaluer").addEventListener('click', () => {
    let nb_good_answer = 0 ;
    document.querySelectorAll("#body_jeux section").forEach((section) => {
        evaluer_une_question(section) ? nb_good_answer +=1: nb_good_answer +=0
    });

    const min = parseInt(document.querySelector("#min").textContent);
    const sec = parseInt(document.querySelector("#sec").textContent);
    const score = document.querySelector("#score");
    const temps = document.querySelector("#temps");
    const minuteur = document.querySelector("#time");
    const nb_questions = document.querySelectorAll("#body_jeux section").length;
    minuteur.style.display = 'none';
    
    temps.textContent = sec === 0 ?  `Temps: ${min} minutes` : `Temps: ${min} minutes et ${sec} secondes`;
    score.textContent = `${nb_good_answer} bonnes reponses/${nb_questions} questions`;

    document.querySelector("#body_jeux").style.display = 'none';
    document.querySelector("#resultats").style.display = 'block';


});


document.querySelector("#rejouer").addEventListener('click', () => {
    location.reload()
})

