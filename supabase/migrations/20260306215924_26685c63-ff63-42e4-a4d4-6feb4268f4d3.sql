
-- Update cities with image URLs
UPDATE cities SET image_url = '/images/city-riopreto.jpg' WHERE name = 'São José do Rio Preto';
UPDATE cities SET image_url = '/images/tourism-featured.jpg' WHERE name = 'Ibirá';
UPDATE cities SET image_url = '/images/hero-1.jpg' WHERE name IN ('Novo Horizonte', 'Urupês', 'Cedral', 'Adolfo');
UPDATE cities SET image_url = '/images/event-featured.jpg' WHERE name = 'Tabapuã';
UPDATE cities SET image_url = '/images/tourism-featured.jpg' WHERE name = 'Cubatão';
UPDATE cities SET image_url = '/images/hero-1.jpg' WHERE name IN ('Sabino', 'Sales', 'Ubarana');

-- Update establishments with image URLs (only those without images)
UPDATE establishments SET image_url = '/images/hotel-featured.jpg' WHERE name = 'Rio Preto Palace Hotel' AND image_url IS NULL;
UPDATE establishments SET image_url = '/images/hotel-featured.jpg' WHERE name = 'Pousada Águas de Ibirá' AND image_url IS NULL;
UPDATE establishments SET image_url = '/images/restaurant-featured.jpg' WHERE name = 'Sabor Caipira' AND image_url IS NULL;
UPDATE establishments SET image_url = '/images/tourism-featured.jpg' WHERE name = 'Parque da Represa Municipal' AND image_url IS NULL;
UPDATE establishments SET image_url = '/images/hero-1.jpg' WHERE name = 'Museu Municipal de Rio Preto' AND image_url IS NULL;
UPDATE establishments SET image_url = '/images/hero-1.jpg' WHERE name = 'Ateliê Mão Caipira' AND image_url IS NULL;

-- Update events with image URLs
UPDATE events SET image_url = '/images/event-featured.jpg' WHERE name = 'Festa do Peão de Novo Horizonte';
UPDATE events SET image_url = '/images/event-featured.jpg' WHERE name = 'Carnaval de São José do Rio Preto';
UPDATE events SET image_url = '/images/event-featured.jpg' WHERE name = 'Festa do Milho de Tabapuã';
UPDATE events SET image_url = '/images/tourism-featured.jpg' WHERE name = 'Festival das Águas de Ibirá';

-- Update banners
UPDATE banners SET image_url = '/images/hero-1.jpg' WHERE image_url IS NULL OR image_url = '';
