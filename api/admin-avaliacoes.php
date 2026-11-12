<?php
require __DIR__ . '/ligacao.php';

verificarAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    erro(405, 'METODO', 'Método não permitido.');
}

$id = idValido($_GET['id'] ?? null);

if (!$id) {
    erro(400, 'CAMPOS', 'Pedido inválido.');
}

$apagar = $db->prepare('DELETE FROM avaliacoes WHERE id = ?');
$apagar->execute([$id]);

if ($apagar->rowCount() === 0) {
    erro(404, 'NAO_ENCONTRADO', 'Avaliação não encontrada.');
}

responder(['mensagem' => 'Avaliação eliminada.']);