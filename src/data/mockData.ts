import heroImg from "@/assets/hero-1.jpg";
import hotelImg from "@/assets/hotel-featured.jpg";
import restaurantImg from "@/assets/restaurant-featured.jpg";
import tourismImg from "@/assets/tourism-featured.jpg";
import eventImg from "@/assets/event-featured.jpg";
import cityRioPretoImg from "@/assets/city-riopreto.jpg";

export interface City {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  shortDescription: string;
  population?: string;
  region?: string;
}

export interface EstablishmentGalleryImage {
  url: string;
  caption?: string;
}

export interface GastronomiaDetails {
  cuisineType?: string;
  priceRange?: string;
  specialties?: string[];
  openingHours?: string;
  reservationRequired?: boolean;
  delivery?: boolean;
  liveMusic?: boolean;
  outdoorSeating?: boolean;
  capacity?: number;
  paymentMethods?: string[];
  chefName?: string;
}

export interface HospedagemDetails {
  checkIn?: string;
  checkOut?: string;
  roomTypes?: string[];
  priceRange?: string;
  petsAllowed?: boolean;
  breakfastIncluded?: boolean;
  parkingIncluded?: boolean;
  totalRooms?: number;
  languages?: string[];
  cancellationPolicy?: string;
}

export interface Establishment {
  id: string;
  name: string;
  category: EstablishmentCategory;
  cityId: string;
  cityName: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery?: EstablishmentGalleryImage[];
  amenities: string[];
  phone?: string;
  whatsapp?: string;
  address?: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
  hospedagemDetails?: HospedagemDetails;
  gastronomiaDetails?: GastronomiaDetails;
}

export interface EventItem {
  id: string;
  name: string;
  cityId: string;
  cityName: string;
  date: string;
  endDate?: string;
  description: string;
  image: string;
  type: string;
}

export type EstablishmentCategory =
  | "hospedagem"
  | "gastronomia"
  | "lazer"
  | "cultura"
  | "artesanato"
  | "comercio";

export const categoryLabels: Record<EstablishmentCategory, string> = {
  hospedagem: "Hospedagem",
  gastronomia: "Gastronomia",
  lazer: "Lazer",
  cultura: "Cultura",
  artesanato: "Artesanato",
  comercio: "Comércio",
};

export const categoryIcons: Record<EstablishmentCategory, string> = {
  hospedagem: "🏨",
  gastronomia: "🍽️",
  lazer: "🎡",
  cultura: "🎭",
  artesanato: "🎨",
  comercio: "🛒",
};

