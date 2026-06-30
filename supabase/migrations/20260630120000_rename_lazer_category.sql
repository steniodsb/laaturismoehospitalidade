-- Renomeia a categoria "Lazer" para "Atrativos Turísticos/Lazer" (nome de exibição).
-- O slug permanece "lazer" para não quebrar links (/explorar?cat=lazer) e filtros existentes.
UPDATE public.categories
SET name = 'Atrativos Turísticos/Lazer'
WHERE slug = 'lazer';
