<?php
require __DIR__ . '/ligacao.php';
require __DIR__ . '/email.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    erro(405, 'METODO', 'Método não permitido.');
}

$b = corpoJson();

$nome = texto($b['nome'] ?? '');
$email = texto($b['email'] ?? '');
$telefone = texto($b['telefone'] ?? '');
$notas = mb_substr(texto($b['notas'] ?? ''), 0, 500);
$idioma = ($b['idioma'] ?? '') === 'en' ? 'en' : 'pt';
$entrada = $b['check_in'] ?? null;
$saida = $b['check_out'] ?? null;
$idAlojamento = idValido($b['alojamento_id'] ?? null);
$hospedes = idValido($b['hospedes'] ?? null);

if ($nome === '' || $email === '' || !$entrada || !$saida || empty($b['alojamento_id']) || !isset($b['hospedes']) || $b['hospedes'] === '') {
    erro(400, 'CAMPOS', 'Preenche todos os campos obrigatórios.');
}

if (mb_strlen($nome) > 120 || mb_strlen($telefone) > 40 || mb_strlen($email) > 160) {
    erro(400, 'CAMPOS', 'Preenche todos os campos obrigatórios.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    erro(400, 'EMAIL', 'O e-mail indicado não é válido.');
}

$erroDatas = validarDatas($entrada, $saida);

if ($erroDatas) {
    erro(400, $erroDatas, MENSAGENS[$erroDatas]);
}

if (!$idAlojamento || !$hospedes) {
    erro(400, 'HOSPEDES_INVALIDOS', 'O alojamento ou o número de hóspedes é inválido.');
}

$consulta = $db->prepare('SELECT * FROM alojamentos WHERE id = ?');
$consulta->execute([$idAlojamento]);
$alojamento = $consulta->fetch();

if (!$alojamento) {
    erro(404, 'NAO_ENCONTRADO', 'Alojamento não encontrado.');
}

if ($hospedes > $alojamento['capacidade']) {
    erro(400, 'CAPACIDADE', 'O alojamento não tem capacidade para tantos hóspedes.');
}

$noites = calcularNoites($entrada, $saida);
$precoTotal = calcularTotalPorEpoca($alojamento, $entrada, $saida);


// Código promocional (opcional)
$codigoUsado = null;
$percentagem = 0;
$textoCodigo = texto($b['codigo'] ?? '');

if ($textoCodigo !== '') {
    $codigo = procurarCodigo($db, $textoCodigo);

    if (!$codigo) {
        erro(400, 'CODIGO_INVALIDO', 'Este código não é válido ou já expirou.');
    }

    $codigoUsado = $codigo['codigo'];
    $percentagem = (int) $codigo['percentagem'];
}

// Cliente habitual
$anteriores = $db->prepare("SELECT COUNT(*) FROM reservas WHERE LOWER(email) = LOWER(?) AND estado = 'confirmada'");
$anteriores->execute([$email]);

// Fica o maior desconto
if ($anteriores->fetchColumn() > 0 && DESCONTO_HABITUAL > $percentagem) {
    $codigoUsado = 'CLIENTE HABITUAL';
    $percentagem = DESCONTO_HABITUAL;
}

$desconto = round($precoTotal * $percentagem / 100, 2);
$precoTotal = round($precoTotal - $desconto, 2);
$referencia = gerarReferencia($db);
$inserir = $db->prepare("INSERT INTO reservas
    (nome, email, telefone, alojamento_id, check_in, check_out, hospedes, preco_total, estado, notas, idioma, criado_em, codigo, desconto, referencia)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, 'confirmada', ?, ?, ?, ?, ?, ?
    WHERE NOT EXISTS (
        SELECT 1 FROM reservas
        WHERE alojamento_id = ? AND estado = 'confirmada' AND check_in < ? AND check_out > ?
    )");

$inserir->execute([
    $nome, $email, $telefone, $idAlojamento, $entrada, $saida, $hospedes, $precoTotal, $notas, $idioma, date('c'), $codigoUsado, $desconto, $referencia,
    $idAlojamento, $saida, $entrada
]);

if ($inserir->rowCount() === 0) {
    erro(409, 'INDISPONIVEL', 'O alojamento já está reservado para essas datas.');
}

$reservaId = (int) $db->lastInsertId();

// E-mail de confirmação
$emailEnviado = enviarEmailReserva([
    'referencia' => $referencia,
    'nome' => $nome,
    'email' => $email,
    'idioma' => $idioma,
    'alojamento' => $alojamento['nome'],
    'check_in' => $entrada,
    'check_out' => $saida,
    'noites' => $noites,
    'hospedes' => $hospedes,
    'desconto' => $desconto,
    'preco_total' => $precoTotal
]);

responder([
    'mensagem' => 'Reserva registada com sucesso!',
    'referencia' => $referencia,
    'alojamento' => $alojamento['nome'],
    'noites' => $noites,
    'preco_total' => $precoTotal,
    'email_real' => $emailEnviado,
    'codigo' => $codigoUsado,
    'percentagem' => $percentagem,
    'desconto' => $desconto,
], 201);