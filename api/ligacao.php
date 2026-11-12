<?php
date_default_timezone_set('Europe/Lisbon');
header('Content-Type: application/json; charset=utf-8');

const ADMIN_PASSWORD = '7saias-admin';


// Desconto para clientes habituais (%)
const DESCONTO_HABITUAL = 10;

const MENSAGENS = [
    'DATAS_INVALIDAS' => 'Seleciona datas de entrada e saída válidas.',
    'DATA_PASSADA' => 'A data de entrada não pode ser anterior a hoje.'
];

$db = new PDO('sqlite:' . __DIR__ . '/../reservas.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$db->exec("CREATE TABLE IF NOT EXISTS avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alojamento_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    classificacao INTEGER NOT NULL,
    comentario TEXT NOT NULL DEFAULT '',
    criado_em TEXT NOT NULL,
    FOREIGN KEY (alojamento_id) REFERENCES alojamentos(id)
)");

// Códigos promocionais
$db->exec("CREATE TABLE IF NOT EXISTS codigos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    percentagem INTEGER NOT NULL,
    valido_ate TEXT,
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em TEXT NOT NULL
)");

// Colunas novas nas reservas
$colunas = array_column($db->query('PRAGMA table_info(reservas)')->fetchAll(), 'name');

if (!in_array('codigo', $colunas)) {
    $db->exec('ALTER TABLE reservas ADD COLUMN codigo TEXT');
}

if (!in_array('desconto', $colunas)) {
    $db->exec('ALTER TABLE reservas ADD COLUMN desconto REAL NOT NULL DEFAULT 0');
}


if (!in_array('referencia', $colunas)) {
    $db->exec('ALTER TABLE reservas ADD COLUMN referencia TEXT');
}

set_exception_handler(function ($e) {
    error_log($e->getMessage());
    erro(500, 'ERRO', 'Erro interno do servidor.');
});

function responder($dados, $estado = 200) {
    http_response_code($estado);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function erro($estado, $codigo, $mensagem) {
    responder(['erro' => $mensagem, 'codigo' => $codigo], $estado);
}

function corpoJson() {
    $dados = json_decode(file_get_contents('php://input'), true);
    return is_array($dados) ? $dados : [];
}

function idValido($valor) {
    $id = filter_var($valor, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    return $id === false ? null : $id;
}

function texto($valor) {
    return is_string($valor) ? trim($valor) : '';
}

function verificarAdmin() {
    $recebida = $_SERVER['HTTP_X_ADMIN_PASSWORD'] ?? '';

    if (!hash_equals(ADMIN_PASSWORD, $recebida)) {
        erro(401, 'NAO_AUTORIZADO', 'Palavra-passe de administração inválida.');
    }
}

function validarDatas($entrada, $saida) {
    if (!is_string($entrada) || !is_string($saida)) {
        return 'DATAS_INVALIDAS';
    }

    $a = DateTime::createFromFormat('!Y-m-d', $entrada);
    $b = DateTime::createFromFormat('!Y-m-d', $saida);

    if (!$a || !$b || $a->format('Y-m-d') !== $entrada || $b->format('Y-m-d') !== $saida || $b <= $a) {
        return 'DATAS_INVALIDAS';
    }

    if ($entrada < date('Y-m-d')) {
        return 'DATA_PASSADA';
    }

    return null;
}

function calcularNoites($entrada, $saida) {
    return (new DateTime($entrada))->diff(new DateTime($saida))->days;
}

function epocaDoMes($mes) {
    if (in_array($mes, [7, 8, 9])) return 'alta';
    if (in_array($mes, [4, 5, 6, 10])) return 'media';
    return 'baixa';
}

function calcularTotalPorEpoca($alojamento, $entrada, $saida) {
    $precos = [
        'baixa' => $alojamento['preco_baixa'] ?? $alojamento['preco_noite'],
        'media' => $alojamento['preco_media'] ?? $alojamento['preco_noite'],
        'alta' => $alojamento['preco_alta'] ?? $alojamento['preco_noite']
    ];

    $data = new DateTime($entrada);
    $fim = new DateTime($saida);
    $centimos = 0;

    while ($data < $fim) {
        $centimos += round($precos[epocaDoMes((int) $data->format('n'))] * 100);
        $data->modify('+1 day');
    }

    return $centimos / 100;
}

function lerLista($json) {
    $lista = json_decode($json ?: '[]', true);
    return is_array($lista) ? $lista : [];
}

function prepararAlojamento($alojamento) {
    $alojamento['comodidades'] = lerLista($alojamento['comodidades']);
    $alojamento['detalhes'] = lerLista($alojamento['detalhes']);
    return $alojamento;
}

// Procurar código promocional
function procurarCodigo($db, $codigo) {
    $consulta = $db->prepare("SELECT * FROM codigos
        WHERE codigo = ? AND ativo = 1 AND (valido_ate IS NULL OR valido_ate = '' OR valido_ate >= ?)");
    $consulta->execute([mb_strtoupper(trim($codigo)), date('Y-m-d')]);
    return $consulta->fetch();
}


// Referência da reserva (ex: 7S-K4M9QX)
function gerarReferencia($db) {
    $letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $existe = $db->prepare('SELECT 1 FROM reservas WHERE referencia = ?');

    do {
        $referencia = '7S-';

        for ($i = 0; $i < 6; $i++) {
            $referencia .= $letras[random_int(0, strlen($letras) - 1)];
        }

        $existe->execute([$referencia]);
    } while ($existe->fetch());

    return $referencia;
}