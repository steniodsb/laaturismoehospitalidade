

## Plano: Formulários dinâmicos por categoria no modal de estabelecimentos

### Resumo
Refatorar o modal de criação/edição de estabelecimentos para exibir campos específicos conforme a categoria selecionada. Também criar um bucket de storage para upload de fotos (imagem principal + galeria).

### Campos por categoria

**Campos comuns (todas as categorias):**
Nome, Slug, Categoria, Cidade, Descrição curta, Descrição, Telefone, WhatsApp, Endereço, Comodidades, Tags, Latitude, Longitude, Imagem principal (upload), Galeria de fotos (upload múltiplo)

**Hospedagem** (slug: `hospedagem`):
- Check-in / Check-out (horários)
- Tipos de quarto (lista editável)
- Faixa de preço
- Pets permitidos (sim/não)
- Café da manhã incluso (sim/não)
- Estacionamento incluso (sim/não)
- Total de quartos
- Idiomas atendidos (lista)
- Política de cancelamento

**Gastronomia** (slug: `gastronomia`):
- Tipo de cozinha
- Faixa de preço
- Especialidades (lista editável)
- Horário de funcionamento
- Reserva necessária (sim/não)
- Delivery (sim/não)
- Música ao vivo (sim/não)
- Área externa (sim/não)
- Capacidade
- Formas de pagamento (lista)
- Nome do chef

**Lazer:**
- Horário de funcionamento
- Faixa de preço / Entrada gratuita
- Faixa etária recomendada
- Atividades disponíveis (lista)

**Cultura:**
- Horário de funcionamento
- Entrada gratuita / preço
- Tipo (museu, teatro, galeria, etc.)
- Exposições atuais

**Artesanato:**
- Produtos oferecidos (lista)
- Oficinas disponíveis (sim/não)
- Horário de funcionamento

**Comércio / Serviços / Emergência / Utilidade Pública:**
- Horário de funcionamento
- Serviços oferecidos (lista)

Todos esses campos específicos serão armazenados na coluna `details` (JSONB) que já existe na tabela `establishments`.

### Etapas de implementação

1. **Criar bucket de storage** (`establishment-images`) via migration SQL, com políticas RLS para admins fazerem upload e acesso público para leitura.

2. **Criar componentes de formulário por categoria:**
   - `src/components/admin/establishment-forms/CommonFields.tsx` — campos compartilhados
   - `src/components/admin/establishment-forms/HospedagemFields.tsx`
   - `src/components/admin/establishment-forms/GastronomiaFields.tsx`
   - `src/components/admin/establishment-forms/LazerFields.tsx`
   - `src/components/admin/establishment-forms/CulturaFields.tsx`
   - `src/components/admin/establishment-forms/ArtesanatoFields.tsx`
   - `src/components/admin/establishment-forms/GenericFields.tsx` (comércio, serviços, emergência, utilidade)
   - `src/components/admin/establishment-forms/ImageUpload.tsx` — componente de upload de imagem única
   - `src/components/admin/establishment-forms/GalleryUpload.tsx` — componente de upload múltiplo com preview e reordenação

3. **Refatorar `EstablishmentsAdminPage.tsx`:**
   - O estado `form` passa a incluir um objeto `details` dinâmico
   - Ao selecionar a categoria, renderizar os campos específicos correspondentes
   - Upload de imagens via Supabase Storage antes do submit
   - Salvar URLs das imagens nos campos `image_url` e `details.gallery`

4. **Adicionar coluna `gallery` ao banco** (migration) — array de JSONB com `url` e `caption` dentro de `details`, sem necessidade de nova coluna.

### Detalhes técnicos
- Imagens são enviadas ao bucket `establishment-images` com path: `{establishment_id}/{filename}`
- A galeria é armazenada em `details.gallery` como array de objetos `{url, caption}`
- Campos específicos da categoria ficam em `details` (ex: `details.checkIn`, `details.cuisineType`)
- O modal aumenta de largura (`max-w-2xl`) para acomodar os novos campos

