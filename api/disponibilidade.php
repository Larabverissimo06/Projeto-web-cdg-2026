<?php
require __DIR__ . '/ligacao.php';

$entrada = $_GET['check_in'] ?? null;
$saida = $_GET['check_out'] ?? null;
$adultos = filter_var($_GET['adultos'] ?? '', FILTER_VALIDATE_INT);
$criancas = filter_var($_GET['criancas'] ?? 0, FILTER_VALIDATE_INT);
$quartos = filter_var($_GET['quartos'] ?? 1, FILTER_VALIDATE_INT);

$erroDatas = validarDatas($entrada, $saida);

if ($erroDatas) {
    erro(400, $erroDatas, MENSAGENS[$erroDatas]);
}

if (
    $adultos === false || $adultos < 1 || $adultos > 30 ||
    $criancas === false || $criancas < 0 || $criancas > 30 ||
    $quartos === false || $quartos < 1 || $quartos > 10
) {
    erro(400, 'HOSPEDES_INVALIDOS', 'O número de hóspedes ou quartos é inválido.');
}

$hospedes = $adultos + $criancas;
$noites = calcularNoites($entrada, $saida);

$consulta = $db->prepare("SELECT * FROM alojamentos
    WHERE capacidade >= ? AND quartos >= ?
    AND id NOT IN (
        SELECT alojamento_id FROM reservas
        WHERE estado = 'confirmada' AND check_in < ? AND check_out > ?
    )
    ORDER BY nome");
$consulta->execute([$hospedes, $quartos, $saida, $entrada]);

$alojamentos = [];

foreach ($consulta->fetchAll() as $alojamento) {
    $alojamento = prepararAlojamento($alojamento);
    $alojamento['noites'] = $noites;
    $alojamento['preco_total'] = calcularTotalPorEpoca($alojamento, $entrada, $saida);
    $alojamentos[] = $alojamento;
}

responder([
    'check_in' => $entrada,
    'check_out' => $saida,
    'noites' => $noites,
    'hospedes' => $hospedes,
    'alojamentos' => $alojamentos
]);