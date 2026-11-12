<?php
require __DIR__ . '/ligacao.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $b = corpoJson();

    $idAlojamento = idValido($b['alojamento_id'] ?? null);
    $nome = texto($b['nome'] ?? '');
    $comentario = texto($b['comentario'] ?? '');
    $classificacao = filter_var($b['classificacao'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 5]]);

    if (!$idAlojamento || $classificacao === false || mb_strlen($nome) < 2) {
        erro(400, 'CAMPOS', 'Escreva o seu nome e escolha de 1 a 5 estrelas.');
    }

    if (mb_strlen($nome) > 60 || mb_strlen($comentario) > 1000) {
        erro(400, 'CAMPOS', 'O nome ou o comentário são demasiado longos.');
    }

    $consulta = $db->prepare('SELECT id FROM alojamentos WHERE id = ?');
    $consulta->execute([$idAlojamento]);

    if (!$consulta->fetch()) {
        erro(404, 'NAO_ENCONTRADO', 'Alojamento não encontrado.');
    }

    $db->prepare('INSERT INTO avaliacoes (alojamento_id, nome, classificacao, comentario, criado_em) VALUES (?, ?, ?, ?, ?)')
        ->execute([$idAlojamento, $nome, $classificacao, $comentario, date('c')]);

    responder(['mensagem' => 'Obrigado pela sua avaliação!'], 201);
}

$idAlojamento = idValido($_GET['alojamento'] ?? null);

$sql = 'SELECT v.id, v.alojamento_id, a.nome AS alojamento_nome, v.nome, v.classificacao, v.comentario, v.criado_em
    FROM avaliacoes v
    JOIN alojamentos a ON a.id = v.alojamento_id';

if ($idAlojamento) {
    $consulta = $db->prepare("$sql WHERE v.alojamento_id = ? ORDER BY v.id DESC");
    $consulta->execute([$idAlojamento]);
} else {
    $consulta = $db->query("$sql ORDER BY v.id DESC");
}

$avaliacoes = $consulta->fetchAll();
$total = count($avaliacoes);
$media = $total ? round(array_sum(array_column($avaliacoes, 'classificacao')) / $total, 1) : 0;

responder(['avaliacoes' => $avaliacoes, 'total' => $total, 'media' => $media]);