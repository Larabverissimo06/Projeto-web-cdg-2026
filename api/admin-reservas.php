<?php
require __DIR__ . '/ligacao.php';
require __DIR__ . '/email.php';

verificarAdmin();

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $reservas = $db->query("SELECT r.*, a.nome AS alojamento_nome
        FROM reservas r
        LEFT JOIN alojamentos a ON a.id = r.alojamento_id
        ORDER BY r.check_in DESC, r.id DESC")->fetchAll();

    responder(['reservas' => $reservas]);
}

$id = idValido($_GET['id'] ?? null);

if (!$id) {
    erro(400, 'CAMPOS', 'Pedido inválido.');
}

if ($metodo === 'PATCH') {
    $estado = corpoJson()['estado'] ?? '';

    if (!in_array($estado, ['confirmada', 'cancelada', 'cancelada_cliente', 'cancelada_alojamento'], true)) {
        erro(400, 'CAMPOS', 'Pedido inválido.');
    }

    $consulta = $db->prepare('SELECT r.*, a.nome AS alojamento_nome FROM reservas r LEFT JOIN alojamentos a ON a.id = r.alojamento_id WHERE r.id = ?');
    $consulta->execute([$id]);
    $reserva = $consulta->fetch();

    if (!$reserva) {
        erro(404, 'NAO_ENCONTRADO', 'Reserva não encontrada.');
    }

    if ($estado === 'confirmada') {
        $conflito = $db->prepare("SELECT id FROM reservas
            WHERE id != ? AND alojamento_id = ? AND estado = 'confirmada' AND check_in < ? AND check_out > ?
            LIMIT 1");
        $conflito->execute([$id, $reserva['alojamento_id'], $reserva['check_out'], $reserva['check_in']]);

        if ($conflito->fetch()) {
            erro(409, 'INDISPONIVEL', 'Existe outra reserva confirmada nessas datas.');
        }
    }

    $db->prepare('UPDATE reservas SET estado = ? WHERE id = ?')->execute([$estado, $id]);

    // E-mail de cancelamento
    $emailEnviado = false;

    if ($reserva['estado'] === 'confirmada' && str_starts_with($estado, 'cancelada')) {
        $reserva['estado'] = $estado;
        $emailEnviado = enviarEmailCancelamento($reserva);
    }

    responder(['mensagem' => 'Estado atualizado.', 'email_enviado' => $emailEnviado]);
}

if ($metodo === 'DELETE') {
    $apagar = $db->prepare('DELETE FROM reservas WHERE id = ?');
    $apagar->execute([$id]);

    if ($apagar->rowCount() === 0) {
        erro(404, 'NAO_ENCONTRADO', 'Reserva não encontrada.');
    }

    responder(['mensagem' => 'Reserva eliminada.']);
}

erro(405, 'METODO', 'Método não permitido.');