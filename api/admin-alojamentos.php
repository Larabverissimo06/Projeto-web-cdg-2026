<?php
require __DIR__ . '/ligacao.php';

verificarAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    erro(405, 'METODO', 'Método não permitido.');
}

function limparLista($lista) {
    if (!is_array($lista)) return [];
    $limpa = array_filter(array_map(fn($item) => trim((string) $item), $lista));
    return array_slice(array_values($limpa), 0, 30);
}

$id = idValido($_GET['id'] ?? null);
$b = corpoJson();

$nome = texto($b['nome'] ?? '');
$tipologia = texto($b['tipologia'] ?? '');
$capacidade = idValido($b['capacidade'] ?? null);
$quartos = idValido($b['quartos'] ?? null);
$precoBaixa = $b['preco_baixa'] ?? null;
$precoMedia = $b['preco_media'] ?? null;
$precoAlta = $b['preco_alta'] ?? null;

foreach ([$precoBaixa, $precoMedia, $precoAlta] as $preco) {
    if (!is_numeric($preco) || $preco < 0) {
        erro(400, 'CAMPOS', 'Os dados do alojamento são inválidos.');
    }
}

if (!$id || $nome === '' || $tipologia === '' || !$capacidade || !$quartos) {
    erro(400, 'CAMPOS', 'Os dados do alojamento são inválidos.');
}

try {
    $atualizar = $db->prepare('UPDATE alojamentos SET
        nome = ?, tipologia = ?, tipo = ?, capacidade = ?, quartos = ?,
        preco_noite = ?, preco_baixa = ?, preco_media = ?, preco_alta = ?,
        comodidades = ?, descricao = ?, descricao_en = ?,
        detalhes = ?, localizacao = ?, link_mapa = ?
        WHERE id = ?');

    $atualizar->execute([
        $nome,
        $tipologia,
        $tipologia === 'Quarto' ? 'quarto' : 'apartamento',
        $capacidade,
        $quartos,
        (float) $precoBaixa,
        (float) $precoBaixa,
        (float) $precoMedia,
        (float) $precoAlta,
        json_encode(limparLista($b['comodidades'] ?? []), JSON_UNESCAPED_UNICODE),
        texto($b['descricao'] ?? ''),
        texto($b['descricao_en'] ?? ''),
        json_encode(limparLista($b['detalhes'] ?? []), JSON_UNESCAPED_UNICODE),
        texto($b['localizacao'] ?? ''),
        texto($b['link_mapa'] ?? ''),
        $id
    ]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        erro(409, 'DUPLICADO', 'Já existe um alojamento com esse nome.');
    }
    throw $e;
}

if ($atualizar->rowCount() === 0) {
    erro(404, 'NAO_ENCONTRADO', 'Alojamento não encontrado.');
}

responder(['mensagem' => 'Alojamento atualizado.']);