export const cities: City[] = [
  {
    id: "sao-jose-do-rio-preto",
    name: "São José do Rio Preto",
    slug: "sao-jose-do-rio-preto",
    description:
      "Capital do noroeste paulista, Rio Preto é conhecida por sua qualidade de vida, gastronomia diversificada e intensa vida cultural. Com mais de 460 mil habitantes, a cidade oferece excelente infraestrutura turística com hotéis, restaurantes e opções de lazer para todos os gostos.",
    image: cityRioPretoImg,
    shortDescription: "A capital do noroeste paulista com vida cultural intensa.",
    population: "464.000",
    region: "Noroeste Paulista",
  },
  {
    id: "ibira",
    name: "Ibirá",
    slug: "ibira",
    description:
      "Conhecida como a Estância Hidrotermal, Ibirá é famosa por suas águas minerais terapêuticas. A cidade atrai visitantes de todo o estado em busca de bem-estar e saúde, com parques aquáticos e fontes naturais.",
    image: tourismImg,
    shortDescription: "Estância hidrotermal com águas minerais terapêuticas.",
    population: "12.000",
    region: "Noroeste Paulista",
  },
  {
    id: "novo-horizonte",
    name: "Novo Horizonte",
    slug: "novo-horizonte",
    description:
      "Cidade acolhedora do interior paulista, com forte tradição agropecuária e festas tradicionais que celebram a cultura caipira. Destaque para a Festa do Peão e eventos culturais ao longo do ano.",
    image: heroImg,
    shortDescription: "Tradição agropecuária e festas típicas do interior.",
    population: "40.000",
    region: "Noroeste Paulista",
  },
  {
    id: "urupes",
    name: "Urupês",
    slug: "urupes",
    description:
      "Terra de Monteiro Lobato, Urupês preserva o charme do interior paulista com suas paisagens rurais, gastronomia típica e hospitalidade que faz jus ao nome da cidade.",
    image: heroImg,
    shortDescription: "Terra de Monteiro Lobato, charme do interior.",
    population: "13.000",
    region: "Noroeste Paulista",
  },
  {
    id: "tabapua",
    name: "Tabapuã",
    slug: "tabapua",
    description:
      "Conhecida como a Terra do Boi, Tabapuã tem forte tradição na pecuária e abriga eventos agropecuários de relevância regional.",
    image: eventImg,
    shortDescription: "A Terra do Boi com tradição pecuária.",
    population: "12.000",
    region: "Noroeste Paulista",
  },
  {
    id: "cedral",
    name: "Cedral",
    slug: "cedral",
    description:
      "Pequena cidade com grande hospitalidade, Cedral oferece tranquilidade e contato com a natureza para quem busca fugir da agitação dos grandes centros.",
    image: heroImg,
    shortDescription: "Tranquilidade e hospitalidade no interior.",
    population: "8.500",
    region: "Noroeste Paulista",
  },
  {
    id: "adolfo",
    name: "Adolfo",
    slug: "adolfo",
    description: "Cidade pacata com rica cultura rural e festas tradicionais.",
    image: heroImg,
    shortDescription: "Cultura rural e festas tradicionais.",
    population: "4.000",
    region: "Noroeste Paulista",
  },
  {
    id: "cubatao",
    name: "Cubatão",
    slug: "cubatao",
    description: "Da cidade símbolo de poluição à referência em recuperação ambiental, Cubatão surpreende com sua Mata Atlântica preservada e trilhas ecológicas.",
    image: tourismImg,
    shortDescription: "Referência em recuperação ambiental com trilhas ecológicas.",
    population: "130.000",
    region: "Baixada Santista",
  },
  {
    id: "sabino",
    name: "Sabino",
    slug: "sabino",
    description: "Cidade tranquila com vocação para o turismo rural e pesca esportiva.",
    image: heroImg,
    shortDescription: "Turismo rural e pesca esportiva.",
    population: "5.500",
    region: "Centro-Oeste Paulista",
  },
  {
    id: "sales",
    name: "Sales",
    slug: "sales",
    description: "Pequena cidade do interior com festas tradicionais e hospitalidade genuína.",
    image: heroImg,
    shortDescription: "Hospitalidade genuína do interior paulista.",
    population: "6.000",
    region: "Noroeste Paulista",
  },
  {
    id: "ubarana",
    name: "Ubarana",
    slug: "ubarana",
    description: "Cidade aconchegante cercada pela natureza e tradições do interior.",
    image: heroImg,
    shortDescription: "Natureza e tradições do interior paulista.",
    population: "6.000",
    region: "Noroeste Paulista",
  },
];

