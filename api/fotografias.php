<?php
require __DIR__ . '/ligacao.php';

$id = idValido($_GET['id'] ?? null);

if (!$id) {
    erro(400, 'ID_INVALIDO', 'O identificador do alojamento é inválido.');
}

$consulta = $db->prepare('SELECT id, caminho, divisao, ordem FROM fotografias_alojamento WHERE alojamento_id = ? ORDER BY ordem, id');
$consulta->execute([$id]);

responder(['fotografias' => $consulta->fetchAll()]);