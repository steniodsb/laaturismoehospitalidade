
-- Inserir cidades
INSERT INTO public.cities (name, slug, description, short_description, population, region, image_url) VALUES
('São José do Rio Preto', 'sao-jose-do-rio-preto', 'Capital do noroeste paulista, Rio Preto é conhecida por sua qualidade de vida, gastronomia diversificada e intensa vida cultural. Com mais de 460 mil habitantes, a cidade oferece excelente infraestrutura turística com hotéis, restaurantes e opções de lazer para todos os gostos.', 'A capital do noroeste paulista com vida cultural intensa.', '464.000', 'Noroeste Paulista', NULL),
('Ibirá', 'ibira', 'Conhecida como a Estância Hidrotermal, Ibirá é famosa por suas águas minerais terapêuticas. A cidade atrai visitantes de todo o estado em busca de bem-estar e saúde, com parques aquáticos e fontes naturais.', 'Estância hidrotermal com águas minerais terapêuticas.', '12.000', 'Noroeste Paulista', NULL),
('Novo Horizonte', 'novo-horizonte', 'Cidade acolhedora do interior paulista, com forte tradição agropecuária e festas tradicionais que celebram a cultura caipira. Destaque para a Festa do Peão e eventos culturais ao longo do ano.', 'Tradição agropecuária e festas típicas do interior.', '40.000', 'Noroeste Paulista', NULL),
('Urupês', 'urupes', 'Terra de Monteiro Lobato, Urupês preserva o charme do interior paulista com suas paisagens rurais, gastronomia típica e hospitalidade que faz jus ao nome da cidade.', 'Terra de Monteiro Lobato, charme do interior.', '13.000', 'Noroeste Paulista', NULL),
('Tabapuã', 'tabapua', 'Conhecida como a Terra do Boi, Tabapuã tem forte tradição na pecuária e abriga eventos agropecuários de relevância regional.', 'A Terra do Boi com tradição pecuária.', '12.000', 'Noroeste Paulista', NULL),
('Cedral', 'cedral', 'Pequena cidade com grande hospitalidade, Cedral oferece tranquilidade e contato com a natureza para quem busca fugir da agitação dos grandes centros.', 'Tranquilidade e hospitalidade no interior.', '8.500', 'Noroeste Paulista', NULL),
('Adolfo', 'adolfo', 'Cidade pacata com rica cultura rural e festas tradicionais.', 'Cultura rural e festas tradicionais.', '4.000', 'Noroeste Paulista', NULL),
('Cubatão', 'cubatao', 'Da cidade símbolo de poluição à referência em recuperação ambiental, Cubatão surpreende com sua Mata Atlântica preservada e trilhas ecológicas.', 'Referência em recuperação ambiental com trilhas ecológicas.', '130.000', 'Baixada Santista', NULL),
('Sabino', 'sabino', 'Cidade tranquila com vocação para o turismo rural e pesca esportiva.', 'Turismo rural e pesca esportiva.', '5.500', 'Centro-Oeste Paulista', NULL),
('Sales', 'sales', 'Pequena cidade do interior com festas tradicionais e hospitalidade genuína.', 'Hospitalidade genuína do interior paulista.', '6.000', 'Noroeste Paulista', NULL),
('Ubarana', 'ubarana', 'Cidade aconchegante cercada pela natureza e tradições do interior.', 'Natureza e tradições do interior paulista.', '6.000', 'Noroeste Paulista', NULL);

