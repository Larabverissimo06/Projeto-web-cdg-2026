<?php
// E-mails para os clientes
use PHPMailer\PHPMailer\PHPMailer;

// Enviar e-mail
function enviarEmail($para, $nome, $assunto, $html) {
    $ficheiroConfig = __DIR__ . '/email-config.php';
    $pastaPhpMailer = __DIR__ . '/PHPMailer';

    // Sem configuração não envia
    if (!file_exists($ficheiroConfig) || !file_exists($pastaPhpMailer . '/PHPMailer.php')) {
        return false;
    }

    require_once $pastaPhpMailer . '/Exception.php';
    require_once $pastaPhpMailer . '/PHPMailer.php';
    require_once $pastaPhpMailer . '/SMTP.php';

    $config = require $ficheiroConfig;
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $config['servidor'] ?? 'smtp.gmail.com';
        $mail->Port = $config['porta'] ?? 587;
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Username = $config['email'];
        $mail->Password = $config['palavra_passe'];
        $mail->Timeout = 10;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($config['email'], 'Apartamentos 7 Saias');
        $mail->addAddress($para, $nome);
        $mail->isHTML(true);
        $mail->Subject = $assunto;
        $mail->Body = $html;
        $mail->AltBody = strip_tags(str_replace(['</tr>', '</p>'], "\n", $html));

        $mail->send();
        return true;
    } catch (\Exception $e) {
        error_log('Erro ao enviar o e-mail: ' . $mail->ErrorInfo);
        return false;
    }
}

// Ajudas
function h($texto) {
    return htmlspecialchars((string) $texto, ENT_QUOTES, 'UTF-8');
}

function dataEmail($iso) {
    return date('d/m/Y', strtotime($iso));
}

function eurosEmail($valor) {
    return number_format($valor, 2, ',', ' ') . ' €';
}

// Tabela 
function tabelaEmail($linhas) {
    $html = '<table style="width:100%;border-collapse:collapse;border-top:1px solid #ded8ce;border-bottom:1px solid #ded8ce;margin:20px 0;">';

    foreach ($linhas as [$rotulo, $valor]) {
        $html .= '<tr><td style="padding:8px 0;color:#666;">' . h($rotulo) . '</td>'
            . '<td style="padding:8px 0;text-align:right;color:#14245d;font-weight:bold;">' . h($valor) . '</td></tr>';
    }

    return $html . '</table>';
}

// Moldura dos e-mails
function moldeEmail($titulo, $conteudo) {
    return '<div style="background:#f4f1eb;padding:30px 15px;font-family:Arial,sans-serif;">'
        . '<div style="max-width:560px;margin:0 auto;background:#fff;padding:30px;">'
        . '<p style="margin:0 0 6px;font-size:12px;letter-spacing:3px;color:#1d2d78;">APARTAMENTOS 7 SAIAS</p>'
        . '<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:normal;color:#14245d;">' . h($titulo) . '</h1>'
        . $conteudo
        . '</div></div>';
}

function paragrafoEmail($texto) {
    return '<p style="color:#444;line-height:1.6;">' . h($texto) . '</p>';
}

// ---------- RESERVA CONFIRMADA ----------

