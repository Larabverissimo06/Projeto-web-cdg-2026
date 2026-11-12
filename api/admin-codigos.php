<?php
require __DIR__ . '/ligacao.php';

verificarAdmin();

$metodo = $_SERVER['REQUEST_METHOD'];

// Lista de códigos
if ($metodo === 'GET') {
    $codigos = $db->query('SELECT * FROM codigos ORDER BY id DESC')->fetchAll();
    responder(['codigos' => $codigos]);
}

// Criar código
if ($metodo === 'POST') {
    $b = corpoJson();
    $codigo = mb_strtoupper(texto($b['codigo'] ?? ''));
    $percentagem = filter_var($b['percentagem'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 90]]);
    $validoAte = texto($b['valido_ate'] ?? '');

    if (!preg_match('/^[A-Z0-9]{3,20}$/', $codigo)) {
        erro(400, 'CAMPOS', 'O código deve ter 3 a 20 letras ou números, sem espaços.');
    }

    if ($percentagem === false) {
        erro(400, 'CAMPOS', 'O desconto tem de ser entre 1% e 90%.');
    }

    if ($validoAte !== '' && !DateTime::createFromFormat('!Y-m-d', $validoAte)) {
        erro(400, 'CAMPOS', 'A data de validade não é válida.');
    }

    $existe = $db->prepare('SELECT id FROM codigos WHERE codigo = ?');
    $existe->execute([$codigo]);

    if ($existe->fetch()) {
        erro(409, 'REPETIDO', 'Já existe um código com esse nome.');
    }

    $db->prepare('INSERT INTO codigos (codigo, percentagem, valido_ate, ativo, criado_em) VALUES (?, ?, ?, 1, ?)')
        ->execute([$codigo, $percentagem, $validoAte ?: null, date('c')]);

    responder(['mensagem' => 'Código criado.'], 201);
}

$id = idValido($_GET['id'] ?? null);

if (!$id) {
    erro(400, 'CAMPOS', 'Pedido inválido.');
}

// Ativar ou desativar
if ($metodo === 'PATCH') {
    $ativo = !empty(corpoJson()['ativo']) ? 1 : 0;
    $db->prepare('UPDATE codigos SET ativo = ? WHERE id = ?')->execute([$ativo, $id]);
    responder(['mensagem' => $ativo ? 'Código ativado.' : 'Código desativado.']);
}

// Eliminar
if ($metodo === 'DELETE') {
    $db->prepare('DELETE FROM codigos WHERE id = ?')->execute([$id]);
    responder(['mensagem' => 'Código eliminado.']);
}

erro(405, 'METODO', 'Método não permitido.');