export const establishments: Establishment[] = [
  {
    id: "hotel-rio-preto-palace",
    name: "Rio Preto Palace Hotel",
    category: "hospedagem",
    cityId: "sao-jose-do-rio-preto",
    cityName: "São José do Rio Preto",
    description: "Hotel de luxo no coração de Rio Preto com piscina, spa e restaurante premiado. Localizado na região central, oferece fácil acesso aos principais pontos turísticos e de negócios da cidade. Quartos amplos com decoração contemporânea e vista panorâmica.",
    shortDescription: "Luxo e conforto no coração da cidade.",
    image: hotelImg,
    gallery: [
      { url: hotelImg, caption: "Fachada do hotel" },
      { url: restaurantImg, caption: "Restaurante premiado" },
      { url: tourismImg, caption: "Área de lazer" },
    ],
    amenities: ["Wi-Fi", "Piscina", "Spa", "Restaurante", "Estacionamento", "Academia", "Room Service", "Lavanderia"],
    phone: "(17) 3211-0000",
    whatsapp: "5517932110000",
    address: "Rua Silva Jardim, 3200 - Centro, São José do Rio Preto - SP",
    rating: 4.8,
    latitude: -20.8113,
    longitude: -49.3758,
    hospedagemDetails: {
      checkIn: "14:00",
      checkOut: "12:00",
      roomTypes: ["Standard", "Superior", "Suíte Executiva", "Suíte Presidencial"],
      priceRange: "R$ 280 - R$ 850",
      petsAllowed: false,
      breakfastIncluded: true,
      parkingIncluded: true,
      totalRooms: 120,
      languages: ["Português", "Inglês", "Espanhol"],
      cancellationPolicy: "Cancelamento gratuito até 48h antes do check-in",
    },
  },
  {
    id: "pousada-aguas-ibira",
    name: "Pousada Águas de Ibirá",
    category: "hospedagem",
    cityId: "ibira",
    cityName: "Ibirá",
    description: "Pousada charmosa próxima às fontes termais, ideal para relaxar e recarregar as energias. Ambiente familiar com jardins exuberantes e acesso direto às piscinas de águas minerais naturais.",
    shortDescription: "Charme e tranquilidade nas termas.",
    image: hotelImg,
    gallery: [
      { url: hotelImg, caption: "Vista da pousada" },
      { url: tourismImg, caption: "Piscina termal" },
    ],
    amenities: ["Wi-Fi", "Piscina Termal", "Café da Manhã", "Jardim", "Estacionamento"],
    phone: "(17) 3234-0000",
    whatsapp: "5517932340000",
    address: "Av. das Fontes, 450 - Centro, Ibirá - SP",
    rating: 4.6,
    latitude: -21.0819,
    longitude: -49.6239,
    hospedagemDetails: {
      checkIn: "15:00",
      checkOut: "11:00",
      roomTypes: ["Standard", "Chalé Casal", "Chalé Família"],
      priceRange: "R$ 180 - R$ 420",
      petsAllowed: true,
      breakfastIncluded: true,
      parkingIncluded: true,
      totalRooms: 24,
      languages: ["Português"],
      cancellationPolicy: "Cancelamento gratuito até 24h antes do check-in",
    },
  },
  {
    id: "restaurante-sabor-caipira",
    name: "Sabor Caipira",
    category: "gastronomia",
    cityId: "sao-jose-do-rio-preto",
    cityName: "São José do Rio Preto",
    description: "Culinária típica do interior paulista com ingredientes frescos da região.",
    shortDescription: "O melhor da culinária caipira.",
    image: restaurantImg,
    amenities: ["Estacionamento", "Ar Condicionado", "Acessível"],
    phone: "(17) 3222-1111",
    address: "Rua Bernardino de Campos, 1500 - Centro, São José do Rio Preto - SP",
    latitude: -20.8150,
    longitude: -49.3790,
    gallery: [
      { url: restaurantImg, caption: "Salão principal" },
      { url: hotelImg, caption: "Ambiente externo" },
      { url: tourismImg, caption: "Pratos típicos" },
    ],
    gastronomiaDetails: {
      cuisineType: "Cozinha Caipira / Regional",
      priceRange: "R$ 45 - R$ 120",
      specialties: ["Frango com quiabo", "Leitão à pururuca", "Arroz carreteiro", "Pamonha recheada", "Doce de leite na palha"],
      openingHours: "Ter-Dom: 11h às 15h / 18h às 23h",
      reservationRequired: true,
      delivery: false,
      liveMusic: true,
      outdoorSeating: true,
      capacity: 80,
      paymentMethods: ["Dinheiro", "Pix", "Cartão de Crédito", "Cartão de Débito"],
      chefName: "Chef Maria Aparecida",
    },
  },
  {
    id: "parque-represa-ibira",
    name: "Parque da Represa Municipal",
    category: "lazer",
    cityId: "ibira",
    cityName: "Ibirá",
    description: "Área verde com trilhas, lago para pedalinho e espaço para piqueniques em meio à natureza.",
    shortDescription: "Natureza e lazer ao ar livre.",
    image: tourismImg,
    amenities: ["Trilhas", "Pedalinho", "Playground", "Quiosques"],
    rating: 4.5,
  },
  {
    id: "museu-rio-preto",
    name: "Museu Municipal de Rio Preto",
    category: "cultura",
    cityId: "sao-jose-do-rio-preto",
    cityName: "São José do Rio Preto",
    description: "Acervo histórico da região com exposições permanentes e temporárias.",
    shortDescription: "História e cultura da região.",
    image: heroImg,
    amenities: ["Acessível", "Guia", "Loja de Souvenirs"],
    rating: 4.3,
  },
  {
    id: "artesanato-mao-caipira",
    name: "Ateliê Mão Caipira",
    category: "artesanato",
    cityId: "urupes",
    cityName: "Urupês",
    description: "Artesanato em cerâmica e madeira com técnicas tradicionais passadas por gerações.",
    shortDescription: "Cerâmica e madeira tradicionais.",
    image: heroImg,
    amenities: ["Visita Guiada", "Loja", "Oficinas"],
    rating: 4.9,
  },
];

