<?php

if ($_SERVER["REQUEST_METHOD"]  === "POST") {
    $nom = filter_var($_POST["nom"], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['mail'], FILTER_SANITIZE_EMAIL);
    $objet = filter_var($_POST['objet'], FILTER_SANITIZE_STRING);
    $message = htmlspecialchars($_POST['message']);
    $to = 'kaneassane81@gmail.com';//adresse destination


    echo $nom . $email . $objet . $message;
    $template_objet = "Nouveau message de ".$email." - Objet: ". $objet;

    $template_centenu = "Vous avez reçu un nouveau message de " . $email . "\n\n" . "Message:\n" . $message;

    $template_mail = "From". $email;

    // envoi du mail avec mail(...)
    if (mail($to, $template_objet,$template_centenu, $template_mail )) {
        echo "Message envoyé avec succés";
    } else {
        echo "Erreur lors de l'envoi du message.";
    }
}


?>