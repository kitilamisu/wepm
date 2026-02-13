import { Comic } from './types';

export const COMPANIES = [
  "D&C MEDIA Co. Ltd.",
  "DAEWON C.I. INC.",
  "DCC ENT Co., Ltd",
  "RIVERSE INC.",
  "SEOUL MEDIA COMICS, INC",
  "C&C Revolution Inc.",
  "Haksan Publishing Co.",
  "Toyou's Dream Inc.",
  "YLAB EARTH"
];

export const GENRES = [
  "Action Fantasy",
  "Romance Fantasy",
  "Modern Romance",
  "BL/GL",
  "Thriller",
  "Drama",
  "Sports",
  "School Action",
  "Comedy"
];

export const AGES = ['All', '12+', '15+', '19+'];

// Helper to generate consistent images
const getImg = (id: number) => `https://picsum.photos/300/400?random=${id}`;

export const MOCK_COMICS: Comic[] = [
  // YLAB - TERROR MAN (Matching the screenshot)
  {
    id: 'yl-1',
    title: 'Terror Man',
    originalTitle: '테러맨',
    company: 'YLAB EARTH',
    genre: ['Action Fantasy', 'Thriller'],
    age: '15+',
    status: 'Completed',
    countries: ['KR', 'CN', 'TW', 'JP', 'ID', 'TH'],
    imageUrl: getImg(11),
    description: 'Gifted with the power to see impending misfortune, Jungwoo Min dons the mask of a terrorist to save lives. Walking the fine line between hero and villain, will he ever find happiness — Or is he destined to become the very misfortune he fights?',
    authors: '(Writing) Dongwoo Han / (Drawing) Jinho Ko',
    startYear: '2016',
    platform: 'NAVER WEBTOON',
    format: 'Webcomic / Paperback',
    distributionType: 'Printed',
    promotionalLink: 'comic.naver.com/webtoon/list?titleId=670144',
    targetDemographic: {
      gender: 'ALL',
      ageRanges: ["10's", "20's"]
    }
  },

  // D&C MEDIA
  {
    id: 'dc-1',
    title: 'Solo Leveling',
    originalTitle: '나 혼자만 레벨업',
    company: 'D&C MEDIA Co. Ltd.',
    genre: ['Action Fantasy'],
    age: '12+',
    status: 'Completed',
    countries: ['U.S.', 'China', 'Japan', 'Thailand', 'France'],
    imageUrl: getImg(1),
    description: 'The weakest hunter of all mankind discovers a system that allows only him to level up.',
    authors: 'Chugong (Original), DUBU (Redice Studio)',
    startYear: '2018',
    platform: 'KakaoPage',
    format: 'Webcomic',
    targetDemographic: { gender: 'Male', ageRanges: ["10's", "20's"] }
  },
  {
    id: 'dc-2',
    title: 'Villains Are Destined to Die',
    originalTitle: '악역의 엔딩은 죽음뿐',
    company: 'D&C MEDIA Co. Ltd.',
    genre: ['Romance Fantasy'],
    age: '15+',
    status: 'Ongoing',
    countries: ['U.S.', 'China', 'Japan', 'France', 'Germany'],
    imageUrl: getImg(2),
    description: 'Reincarnated as the villainess in a dating sim, she must avoid the death flags.',
    authors: 'Gwon Gyeoeul',
    startYear: '2020',
    platform: 'KakaoPage',
    format: 'Webcomic'
  },
  {
    id: 'dc-3',
    title: 'The Knight and Her Emperor',
    originalTitle: '황제와 여기사',
    company: 'D&C MEDIA Co. Ltd.',
    genre: ['Romance Fantasy', 'Action Fantasy'],
    age: '15+',
    status: 'Completed',
    countries: ['U.S.', 'China', 'Thailand'],
    imageUrl: getImg(3),
    description: 'A war hero female knight and the emperor who respects her.',
    startYear: '2015'
  },
  
  // RIVERSE
  {
    id: 'rv-1',
    title: 'Omniscient Reader\'s Viewpoint',
    originalTitle: '전지적 독자 시점',
    company: 'RIVERSE INC.',
    genre: ['Action Fantasy', 'Thriller'],
    age: '15+',
    status: 'Ongoing',
    countries: ['Global'],
    imageUrl: getImg(4),
    description: 'Only I know the end of this world. The novel has become reality.',
    authors: 'singNsong (Original), Sleepy-C',
    startYear: '2020',
    platform: 'NAVER WEBTOON'
  },
  {
    id: 'rv-2',
    title: 'Pick Me Up!',
    originalTitle: '픽 미 업',
    company: 'RIVERSE INC.',
    genre: ['Action Fantasy'],
    age: '12+',
    status: 'Ongoing',
    countries: ['Japan', 'France'],
    imageUrl: getImg(5),
    description: 'Pulled into the gacha game he used to master.',
    startYear: '2022'
  },

  // DAEWON
  {
    id: 'dw-1',
    title: 'The Dragon Slayer Academy',
    originalTitle: '드래곤 슬레이어 아카데미',
    company: 'DAEWON C.I. INC.',
    genre: ['School Action', 'Action Fantasy'],
    age: '12+',
    status: 'Ongoing',
    countries: ['USA', 'Japan', 'Taiwan'],
    imageUrl: getImg(6),
    description: 'A prestigious academy for slaying dragons.',
    startYear: '2021'
  },
  {
    id: 'dw-2',
    title: 'I\'m Not a Soccer Genius!',
    originalTitle: '축구천재로 오해받는 중입니다',
    company: 'DAEWON C.I. INC.',
    genre: ['Sports', 'Drama'],
    age: 'All',
    status: 'Ongoing',
    countries: ['USA', 'Japan', 'Indonesia'],
    imageUrl: getImg(7),
    description: 'He just wants to play, but everyone thinks he is a prodigy.'
  },
  {
    id: 'dw-3',
    title: 'Dear Stranger',
    originalTitle: '나를 사랑하지 않는 그대에게',
    company: 'DAEWON C.I. INC.',
    genre: ['Romance Fantasy', 'BL/GL'],
    age: '19+',
    status: 'Completed',
    countries: ['USA', 'Japan', 'Taiwan'],
    imageUrl: getImg(8),
    description: 'An emotional tale of love and estrangement.'
  },

  // C&C
  {
    id: 'cc-1',
    title: 'Love Kibsch Crunch',
    company: 'C&C Revolution Inc.',
    genre: ['BL/GL'],
    age: '19+',
    status: 'Ongoing',
    countries: ['USA', 'France'],
    imageUrl: getImg(9),
    description: 'A sweet and crunchy romance story.'
  },
  {
    id: 'cc-2',
    title: 'Surviving the Game as a Barbarian',
    company: 'C&C Revolution Inc.',
    genre: ['Action Fantasy'],
    age: '15+',
    status: 'Ongoing',
    countries: ['USA', 'France', 'Japan'],
    imageUrl: getImg(10),
    description: 'Dropped into a hardcore RPG as a barbarian character.',
    startYear: '2022'
  },

  // YLAB (Others)
  {
    id: 'yl-2',
    title: 'Island',
    company: 'YLAB EARTH',
    genre: ['Action Fantasy', 'Thriller'],
    age: '19+',
    status: 'Completed',
    countries: ['Global'],
    imageUrl: getImg(12),
    description: 'Demons on Jeju Island are hunting down an heiress.',
    authors: 'Inwan Youn / Kyungil Yang',
    startYear: '2016'
  },
  {
    id: 'yl-3',
    title: 'Get Schooled',
    company: 'YLAB EARTH',
    genre: ['School Action', 'Drama'],
    age: '15+',
    status: 'Ongoing',
    countries: ['Korea', 'China', 'USA'],
    imageUrl: getImg(13),
    description: 'The Ministry of Education creates a bureau to protect teachers\' rights using force.',
    startYear: '2020'
  },

  // Toyou
  {
    id: 'ty-1',
    title: 'God of Blackfield',
    company: "Toyou's Dream Inc.",
    genre: ['Action Fantasy', 'Drama'],
    age: '15+',
    status: 'Ongoing',
    countries: ['Japan', 'US', 'Taiwan'],
    imageUrl: getImg(14),
    description: 'A legend of the French Foreign Legion is reborn.',
    startYear: '2020'
  },
  {
    id: 'ty-2',
    title: 'Shark',
    company: "Toyou's Dream Inc.",
    genre: ['Action Fantasy', 'School Action'],
    age: '15+',
    status: 'Ongoing',
    countries: ['France', 'Germany', 'Japan'],
    imageUrl: getImg(15),
    description: 'A timid boy meets a shark in prison.',
    startYear: '2016'
  },

  // Haksan
  {
    id: 'hk-1',
    title: 'The Red Sleeve',
    company: 'Haksan Publishing Co.',
    genre: ['Romance Fantasy', 'Drama'],
    age: '12+',
    status: 'Completed',
    countries: ['Global'],
    imageUrl: getImg(16),
    description: 'A court romance between a King and a court lady.'
  },
  {
    id: 'hk-2',
    title: 'Return Survival',
    company: 'Haksan Publishing Co.',
    genre: ['Action Fantasy', 'Thriller'],
    age: '19+',
    status: 'Ongoing',
    countries: ['USA', 'Russia', 'China'],
    imageUrl: getImg(17),
    description: 'Surviving a zombie apocalypse, creating a safe zone.'
  },

  // DCC
  {
    id: 'dcc-1',
    title: 'For Daphne',
    company: 'DCC ENT Co., Ltd',
    genre: ['Romance Fantasy'],
    age: '12+',
    status: 'Ongoing',
    countries: ['Global'],
    imageUrl: getImg(18),
    description: 'A romance blooming amidst flowers.'
  },
  {
    id: 'dcc-2',
    title: 'Adelaide',
    company: 'DCC ENT Co., Ltd',
    genre: ['Romance Fantasy'],
    age: 'All',
    status: 'Completed',
    countries: ['China', 'Japan'],
    imageUrl: getImg(19),
    description: 'A dimensional traveler seeking excitement.'
  }
];