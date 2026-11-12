<?php
require __DIR__ . '/ligacao.php';

$codigo = procurarCodigo($db, texto($_GET['codigo'] ?? ''));

if (!$codigo) {
    erro(404, 'CODIGO_INVALIDO', 'Este código não é válido ou já expirou.');
}

responder([
    'codigo' => $codigo['codigo'],
    'percentagem' => (int) $codigo['percentagem']
]);