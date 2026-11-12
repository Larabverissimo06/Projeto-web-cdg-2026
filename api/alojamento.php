<?php
require __DIR__ . '/ligacao.php';

$id = idValido($_GET['id'] ?? null);

if (!$id) {
    erro(400, 'ID_INVALIDO', 'O identificador do alojamento é inválido.');
}

$consulta = $db->prepare('SELECT * FROM alojamentos WHERE id = ?');
$consulta->execute([$id]);
$alojamento = $consulta->fetch();

if (!$alojamento) {
    erro(404, 'NAO_ENCONTRADO', 'Alojamento não encontrado.');
}

responder(prepararAlojamento($alojamento));