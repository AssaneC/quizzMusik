<?php

require("connect.php");

$con = mysqli_connect(SERVEUR, LOGIN, PASS);
if (!$con) {
    echo nl2br("connection à". SERVEUR."  IMPOSSIBLE\n");
} else {
    echo "connection à ".SERVEUR. " réuissie\n";
}

if (!mysqli_select_db($con, BASE)){
    echo nl2br("Accès à ".BASE." imposible\n");
    exit;
} else {
    echo nl2br("connection à ".BASE." réussie\n");
}

mysqli_set_charset($con, "utf8");


$lang = $_POST['lang'];
$parole = $_POST['parole'];
$auteur = $_POST['auteur'];
$possibilite1 = $_POST['possibilite1'];
$possibilite2 = $_POST['possibilite2'];
$possibilite3 = $_POST['auteur'];

// Vérifier si la question existe déjà
$check_question = "SELECT id FROM Questions WHERE langue = '$lang' AND parole = '$parole' AND auteur = '$auteur' LIMIT 1";
$result_check = mysqli_query($con, $check_question);

if (mysqli_num_rows($result_check) > 0) {
    echo nl2br("Erreur : La question existe déjà dans la base de données.\n");
    while ( $res = mysqli_fetch_array($result_check)) {
        echo $res['id'] . $res['langue']. $res['parole']. $res['auteur'];
    }
    exit;
} else {
    // La question n'existe pas, on peut l'insérer
    $req1 = "insert into Questions 
    (langue, parole, auteur) values 
    ('$lang', '$parole', '$auteur');";

    $req2 = "select Questions.id 
    from Questions 
    where langue =  '$lang' and 
    auteur = '$auteur' and 
    parole = '$parole' LIMIT 1";


    $ajout1 = mysqli_query($con, $req1);

    $err = "";
    if (!$ajout1) {
        $err = mysqli_error($con);
    } 

    if ( $err != "") {
        echo $err;
    } else {
        echo nl2br("Ajout langue, auteur effectué\n");
    }

    $recup_id = mysqli_query($con, $req2);

    if (!$recup_id) {
        $err = mysqli_error($con);
    } 

    if ( $err != "") {
        echo nl2br("l'erreur de la recuperation de l'id est: ".$err."\n");
        exit;
    } else {

        while (  $id_question = mysqli_fetch_array($recup_id)) {
            echo nl2br("l'id de question est ".$id_question['id']."\n");
            $possibilites = [$possibilite1, $possibilite2, $possibilite3];
            shuffle($possibilites);
            $req3 = "INSERT INTO Possibilites  VALUES (".$id_question['id'].",'$possibilites[0]' ,'$possibilites[1]','$possibilites[2]')";

            // Exécuter la requête pour insérer les possibilités
            $insertion_id = mysqli_query($con, $req3);
            $err_insert_id = "";
            if (!$insertion_id) {
                $err_insert_id = mysqli_error($con);
            }
            if ($err_insert_id != "") {
                echo nl2br("L'erreur de l'insertion des possibilités est: ".$err_insert_id."\n");
                exit;
            } else {
                echo nl2br("Ajout des possibilités avec succès\n");
            }
        }
    }
}


// recuperation des question depuis la base de donnees et convertion en json
$req_recup = 
"SELECT Questions.id, langue, parole, auteur, possibilite1, possibilite2, possibilite3
FROM Questions
INNER JOIN Possibilites on Possibilites.id = Questions.id; ";

$les_questions = mysqli_query($con, $req_recup);
$tab_questions = array();
$erreur_de_recup_question = "";


if (!$les_questions) {
    $erreur_de_recup_question = mysqli_error($con);
}

if ( $erreur_de_recup_question != "") {
    echo "L'erreur de recuperation des questions est: ".$erreur_de_recup_question;
} else {
    while ( $liste_question = mysqli_fetch_array($les_questions)) {
        $question = array(
            "id" => $liste_question[id],
            "langue" => $liste_question[langue],
            "parole" => $liste_question[parole],
            "célébrité" => $liste_question[auteur],
            "possibilités" => array($liste_question[possibilite1], $liste_question[possibilite2], $liste_question[$possibilite3])
        );

        $tab_questions[] = $question;

    }
}

// Convertir les données en JSON
$tab_questions_json = json_encode($tab_questions, JSON_PRETTY_PRINT);
// Afficher le JSON
//echo $json_data;
echo $tab_questions_json;

// Encoder les données en JSON
// $json_data = json_encode($tab_questions_json, JSON_PRETTY_PRINT);

// Écrire les données dans un fichier JSON
file_put_contents('questions.json', $tab_questions_json);

?>