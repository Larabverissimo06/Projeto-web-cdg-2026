<?php
require __DIR__ . '/ligacao.php';

$id = idValido($_GET['id'] ?? null);

if (!$id) {
    erro(400, 'ID_INVALIDO', 'O identificador do alojamento é inválido.');
}

$consulta = $db->prepare("SELECT check_in, check_out FROM reservas WHERE alojamento_id = ? AND estado = 'confirmada' AND check_out > ? ORDER BY check_in");
$consulta->execute([$id, date('Y-m-d')]);

responder(['ocupacao' => $consulta->fetchAll()]);