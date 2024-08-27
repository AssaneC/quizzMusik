const display_menu = () => {
    document.querySelector("nav ul").classList.toggle("afficher_menu");
}

document.querySelector("nav div").addEventListener("click", display_menu);

// Fonction pour afficher le popup avec un message personnalisé
function showPopup(message) {
    document.getElementById('popup-message').textContent = message; // Mettre à jour le message
    document.getElementById('custom-popup').classList.remove('hidden'); // Afficher le popup
}

// Fonction pour cacher le popup
function hidePopup() {
    document.getElementById('custom-popup').classList.add('hidden'); // Cacher le popup
}

// Ajouter des événements pour les boutons
document.getElementById('close-popup').addEventListener('click', hidePopup);

// Ajouter un événement pour fermer le popup si l'utilisateur clique en dehors du contenu
document.getElementById('custom-popup').addEventListener('click', (event) => {
    if (event.target === document.getElementById('custom-popup')) {
        hidePopup();
    }
});

let les_questions_get;
// recuperation des questions via l'api 
const xml_question = new XMLHttpRequest();
xml_question.open("GET", "https://mi-phpmut.univ-tlse2.fr/~assane.kane/QuizzMusik/php/quizz.php", true);
xml_question.onreadystatechange = function () {
    if (xml_question.readyState === 4) {
        if (xml_question.status === 200) {
            try {
                les_questions_get = JSON.parse(xml_question.responseText);
                console.log(les_questions_get);
                document.querySelector("#question").addEventListener('submit', (event) => {
                    //empecher la soumission du formulaire afin de verifier d'abord si la question existe deja dans la base de donnees
                    event.preventDefault();
                
                    console.log(les_questions_get);
                                    
                    //recuperer les donnees du formulaire
                    data_du_formulaire = new FormData(document.querySelector("#question"));
                    // les transformer en objet js
                    const question_recupere = {
                            "langue": data_du_formulaire.get('lang'),
                            "parole": data_du_formulaire.get('parole'),
                            "célébrité": data_du_formulaire.get('auteur'),
                            "possibilités": [ data_du_formulaire.get('auteur'), data_du_formulaire.get('possibilite1'), data_du_formulaire.get('possibilite2') ]
                    }          
                    
                    // on va ferifier si cette question est dans la base de donnees
                    let quest_existe = false;
                    les_questions_get.forEach(question => {
                        if (question.langue === question_recupere.langue &&
                            question.parole === question_recupere.parole &&
                            question.célébrité === question_recupere.célébrité &&
                            question.possibilités.every(possibilite => question_recupere.possibilités.includes(possibilite))
                        ) {
                            quest_existe = true
                        }
                    });
                    
                    if (quest_existe) {
                        showPopup("Les informations que vous avez fournies correspondent déjà à une question dans notre base de données. Veuillez réessayer avec d'autres informations pour soumettre une nouvelle question.");
                    } else {
                        //Si on passe toutes les verifications, on ouvre la requette post de xhr.
                        const xml_post = new XMLHttpRequest();
                        xml_post.open("POST", "https://mi-phpmut.univ-tlse2.fr/~assane.kane/QuizzMusik/php/quizz.php", true);
                        xml_post.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        xml_post.onreadystatechange = function () {
                            if (xml_post.readyState === 4) {
                                if (xml_post.status === 200) {
                                    console.log("Question soumise avec succès !");
                                    formu.style.display = 'none'; // Cacher le formulaire
                                    succed_submit.style.display = 'flex'; // Afficher le message de succès
                
                                } else {
                                    console.error("Erreur HTTP:", xml_post.status, xml_post.statusText);
                                }
                            }
                        };
                        xml_post.onerror = function () {
                            console.error("Erreur de réseau.");
                        };
                        xml_post.send(JSON.stringify(question_recupere));
                        //document.querySelector("#question").submit(); // Soumettre le formulaire si la question est nouvelle
                    }
                    
                })
            } catch (e) {
                console.error("Erreur de parsing JSON:", e);
            }
        } else {
            console.error("Erreur HTTP:", xml_question.status, xml_question.statusText);
        }
    }
};
xml_question.onerror = function () {
    console.error("Erreur de réseau.");
};
xml_question.send();



const formu = document.querySelector('#question');
const btn_sbmt_expl = document.querySelector('#soumettre_question');
const succed_submit = document.querySelector('#succed_submit');
const explication = document.querySelector('.explication');

btn_sbmt_expl.addEventListener('click', () => {
    explication.style.display = 'none';
    formu.style.display = 'block';
});


// document.querySelector("#question").addEventListener('submit', (event) => {
//     //empecher la soumission du formulaire afin de verifier d'abord si la question existe deja dans la base de donnees
//     event.preventDefault();

//     console.log(les_questions_get);
                    
//     //recuperer les donnees du formulaire
//     data_du_formulaire = new FormData(document.querySelector("#question"));
//     // les transformer en objet js
//     const question_recupere = {
//             "langue": data_du_formulaire.get('lang'),
//             "parole": data_du_formulaire.get('parole'),
//             "célébrité": data_du_formulaire.get('auteur'),
//             "possibilités": [ data_du_formulaire.get('auteur'), data_du_formulaire.get('possibilite1'), data_du_formulaire.get('possibilite2') ]
//     }          
    
//     // on va ferifier si cette question est dans la base de donnees
//     let quest_existe = false;
//     les_questions_get.forEach(question => {
//         if (question.langue === question_recupere.langue &&
//             question.parole === question_recupere.parole &&
//             question.célébrité === question_recupere.célébrité &&
//             question.possibilités.every(possibilite => question_recupere.possibilités.includes(possibilite))
//         ) {
//             quest_existe = true
//         }
//     });
    
//     if (quest_existe) {
//         showPopup("Les informations que vous avez fournies correspondent déjà à une question dans notre base de données. Veuillez réessayer avec d'autres informations pour soumettre une nouvelle question.");
//     } else {
//         //Si on passe toutes les verifications, on ouvre la requette post de xhr.
//         const xml_post = new XMLHttpRequest();
//         xml_post.open("POST", "https://mi-phpmut.univ-tlse2.fr/~assane.kane/QuizzMusik/php/quizz.php", true);
//         xml_post.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//         xml_post.onreadystatechange = function () {
//             if (xml_post.readyState === 4) {
//                 if (xml_post.status === 200) {
//                     console.log()
//                     formu.style.display = 'none';
//                     succed_submit.style.display = 'flex';

//                 } else {
//                     console.error("Erreur HTTP:", xml_post.status, xml_post.statusText);
//                 }
//             }
//         };
//         xml_post.onerror = function () {
//             console.error("Erreur de réseau.");
//         };
//         xml_post.send(JSON.stringify(question_recupere));
//         //document.querySelector("#question").submit(); // Soumettre le formulaire si la question est nouvelle
//     }
// })