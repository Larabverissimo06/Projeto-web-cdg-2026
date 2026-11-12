<?php
require __DIR__ . '/ligacao.php';

$ordem = "ORDER BY
    CASE tipologia WHEN 'Quarto' THEN 1 WHEN 'T1' THEN 2 WHEN 'T2' THEN 3 WHEN 'T3' THEN 4 WHEN 'T4' THEN 5 ELSE 6 END,
    CASE WHEN nome LIKE '%(Restaurante)%' OR nome LIKE '%(Rest)%' THEN 1 ELSE 0 END,
    nome COLLATE NOCASE";

if (!empty($_GET['tipologia'])) {
    $consulta = $db->prepare("SELECT * FROM alojamentos WHERE tipologia = ? $ordem");
    $consulta->execute([$_GET['tipologia']]);
} else {
    $consulta = $db->query("SELECT * FROM alojamentos $ordem");
}

responder(['alojamentos' => array_map('prepararAlojamento', $consulta->fetchAll())]);