export const events: EventItem[] = [
  {
    id: "festa-peao-novo-horizonte",
    name: "Festa do Peão de Novo Horizonte",
    cityId: "novo-horizonte",
    cityName: "Novo Horizonte",
    date: "2026-06-15",
    endDate: "2026-06-22",
    description: "Uma das maiores festas do peão do interior paulista, com shows nacionais, rodeio profissional e gastronomia típica.",
    image: eventImg,
    type: "Festival",
  },
  {
    id: "carnaval-rio-preto",
    name: "Carnaval de São José do Rio Preto",
    cityId: "sao-jose-do-rio-preto",
    cityName: "São José do Rio Preto",
    date: "2026-02-14",
    endDate: "2026-02-17",
    description: "Desfiles de blocos e escolas de samba animam a cidade durante o carnaval.",
    image: eventImg,
    type: "Carnaval",
  },
  {
    id: "festa-milho-tabapua",
    name: "Festa do Milho de Tabapuã",
    cityId: "tabapua",
    cityName: "Tabapuã",
    date: "2026-07-10",
    endDate: "2026-07-12",
    description: "Celebração da cultura caipira com pratos típicos à base de milho, quadrilhas e shows.",
    image: eventImg,
    type: "Festival",
  },
  {
    id: "festival-aguas-ibira",
    name: "Festival das Águas de Ibirá",
    cityId: "ibira",
    cityName: "Ibirá",
    date: "2026-09-05",
    endDate: "2026-09-07",
    description: "Festival celebrando as águas minerais com atividades de bem-estar, esporte e cultura.",
    image: tourismImg,
    type: "Festival",
  },
];

export const heroSlides = [
  {
    image: heroImg,
    title: "Descubra o Interior Paulista",
    subtitle: "Hotéis, restaurantes, cultura e lazer nas cidades mais acolhedoras de São Paulo",
  },
  {
    image: cityRioPretoImg,
    title: "São José do Rio Preto",
    subtitle: "A capital do noroeste paulista te espera com gastronomia e cultura de primeira",
  },
  {
    image: tourismImg,
    title: "Natureza & Aventura",
    subtitle: "Cachoeiras, trilhas e paisagens de tirar o fôlego no coração de São Paulo",
  },
];