function enviarEmailReserva($r) {
    $en = $r['idioma'] === 'en';

    $tx = $en ? [
        'assunto' => "Booking confirmed {$r['referencia']} – Apartamentos 7 Saias",
        'ola' => "Hello {$r['nome']},",
        'intro' => 'Thank you for booking with us. Here are the details of your stay:',
        'referencia' => 'Booking reference', 'alojamento' => 'Accommodation', 'entrada' => 'Check-in',
        'saida' => 'Check-out', 'noites' => 'Nights', 'hospedes' => 'Guests', 'desconto' => 'Discount', 'total' => 'Total',
        'pagamento' => 'Payment', 'pagamento_valor' => 'Full amount at check-in (Multibanco or cash)',
        'rececao_titulo' => 'Where to go when you arrive',
        'rececao' => 'Our reception is at Edifício Alimentícia, Av. do Município 4, 2450-108 Nazaré, behind the Nazaré Cultural Centre. Check-in from 14:00, check-out until 11:00.',
        'duvidas' => 'Any questions? Reply to this e-mail or call +351 965 214 539.',
        'ate_breve' => 'See you soon in Nazaré!'
    ] : [
        'assunto' => "Reserva confirmada {$r['referencia']} – Apartamentos 7 Saias",
        'ola' => "Olá {$r['nome']},",
        'intro' => 'Obrigado por reservar connosco. Estes são os dados da sua estadia:',
        'referencia' => 'Referência da reserva', 'alojamento' => 'Alojamento', 'entrada' => 'Entrada',
        'saida' => 'Saída', 'noites' => 'Noites', 'hospedes' => 'Hóspedes', 'desconto' => 'Desconto', 'total' => 'Total',
        'pagamento' => 'Pagamento', 'pagamento_valor' => 'Na totalidade, no check-in (Multibanco ou dinheiro)',
        'rececao_titulo' => 'Onde se dirigir ao chegar',
        'rececao' => 'A nossa receção fica no Edifício Alimentícia, Av. do Município 4, 2450-108 Nazaré, por trás do Centro Cultural da Nazaré. Check-in a partir das 14h00, check-out até às 11h00.',
        'duvidas' => 'Alguma dúvida? Responda a este e-mail ou ligue para +351 965 214 539.',
        'ate_breve' => 'Até breve na Nazaré!'
    ];

    $linhas = [
        [$tx['referencia'], $r['referencia']],
        [$tx['alojamento'], $r['alojamento']],
        [$tx['entrada'], dataEmail($r['check_in'])],
        [$tx['saida'], dataEmail($r['check_out'])],
        [$tx['noites'], $r['noites']],
        [$tx['hospedes'], $r['hospedes']]
    ];

    if ($r['desconto'] > 0) {
        $linhas[] = [$tx['desconto'], '−' . eurosEmail($r['desconto'])];
    }

    $linhas[] = [$tx['total'], eurosEmail($r['preco_total'])];
    $linhas[] = [$tx['pagamento'], $tx['pagamento_valor']];

    $conteudo = paragrafoEmail($tx['intro'])
        . tabelaEmail($linhas)
        . '<h2 style="font-family:Georgia,serif;font-weight:normal;color:#14245d;font-size:20px;">' . h($tx['rececao_titulo']) . '</h2>'
        . paragrafoEmail($tx['rececao'])
        . paragrafoEmail($tx['duvidas'])
        . '<p style="color:#14245d;font-family:Georgia,serif;font-size:18px;">' . h($tx['ate_breve']) . '</p>';

    return enviarEmail($r['email'], $r['nome'], $tx['assunto'], moldeEmail($tx['ola'], $conteudo));
}

// ---------- RESERVA CANCELADA ----------

function enviarEmailCancelamento($r) {
    $en = ($r['idioma'] ?? 'pt') === 'en';
    $peloAlojamento = $r['estado'] === 'cancelada_alojamento';

    $tx = $en ? [
        'assunto' => 'Booking cancelled' . ($r['referencia'] ? " {$r['referencia']}" : '') . ' – Apartamentos 7 Saias',
        'ola' => "Hello {$r['nome']},",
        'intro' => $peloAlojamento
            ? 'We are very sorry, but we had to cancel your booking. We will contact you shortly to help you with an alternative.'
            : 'As requested, your booking has been cancelled.',
        'referencia' => 'Booking reference', 'alojamento' => 'Accommodation', 'entrada' => 'Check-in', 'saida' => 'Check-out',
        'engano' => 'If this is a mistake or you have any questions, reply to this e-mail or call +351 965 214 539.',
        'fim' => 'We hope to welcome you in Nazaré another time.'
    ] : [
        'assunto' => 'Reserva cancelada' . ($r['referencia'] ? " {$r['referencia']}" : '') . ' – Apartamentos 7 Saias',
        'ola' => "Olá {$r['nome']},",
        'intro' => $peloAlojamento
            ? 'Lamentamos muito, mas tivemos de cancelar a sua reserva. Vamos contactá-lo em breve para ajudar a encontrar uma alternativa.'
            : 'Conforme o seu pedido, a sua reserva foi cancelada.',
        'referencia' => 'Referência da reserva', 'alojamento' => 'Alojamento', 'entrada' => 'Entrada', 'saida' => 'Saída',
        'engano' => 'Se foi engano ou tiver alguma dúvida, responda a este e-mail ou ligue para +351 965 214 539.',
        'fim' => 'Esperamos recebê-lo na Nazaré noutra ocasião.'
    ];

    $linhas = [];

    if ($r['referencia']) {
        $linhas[] = [$tx['referencia'], $r['referencia']];
    }

    $linhas[] = [$tx['alojamento'], $r['alojamento_nome']];
    $linhas[] = [$tx['entrada'], dataEmail($r['check_in'])];
    $linhas[] = [$tx['saida'], dataEmail($r['check_out'])];

    $conteudo = paragrafoEmail($tx['intro'])
        . tabelaEmail($linhas)
        . paragrafoEmail($tx['engano'])
        . '<p style="color:#14245d;font-family:Georgia,serif;font-size:18px;">' . h($tx['fim']) . '</p>';

    return enviarEmail($r['email'], $r['nome'], $tx['assunto'], moldeEmail($tx['ola'], $conteudo));
}