-- Inserir estabelecimentos (usando subqueries para pegar city_id e category_id)
INSERT INTO public.establishments (name, slug, category_id, city_id, description, short_description, amenities, phone, whatsapp, address, rating, latitude, longitude, details) VALUES
(
  'Rio Preto Palace Hotel', 'rio-preto-palace-hotel',
  '79a550c5-6f0e-4bac-9173-f82d76445549',
  (SELECT id FROM public.cities WHERE slug = 'sao-jose-do-rio-preto'),
  'Hotel de luxo no coração de Rio Preto com piscina, spa e restaurante premiado. Localizado na região central, oferece fácil acesso aos principais pontos turísticos e de negócios da cidade.',
  'Luxo e conforto no coração da cidade.',
  ARRAY['Wi-Fi', 'Piscina', 'Spa', 'Restaurante', 'Estacionamento', 'Academia', 'Room Service', 'Lavanderia'],
  '(17) 3211-0000', '5517932110000',
  'Rua Silva Jardim, 3200 - Centro, São José do Rio Preto - SP',
  4.8, -20.8113, -49.3758,
  '{"checkIn":"14:00","checkOut":"12:00","roomTypes":["Standard","Superior","Suíte Executiva","Suíte Presidencial"],"priceRange":"R$ 280 - R$ 850","petsAllowed":false,"breakfastIncluded":true,"parkingIncluded":true,"totalRooms":120,"languages":["Português","Inglês","Espanhol"],"cancellationPolicy":"Cancelamento gratuito até 48h antes do check-in"}'::jsonb
),
(
  'Pousada Águas de Ibirá', 'pousada-aguas-ibira',
  '79a550c5-6f0e-4bac-9173-f82d76445549',
  (SELECT id FROM public.cities WHERE slug = 'ibira'),
  'Pousada charmosa próxima às fontes termais, ideal para relaxar e recarregar as energias. Ambiente familiar com jardins exuberantes e acesso direto às piscinas de águas minerais naturais.',
  'Charme e tranquilidade nas termas.',
  ARRAY['Wi-Fi', 'Piscina Termal', 'Café da Manhã', 'Jardim', 'Estacionamento'],
  '(17) 3234-0000', '5517932340000',
  'Av. das Fontes, 450 - Centro, Ibirá - SP',
  4.6, -21.0819, -49.6239,
  '{"checkIn":"15:00","checkOut":"11:00","roomTypes":["Standard","Chalé Casal","Chalé Família"],"priceRange":"R$ 180 - R$ 420","petsAllowed":true,"breakfastIncluded":true,"parkingIncluded":true,"totalRooms":24,"languages":["Português"],"cancellationPolicy":"Cancelamento gratuito até 24h antes do check-in"}'::jsonb
),
(
  'Sabor Caipira', 'sabor-caipira',
  '4138fb43-0a33-49ff-96df-b2f28c2159e9',
  (SELECT id FROM public.cities WHERE slug = 'sao-jose-do-rio-preto'),
  'Culinária típica do interior paulista com ingredientes frescos da região.',
  'O melhor da culinária caipira.',
  ARRAY['Estacionamento', 'Ar Condicionado', 'Acessível'],
  '(17) 3222-1111', NULL,
  'Rua Bernardino de Campos, 1500 - Centro, São José do Rio Preto - SP',
  NULL, -20.8150, -49.3790,
  '{"cuisineType":"Cozinha Caipira / Regional","priceRange":"R$ 45 - R$ 120","specialties":["Frango com quiabo","Leitão à pururuca","Arroz carreteiro","Pamonha recheada","Doce de leite na palha"],"openingHours":"Ter-Dom: 11h às 15h / 18h às 23h","reservationRequired":true,"delivery":false,"liveMusic":true,"outdoorSeating":true,"capacity":80,"paymentMethods":["Dinheiro","Pix","Cartão de Crédito","Cartão de Débito"],"chefName":"Chef Maria Aparecida"}'::jsonb
),
(
  'Parque da Represa Municipal', 'parque-represa-municipal',
  '40333a3f-66d8-49de-bab2-0d7f91027c40',
  (SELECT id FROM public.cities WHERE slug = 'ibira'),
  'Área verde com trilhas, lago para pedalinho e espaço para piqueniques em meio à natureza.',
  'Natureza e lazer ao ar livre.',
  ARRAY['Trilhas', 'Pedalinho', 'Playground', 'Quiosques'],
  NULL, NULL, NULL,
  4.5, NULL, NULL, '{}'::jsonb
),
(
  'Museu Municipal de Rio Preto', 'museu-municipal-rio-preto',
  'c7ba6b5e-b0c3-4292-841c-791b493b7c16',
  (SELECT id FROM public.cities WHERE slug = 'sao-jose-do-rio-preto'),
  'Acervo histórico da região com exposições permanentes e temporárias.',
  'História e cultura da região.',
  ARRAY['Acessível', 'Guia', 'Loja de Souvenirs'],
  NULL, NULL, NULL,
  4.3, NULL, NULL, '{}'::jsonb
),
(
  'Ateliê Mão Caipira', 'atelie-mao-caipira',
  '7100e69f-4a6f-4025-a6d4-18a513b9a593',
  (SELECT id FROM public.cities WHERE slug = 'urupes'),
  'Artesanato em cerâmica e madeira com técnicas tradicionais passadas por gerações.',
  'Cerâmica e madeira tradicionais.',
  ARRAY['Visita Guiada', 'Loja', 'Oficinas'],
  NULL, NULL, NULL,
  4.9, NULL, NULL, '{}'::jsonb
);

-- Inserir eventos
INSERT INTO public.events (name, city_id, start_date, end_date, description, event_type) VALUES
(
  'Festa do Peão de Novo Horizonte',
  (SELECT id FROM public.cities WHERE slug = 'novo-horizonte'),
  '2026-06-15', '2026-06-22',
  'Uma das maiores festas do peão do interior paulista, com shows nacionais, rodeio profissional e gastronomia típica.',
  'Festival'
),
(
  'Carnaval de São José do Rio Preto',
  (SELECT id FROM public.cities WHERE slug = 'sao-jose-do-rio-preto'),
  '2026-02-14', '2026-02-17',
  'Desfiles de blocos e escolas de samba animam a cidade durante o carnaval.',
  'Carnaval'
),
(
  'Festa do Milho de Tabapuã',
  (SELECT id FROM public.cities WHERE slug = 'tabapua'),
  '2026-07-10', '2026-07-12',
  'Celebração da cultura caipira com pratos típicos à base de milho, quadrilhas e shows.',
  'Festival'
),
(
  'Festival das Águas de Ibirá',
  (SELECT id FROM public.cities WHERE slug = 'ibira'),
  '2026-09-05', '2026-09-07',
  'Festival celebrando as águas minerais com atividades de bem-estar, esporte e cultura.',
  'Festival'
);
