<?php

require("connect.php");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

// Connexion à la base de données
$con = mysqli_connect(SERVEUR, LOGIN, PASS);
if (!$con) {
    http_response_code(500);
    echo json_encode(["error" => "Connection à " . SERVEUR . " impossible"]);
    exit;
}

if (!mysqli_select_db($con, BASE)) {
    http_response_code(500);
    echo json_encode(["error" => "Accès à " . BASE . " impossible"]);
    exit;
}

mysqli_set_charset($con, "utf8");

// Récupération des questions depuis la base de données et conversion en JSON
$req_recup = 
"SELECT Questions.id, langue, parole, auteur, possibilite1, possibilite2, possibilite3
FROM Questions
INNER JOIN Possibilites ON Possibilites.id = Questions.id
ORDER BY RAND()";

$les_questions = mysqli_query($con, $req_recup);
if (!$les_questions) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur de récupération des questions : " . mysqli_error($con)]);
    exit;
}

$tab_questions = array();
while ($liste_question = mysqli_fetch_array($les_questions)) {
    $possibilites = [$liste_question['possibilite1'], $liste_question['possibilite2'], $liste_question['possibilite3']];
    shuffle($possibilites);
    $question = array(
        "id" => $liste_question['id'],
        "langue" => $liste_question['langue'],
        "parole" => $liste_question['parole'],
        "célébrité" => $liste_question['auteur'],
        "possibilités" => array($possibilites[0], $possibilites[1], $possibilites[2])
    );
    $tab_questions[] = $question;
}

// Convertir les données en JSON et les afficher
echo json_encode($tab_questions, JSON_PRETTY_PRINT);

mysqli_close($con);
?>
