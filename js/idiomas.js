// Idiomas PT / EN
(function () {
  const DICIONARIO = {
    pt: {
      "menu.inicio": "Início",
      "menu.alojamentos": "Alojamentos",
      "menu.experiencia": "A Experiência",
      "menu.nazare": "Nazaré",
      "menu.avaliacoes": "Avaliações",
      "menu.contactos": "Contactos",
      "menu.reservar": "Reservar",
      "idioma.aria": "Mudar idioma",

      "comum.ver_detalhes": "VER DETALHES",
      "comum.hospedes_1": "{n} hóspede",
      "comum.hospedes_n": "{n} hóspedes",
      "comum.quartos_1": "{n} quarto",
      "comum.quartos_n": "{n} quartos",
      "comum.noites_1": "{n} noite",
      "comum.noites_n": "{n} noites",
      "comum.por_noite": "/ noite",
      "comum.sob_consulta": "Sob consulta",
      "comum.carregando": "A carregar…",
      "comum.erro_carregar": "Não foi possível carregar a informação. Tente novamente mais tarde.",

      "rodape.local": "Nazaré, Portugal",
      "rodape.nome": "Apartamentos 7 Saias",

      "inicio.hero_kicker": "APARTAMENTOS 7 SAIAS",
      "inicio.hero_titulo": "Viva a Nazaré\na sua maneira.",
      "inicio.descobrir": "DESCOBRIR ",
      "inicio.desc_pequeno": "DESCUBRA OS 7 SAIAS",
      "inicio.desc_titulo": "Uma estadia com\nidentidade.",
      "inicio.desc_p1": "Os Apartamentos 7 Saias são o ponto de partida perfeito para descobrir a Nazaré.",
      "inicio.desc_p2": "Criámos espaços confortáveis e acolhedores, pensados para que possa aproveitar a vila, o mar e tudo o que a Nazaré tem para oferecer.",
      "inicio.desc_link": "DESCOBRIR MAIS",
      "inicio.exp_pequeno": "A EXPERIÊNCIA",
      "inicio.exp_titulo": "Mais do que\numa estadia.",
      "inicio.exp_p": "Quer esteja na Nazaré para descansar, conhecer a cultura local ou simplesmente aproveitar o mar, os nossos apartamentos foram pensados para tornar a sua estadia simples e confortável.",
      "inicio.exp_link": "CONHECER A EXPERIÊNCIA",
      "inicio.dest_pequeno": "ALOJAMENTOS EM DESTAQUE",
      "inicio.dest_titulo": "Encontre o seu\nespaço na Nazaré.",
      "inicio.dest_p": "Conheça alguns dos espaços onde poderá ficar durante a sua estadia.",
      "inicio.dest_todos": "VER TODOS OS ALOJAMENTOS",
      "inicio.naz_pequeno": "A NAZARÉ",
      "inicio.naz_titulo": "Entre o mar,\na tradição e a história.",
      "inicio.naz_p": "Descubra uma das vilas mais emblemáticas de Portugal, conhecida pelas suas praias, tradições, gastronomia e pelas famosas ondas gigantes.",
      "inicio.naz_link": "SABER MAIS SOBRE A NAZARÉ",
      "inicio.cta_pequeno": "APARTAMENTOS 7 SAIAS",
      "inicio.cta_titulo": "Comece a planear\na sua estadia.",
      "inicio.cta_botao": "RESERVAR AGORA",

      "aloj.titulo_pagina": "Alojamentos | Apartamentos 7 Saias",
      "aloj.kicker": "APARTAMENTOS 7 SAIAS",
      "aloj.titulo": "Alojamentos",
      "aloj.sub": "Descubra os nossos apartamentos, perfeitos para uma estadia inesquecível na Nazaré.",
      "aloj.filtro_todos": "Todos",
      "aloj.filtro_quartos": "Quartos",
      "aloj.vazio": "Não há alojamentos deste tipo neste momento.",
      "aloj.filtro_favoritos": "Favoritos",
      "aloj.sem_favoritos": "Ainda não tem favoritos. Toque no coração de um alojamento para o guardar.",

      "det.titulo_pagina": "{nome} | Apartamentos 7 Saias",
      "det.kicker": "APARTAMENTOS 7 SAIAS - NAZARÉ",
      "det.voltar_pesquisa": "Voltar aos resultados",
      "det.ver_galeria": "+ Ver galeria",
      "det.galeria_label": "DESCUBRA O ALOJAMENTO",
      "det.galeria_titulo": "Um espaço para descobrir.",
      "det.caract": "Características",
      "det.capacidade": "Capacidade:",
      "det.quartos": "Quartos:",
      "det.preco": "Preço:",
      "det.comodidades": "Comodidades",
      "det.titulo_desc": "Conforto e tranquilidade na Nazaré.",
      "det.desc_padrao": "Descubra um espaço acolhedor, pensado para proporcionar uma estadia confortável durante a sua visita à Nazaré.",
      "det.info_padrao": "Desfrute de um ambiente tranquilo e aproveite tudo o que a região tem para oferecer.",
      "det.ocupado_titulo": "Datas já reservadas",
      "det.ocupado_vazio": "De momento não há reservas futuras: todas as datas estão livres.",
      "det.ocupado_intervalo": "{de} → {ate}",
      "det.disponibilidade": "CONSULTAR DISPONIBILIDADE",
      "det.nao_encontrado": "Alojamento não encontrado.",
      "det.fechar": "Fechar",
      "det.anterior": "Fotografia anterior",
      "det.seguinte": "Fotografia seguinte",
      "det.ampliar": "Ampliar fotografia: {divisao}",
      "det.ver_avaliacoes": "Ver todas as avaliações",

      "res.titulo_pagina": "Reservar | Apartamentos 7 Saias",
      "res.kicker": "APARTAMENTOS 7 SAIAS",
      "res.titulo": "Encontre o seu\nalojamento.",
      "res.sub": "Selecione as datas da sua estadia e indique quem vai viajar.",
      "res.checkin": "CHECK-IN",
      "res.checkout": "CHECK-OUT",
      "res.ocupacao": "OCUPAÇÃO",
      "res.tipo": "TIPO",
      "res.tipo_todos": "Todos",
      "res.tipo_quarto": "Quarto",
      "res.tipo_apartamento": "Qualquer apartamento",
      "res.ocupacao_sel": "Selecione a ocupação",
      "res.adultos": "Adultos",
      "res.criancas": "Crianças",
      "res.quartos": "Quartos",
      "res.animal_titulo": "Viaja com animal de estimação?",
      "res.animal_texto": "Os animais de assistência não são considerados animais de estimação.",
      "res.ok": "OK",
      "res.pesquisar": "PESQUISAR DISPONIBILIDADE",
      "res.adultos_1": "{n} adulto",
      "res.adultos_n": "{n} adultos",
      "res.criancas_1": "{n} criança",
      "res.criancas_n": "{n} crianças",
      "res.maximo_pessoas": "Máximo de {n} pessoas (adultos e crianças).",
      "res.quartos_1": "{n} quarto",
      "res.quartos_n": "{n} quartos",
      "res.selecione_datas": "Por favor, selecione as datas da estadia.",
      "res.a_procurar": "A procurar alojamentos disponíveis…",
      "res.disp_label": "DISPONIBILIDADE",
      "res.sem_resultados": "Não encontrámos alojamentos disponíveis.",
      "res.sem_resultados_p": "Experimente outras datas ou altere o número de hóspedes.",
      "res.resultados_label": "ALOJAMENTOS DISPONÍVEIS",
      "res.resultados_titulo": "Encontrámos estes alojamentos para si.",
      "res.ate_hospedes": "Até {n} hóspedes",
      "res.total_estadia": "{total} por {noites}",
      "res.reservar": "RESERVAR",
      "res.ver_detalhes": "Ver detalhes",
      "res.falha_pesquisa": "Não foi possível pesquisar.",
      "res.dados_label": "OS SEUS DADOS",
      "res.dados_titulo": "Complete a sua reserva.",
      "res.resumo_datas": "{de} → {ate} · {noites}",
      "res.resumo_total": "Total: {total}",
      "res.nome": "Nome completo",
      "res.email": "E-mail",
      "res.telefone": "Telefone",
      "res.notas": "Pedidos especiais (opcional)",
      "res.obrigatorios": "Os campos com",
      "res.obrigatorios2": "são obrigatórios.",
      "res.ajuda_nome": "Escreva pelo menos 3 letras.",
      "res.ajuda_email": "Formato esperado: nome@dominio.pt",
      "res.ajuda_telefone": "9 dígitos, a começar por 9 ou 2 (ex: 912345678).",
      "res.ajuda_telefone_outro": "Só números, entre 6 e 15 dígitos, sem o indicativo.",
      "res.indicativo": "Indicativo do país",
      "res.ajuda_notas": "Máximo de 500 caracteres.",
      "res.codigo": "Código promocional (opcional)",
      "res.aplicar": "APLICAR",
      "res.codigo_ok": "Código {codigo} aplicado: desconto de {pct}%.",
      "res.desconto": "Desconto ({codigo}, {pct}%): −{valor}",
      "res.cliente_habitual": "cliente habitual",
      "res.habitual_info": "Já ficou connosco? Clientes habituais têm 10% de desconto, aplicado automaticamente ao confirmar.",
      "res.voltar": "VOLTAR AOS RESULTADOS",
      "res.confirmar": "CONFIRMAR RESERVA",
      "res.a_enviar": "A enviar…",
      "res.conf_label": "RESERVA CONFIRMADA",
      "res.conf_titulo": "Obrigado, {nome}!",
      "res.conf_numero": "Referência: {id}",
      "res.conf_email": "Enviámos a confirmação para {email}.",
      "res.conf_email_simulado": "A sua reserva ficou registada, mas não foi possível enviar o e-mail de confirmação. Se precisar, contacte-nos.",
      "res.conf_nova": "FAZER OUTRA RESERVA",
      "res.conf_inicio": "VOLTAR AO INÍCIO",

      "err.DATAS_INVALIDAS": "Selecione datas de entrada e saída válidas.",
      "err.DATA_PASSADA": "A data de entrada não pode ser anterior a hoje.",
      "err.HOSPEDES_INVALIDOS": "O número de hóspedes ou de quartos é inválido.",
      "err.CAMPOS": "Preencha todos os campos obrigatórios.",
      "err.EMAIL": "O e-mail indicado não é válido.",
      "err.CODIGO_INVALIDO": "Este código não é válido ou já expirou.",
      "err.CAPACIDADE": "O alojamento não tem capacidade para tantos hóspedes.",
      "err.INDISPONIVEL": "Este alojamento acabou de ficar indisponível para essas datas. Escolha outras datas ou outro alojamento.",
      "err.NAO_ENCONTRADO": "Alojamento não encontrado.",
      "err.ERRO": "Ocorreu um erro. Tente novamente.",
      "err.REDE": "Não foi possível comunicar com o servidor.",

      "exp.titulo_pagina": "A Experiência | Apartamentos 7 Saias",
      "exp.kicker": "APARTAMENTOS 7 SAIAS",
      "exp.titulo": "A Experiência",
      "exp.sub": "Mais do que uma estadia: a Nazaré vivida com calma, conforto e liberdade.",
      "exp.s1_pequeno": "FIQUE COMO EM CASA",
      "exp.s1_titulo": "Espaços pensados\npara si.",
      "exp.s1_p1": "Cada apartamento foi preparado para que se sinta em casa: espaços acolhedores, cozinha para fazer as suas refeições e a privacidade de quem quer descansar ao seu ritmo.",
      "exp.s1_p2": "Reserve diretamente no nosso website, sem intermediários, e escolha o alojamento que melhor se adapta ao seu grupo.",
      "exp.s2_pequeno": "PERTO DE TUDO",
      "exp.s2_titulo": "A vila, o mar\ne as tradições.",
      "exp.s2_p1": "Da praia aos miradouros, dos restaurantes às ruas tradicionais, os 7 Saias são o ponto de partida ideal para explorar a Nazaré.",
      "exp.s2_p2": "Passeie à beira-mar, visite o Sítio, prove o peixe fresco e deixe-se surpreender pelas ondas gigantes no inverno.",
      "exp.cta_titulo": "Pronto para viver a Nazaré?",
      "exp.cta_botao": "VER ALOJAMENTOS",

      "naz.titulo_pagina": "Nazaré | Apartamentos 7 Saias",
      "naz.kicker": "APARTAMENTOS 7 SAIAS",
      "naz.titulo": "Nazaré",
      "naz.sub": "Entre o mar, a tradição e a história.",
      "naz.intro_pequeno": "A VILA",
      "naz.intro_titulo": "Uma vila com\nalma de mar.",
      "naz.intro_p": "A Nazaré é uma das vilas piscatórias mais conhecidas de Portugal. Combina uma grande praia, bairros tradicionais, gastronomia assente no peixe e no marisco, e um ambiente que muda ao ritmo das estações.",
      "naz.c1_titulo": "Ondas gigantes",
      "naz.c1_p": "Na Praia do Norte, junto ao Forte de São Miguel Arcanjo, formam-se algumas das maiores ondas surfáveis do mundo, sobretudo entre o outono e o inverno.",
      "naz.c2_titulo": "O Sítio",
      "naz.c2_p": "O bairro alto da vila, com vista sobre a praia, o Santuário de Nossa Senhora da Nazaré e o Elevador (funicular) que liga o Sítio à praia.",
      "naz.c3_titulo": "Gastronomia",
      "naz.c3_p": "Peixe grelhado, caldeirada e peixe seco ao sol, uma imagem de marca da praia da Nazaré.",
      "naz.c4_titulo": "Tradições",
      "naz.c4_p": "As mulheres da Nazaré são célebres pelas sete saias, tradição que inspira o nome dos nossos apartamentos.",
      "naz.cta_titulo": "Fique perto de tudo.",
      "naz.cta_botao": "RESERVAR AGORA",

      "cont.titulo_pagina": "Contactos | Apartamentos 7 Saias",
      "cont.kicker": "APARTAMENTOS 7 SAIAS",
      "cont.titulo": "Contactos",
      "cont.sub": "Estamos disponíveis para ajudar a planear a sua estadia.",
      "cont.info_titulo": "Como falar connosco",
      "cont.morada": "Morada",
      "cont.morada_valor": "Nazaré, Portugal",
      "cont.email": "E-mail",
      "cont.telefone": "Telefone",
      "cont.site": "Website",
      "cont.mapa_titulo": "Localização",
      "cont.mapa_ver": "Abrir mapa maior",
      "cont.util_titulo": "Informações úteis",
      "cont.util_1": "As reservas são feitas diretamente neste website.",
      "cont.util_2": "Receberá um e-mail de confirmação com o número da reserva.",
      "cont.util_3": "Pode consultar a disponibilidade para as datas que pretende antes de reservar.",
      "cont.cta": "FAZER UMA RESERVA",

      "am.Wi-Fi gratuito": "Wi-Fi gratuito",
      "am.Piscina": "Piscina",
      "am.Cozinha equipada": "Cozinha equipada",
      "am.Ar condicionado": "Ar condicionado",
      "am.Estacionamento": "Estacionamento",

      "div.Quarto": "Quarto",
      "div.Sala de jantar": "Sala de jantar",
      "div.Cozinha e sala": "Cozinha e sala",
      "div.Casa de banho": "Casa de banho",
      "div.Exterior e vista": "Exterior e vista",
      "div.Piscina": "Piscina",
      "div.Fotografia": "Fotografia"
    },

    en: {
      "menu.inicio": "Home",
      "menu.alojamentos": "Accommodation",
      "menu.experiencia": "The Experience",
      "menu.nazare": "Nazaré",
      "menu.avaliacoes": "Reviews",
      "menu.contactos": "Contact",
      "menu.reservar": "Book",
      "idioma.aria": "Change language",

      "comum.ver_detalhes": "VIEW DETAILS",
      "comum.hospedes_1": "{n} guest",
      "comum.hospedes_n": "{n} guests",
      "comum.quartos_1": "{n} bedroom",
      "comum.quartos_n": "{n} bedrooms",
      "comum.noites_1": "{n} night",
      "comum.noites_n": "{n} nights",
      "comum.por_noite": "/ night",
      "comum.sob_consulta": "On request",
      "comum.carregando": "Loading…",
      "comum.erro_carregar": "We could not load the information. Please try again later.",

      "rodape.local": "Nazaré, Portugal",
      "rodape.nome": "Apartamentos 7 Saias",

      "inicio.hero_kicker": "APARTAMENTOS 7 SAIAS",
      "inicio.hero_titulo": "Live Nazaré\nyour own way.",
      "inicio.descobrir": "DISCOVER ",
      "inicio.desc_pequeno": "DISCOVER 7 SAIAS",
      "inicio.desc_titulo": "A stay with\ncharacter.",
      "inicio.desc_p1": "Apartamentos 7 Saias is the perfect starting point to discover Nazaré.",
      "inicio.desc_p2": "We created comfortable, welcoming spaces so you can enjoy the town, the sea and everything Nazaré has to offer.",
      "inicio.desc_link": "DISCOVER MORE",
      "inicio.exp_pequeno": "THE EXPERIENCE",
      "inicio.exp_titulo": "More than\njust a stay.",
      "inicio.exp_p": "Whether you are in Nazaré to relax, to explore the local culture or simply to enjoy the sea, our apartments were designed to make your stay simple and comfortable.",
      "inicio.exp_link": "EXPLORE THE EXPERIENCE",
      "inicio.dest_pequeno": "FEATURED ACCOMMODATION",
      "inicio.dest_titulo": "Find your\nplace in Nazaré.",
      "inicio.dest_p": "Get to know some of the places where you can stay.",
      "inicio.dest_todos": "VIEW ALL ACCOMMODATION",
      "inicio.naz_pequeno": "NAZARÉ",
      "inicio.naz_titulo": "Between sea,\ntradition and history.",
      "inicio.naz_p": "Discover one of Portugal’s most emblematic towns, known for its beaches, traditions, food and its famous giant waves.",
      "inicio.naz_link": "LEARN MORE ABOUT NAZARÉ",
      "inicio.cta_pequeno": "APARTAMENTOS 7 SAIAS",
      "inicio.cta_titulo": "Start planning\nyour stay.",
      "inicio.cta_botao": "BOOK NOW",

      "aloj.titulo_pagina": "Accommodation | Apartamentos 7 Saias",
      "aloj.kicker": "APARTAMENTOS 7 SAIAS",
      "aloj.titulo": "Accommodation",
      "aloj.sub": "Discover our apartments, perfect for an unforgettable stay in Nazaré.",
      "aloj.filtro_todos": "All",
      "aloj.filtro_quartos": "Rooms",
      "aloj.vazio": "There is no accommodation of this type at the moment.",
      "aloj.filtro_favoritos": "Favourites",
      "aloj.sem_favoritos": "No favourites yet. Tap the heart on any accommodation to save it.",

      "det.titulo_pagina": "{nome} | Apartamentos 7 Saias",
      "det.kicker": "APARTAMENTOS 7 SAIAS - NAZARÉ",
      "det.voltar_pesquisa": "Back to results",
      "det.ver_galeria": "+ View gallery",
      "det.galeria_label": "DISCOVER THE ACCOMMODATION",
      "det.galeria_titulo": "A space to discover.",
      "det.caract": "Features",
      "det.capacidade": "Capacity:",
      "det.quartos": "Bedrooms:",
      "det.preco": "Price:",
      "det.comodidades": "Amenities",
      "det.titulo_desc": "Comfort and calm in Nazaré.",
      "det.desc_padrao": "Discover a welcoming space designed to give you a comfortable stay during your visit to Nazaré.",
      "det.info_padrao": "Enjoy a quiet atmosphere and make the most of everything the region has to offer.",
      "det.ocupado_titulo": "Dates already booked",
      "det.ocupado_vazio": "There are no upcoming bookings at the moment: all dates are free.",
      "det.ocupado_intervalo": "{de} → {ate}",
      "det.disponibilidade": "CHECK AVAILABILITY",
      "det.nao_encontrado": "Accommodation not found.",
      "det.fechar": "Close",
      "det.anterior": "Previous photo",
      "det.seguinte": "Next photo",
      "det.ampliar": "Enlarge photo: {divisao}",
      "det.ver_avaliacoes": "See all reviews",

      "res.titulo_pagina": "Book | Apartamentos 7 Saias",
      "res.kicker": "APARTAMENTOS 7 SAIAS",
      "res.titulo": "Find your\naccommodation.",
      "res.sub": "Select your dates and tell us who is travelling.",
      "res.checkin": "CHECK-IN",
      "res.checkout": "CHECK-OUT",
      "res.ocupacao": "GUESTS",
      "res.tipo": "TYPE",
      "res.tipo_todos": "All",
      "res.tipo_quarto": "Room",
      "res.tipo_apartamento": "Any apartment",
      "res.ocupacao_sel": "Select guests",
      "res.adultos": "Adults",
      "res.criancas": "Children",
      "res.quartos": "Bedrooms",
      "res.animal_titulo": "Travelling with a pet?",
      "res.animal_texto": "Assistance animals are not considered pets.",
      "res.ok": "OK",
      "res.pesquisar": "CHECK AVAILABILITY",
      "res.adultos_1": "{n} adult",
      "res.adultos_n": "{n} adults",
      "res.criancas_1": "{n} child",
      "res.criancas_n": "{n} children",
      "res.maximo_pessoas": "Maximum {n} guests (adults and children).",
      "res.quartos_1": "{n} bedroom",
      "res.quartos_n": "{n} bedrooms",
      "res.selecione_datas": "Please select the dates of your stay.",
      "res.a_procurar": "Searching for available accommodation…",
      "res.disp_label": "AVAILABILITY",
      "res.sem_resultados": "We found no available accommodation.",
      "res.sem_resultados_p": "Try other dates or change the number of guests.",
      "res.resultados_label": "AVAILABLE ACCOMMODATION",
      "res.resultados_titulo": "We found these places for you.",
      "res.ate_hospedes": "Up to {n} guests",
      "res.total_estadia": "{total} for {noites}",
      "res.reservar": "BOOK",
      "res.ver_detalhes": "View details",
      "res.falha_pesquisa": "The search could not be completed.",
      "res.dados_label": "YOUR DETAILS",
      "res.dados_titulo": "Complete your booking.",
      "res.resumo_datas": "{de} → {ate} · {noites}",
      "res.resumo_total": "Total: {total}",
      "res.nome": "Full name",
      "res.email": "E-mail",
      "res.telefone": "Phone",
      "res.notas": "Special requests (optional)",
      "res.obrigatorios": "Fields marked with",
      "res.obrigatorios2": "are required.",
      "res.ajuda_nome": "Please enter at least 3 letters.",
      "res.ajuda_email": "Expected format: name@domain.com",
      "res.ajuda_telefone": "9 digits, starting with 9 or 2 (e.g. 912345678).",
      "res.ajuda_telefone_outro": "Numbers only, 6 to 15 digits, without the country code.",
      "res.indicativo": "Country code",
      "res.ajuda_notas": "Maximum 500 characters.",
      "res.codigo": "Promo code (optional)",
      "res.aplicar": "APPLY",
      "res.codigo_ok": "Code {codigo} applied: {pct}% off.",
      "res.desconto": "Discount ({codigo}, {pct}%): −{valor}",
      "res.cliente_habitual": "returning guest",
      "res.habitual_info": "Stayed with us before? Returning guests get 10% off, applied automatically when you confirm.",
      "res.voltar": "BACK TO RESULTS",
      "res.confirmar": "CONFIRM BOOKING",
      "res.a_enviar": "Sending…",
      "res.conf_label": "BOOKING CONFIRMED",
      "res.conf_titulo": "Thank you, {nome}!",
      "res.conf_numero": "Reference: {id}",
      "res.conf_email": "We sent the confirmation to {email}.",
      "res.conf_email_simulado": "Your booking has been registered, but we could not send the confirmation e-mail. Please contact us if you need anything.",
      "res.conf_nova": "MAKE ANOTHER BOOKING",
      "res.conf_inicio": "BACK TO HOME",

      "err.DATAS_INVALIDAS": "Please select valid check-in and check-out dates.",
      "err.DATA_PASSADA": "The check-in date cannot be before today.",
      "err.HOSPEDES_INVALIDOS": "The number of guests or bedrooms is not valid.",
      "err.CAMPOS": "Please fill in all required fields.",
      "err.EMAIL": "The e-mail address is not valid.",
      "err.CODIGO_INVALIDO": "This code is not valid or has expired.",
      "err.CAPACIDADE": "This accommodation cannot host that many guests.",
      "err.INDISPONIVEL": "This accommodation has just become unavailable for those dates. Please choose other dates or another place.",
      "err.NAO_ENCONTRADO": "Accommodation not found.",
      "err.ERRO": "Something went wrong. Please try again.",
      "err.REDE": "We could not reach the server.",

      "exp.titulo_pagina": "The Experience | Apartamentos 7 Saias",
      "exp.kicker": "APARTAMENTOS 7 SAIAS",
      "exp.titulo": "The Experience",
      "exp.sub": "More than a stay: Nazaré lived calmly, comfortably and freely.",
      "exp.s1_pequeno": "FEEL AT HOME",
      "exp.s1_titulo": "Spaces designed\nfor you.",
      "exp.s1_p1": "Each apartment is prepared so you feel at home: welcoming spaces, a kitchen for your own meals and the privacy to rest at your own pace.",
      "exp.s1_p2": "Book directly on our website, with no middlemen, and choose the accommodation that best suits your group.",
      "exp.s2_pequeno": "CLOSE TO EVERYTHING",
      "exp.s2_titulo": "The town, the sea\nand the traditions.",
      "exp.s2_p1": "From the beach to the viewpoints, from restaurants to traditional streets, 7 Saias is the ideal base to explore Nazaré.",
      "exp.s2_p2": "Stroll along the seafront, visit the Sítio, taste the fresh fish and be amazed by the giant waves in winter.",
      "exp.cta_titulo": "Ready to live Nazaré?",
      "exp.cta_botao": "VIEW ACCOMMODATION",

      "naz.titulo_pagina": "Nazaré | Apartamentos 7 Saias",
      "naz.kicker": "APARTAMENTOS 7 SAIAS",
      "naz.titulo": "Nazaré",
      "naz.sub": "Between sea, tradition and history.",
      "naz.intro_pequeno": "THE TOWN",
      "naz.intro_titulo": "A town with\na sea soul.",
      "naz.intro_p": "Nazaré is one of Portugal’s best-known fishing towns. It combines a long beach, traditional neighbourhoods, cuisine based on fish and seafood, and an atmosphere that changes with the seasons.",
      "naz.c1_titulo": "Giant waves",
      "naz.c1_p": "At Praia do Norte, next to the Fort of São Miguel Arcanjo, some of the biggest surfable waves in the world form, mostly between autumn and winter.",
      "naz.c2_titulo": "O Sítio",
      "naz.c2_p": "The upper part of the town, with views over the beach, the Sanctuary of Nossa Senhora da Nazaré and the funicular that links the Sítio to the beach.",
      "naz.c3_titulo": "Food",
      "naz.c3_p": "Grilled fish, caldeirada stew and sun-dried fish, a trademark image of Nazaré beach.",
      "naz.c4_titulo": "Traditions",
      "naz.c4_p": "The women of Nazaré are famous for wearing seven skirts, a tradition that inspires the name of our apartments.",
      "naz.cta_titulo": "Stay close to everything.",
      "naz.cta_botao": "BOOK NOW",

      "cont.titulo_pagina": "Contact | Apartamentos 7 Saias",
      "cont.kicker": "APARTAMENTOS 7 SAIAS",
      "cont.titulo": "Contact",
      "cont.sub": "We are here to help you plan your stay.",
      "cont.info_titulo": "How to reach us",
      "cont.morada": "Address",
      "cont.morada_valor": "Nazaré, Portugal",
      "cont.email": "E-mail",
      "cont.telefone": "Phone",
      "cont.site": "Website",
      "cont.mapa_titulo": "Location",
      "cont.mapa_ver": "Open larger map",
      "cont.util_titulo": "Useful information",
      "cont.util_1": "Bookings are made directly on this website.",
      "cont.util_2": "You will receive a confirmation e-mail with your booking number.",
      "cont.util_3": "You can check availability for your dates before booking.",
      "cont.cta": "MAKE A BOOKING",

      "am.Wi-Fi gratuito": "Free Wi-Fi",
      "am.Piscina": "Swimming pool",
      "am.Cozinha equipada": "Equipped kitchen",
      "am.Ar condicionado": "Air conditioning",
      "am.Estacionamento": "Parking",

      "div.Quarto": "Bedroom",
      "div.Sala de jantar": "Dining room",
      "div.Cozinha e sala": "Kitchen and living room",
      "div.Casa de banho": "Bathroom",
      "div.Exterior e vista": "Exterior and view",
      "div.Piscina": "Pool",
      "div.Fotografia": "Photo"
    }
  };

  const CHAVE = "idioma7saias";
  const ouvintes = [];

  function guardado() {
    try {
      return localStorage.getItem(CHAVE);
    } catch (e) {
      return null;
    }
  }

  let idioma = guardado();

  if (idioma !== "pt" && idioma !== "en") {
    idioma = (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";
  }

  function existe(chave) {
    return Object.prototype.hasOwnProperty.call(DICIONARIO[idioma], chave);
  }

  function t(chave, valores) {
    let texto = existe(chave) ? DICIONARIO[idioma][chave] : (DICIONARIO.pt[chave] ?? chave);

    if (valores) {
      Object.keys(valores).forEach((k) => {
        texto = texto.split("{" + k + "}").join(valores[k]);
      });
    }

    return texto;
  }

  function plural(base, n) {
    return t(base + (Number(n) === 1 ? "_1" : "_n"), { n });
  }

  function formatarEuros(valor) {
    return new Intl.NumberFormat(idioma === "en" ? "en-GB" : "pt-PT", {
      style: "currency",
      currency: "EUR"
    }).format(valor);
  }

  // Formatar data
  function formatarData(iso) {
    const [a, m, d] = String(iso).split("-").map(Number);

    return new Date(a, m - 1, d).toLocaleDateString(idioma === "en" ? "en-GB" : "pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  function traduzirComodidade(nome) {
    const chave = "am." + nome;
    return existe(chave) ? t(chave) : nome;
  }

  // Traduzir divisões
  function traduzirDivisao(divisao) {
    const m = /^(.*?)(\s+\d+)?$/.exec(String(divisao).trim());
    const base = m ? m[1] : divisao;
    const numero = m && m[2] ? m[2] : "";
    const chave = "div." + base;

    return (existe(chave) ? t(chave) : base) + numero;
  }

  // Nome sem tipologia
  function nomeCurto(nome) {
    return String(nome).replace(/^(T[1-9]|Quarto)\s*[-–]\s*/i, "");
  }

  function aplicar() {
    document.documentElement.lang = idioma === "pt" ? "pt-PT" : "en";

    document.querySelectorAll("[data-idiomas]").forEach((el) => {
      el.textContent = t(el.dataset.idiomas);
    });

    document.querySelectorAll("[data-idiomas-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.idiomasAria));
    });

    document.querySelectorAll("[data-idiomas-ph]").forEach((el) => {
      el.setAttribute("placeholder", t(el.dataset.idiomasPh));
    });

    const chaveTitulo = document.documentElement.dataset.titulo;

    if (chaveTitulo) {
      document.title = t(chaveTitulo);
    }

    const botao = document.querySelector(".idioma-btn");

    if (botao) {
      botao.textContent = idioma === "pt" ? "EN" : "PT";
      botao.setAttribute("aria-label", t("idioma.aria"));
      botao.lang = idioma === "pt" ? "en" : "pt";
    }
  }

  function mudar(novo) {
    idioma = novo;

    try {
      localStorage.setItem(CHAVE, idioma);
    } catch (e) {
      // sem armazenamento 
    }

    aplicar();
    ouvintes.forEach((fn) => fn(idioma));
  }

  function criarBotao() {
    const nav = document.querySelector("header nav");

    if (!nav || nav.querySelector(".idioma-btn")) return;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "idioma-btn";
    botao.addEventListener("click", () => mudar(idioma === "pt" ? "en" : "pt"));
    nav.appendChild(botao);
  }

  window.idiomas = {
    t,
    plural,
    existe,
    formatarEuros,
    formatarData,
    traduzirComodidade,
    traduzirDivisao,
    nomeCurto,
    idioma: () => idioma,
    mudar,
    aoMudar: (fn) => ouvintes.push(fn)
  };

  document.addEventListener("DOMContentLoaded", () => {
    aplicar();
    setTimeout(() => ouvintes.forEach((fn) => fn(idioma)), 0);
  });
})();