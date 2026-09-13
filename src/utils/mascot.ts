// Mascot moods and image paths for Paçoca

export type MascotMood =
  | 'official'
  | 'correct'
  | 'wrong'
  | 'tip'
  | 'proud'
  | 'scared'
  | 'frenzy'
  | 'rest'
  | 'surprised';

export interface MascotInfo {
  image: string;
  alt: string;
  defaultPhrase: string;
}

export const MASCOT_DATA: Record<MascotMood, MascotInfo> = {
  official: {
    image: './mascot/mascoteoficial.png',
    alt: 'Paçoca Oficial',
    defaultPhrase: 'Bora treinar inglês hoje? Eu acredito em vocês!',
  },
  correct: {
    image: './mascot/certinho.png',
    alt: 'Paçoca Mandou Bem',
    defaultPhrase: 'Mandou benzasso! Resposta perfeita! ✨',
  },
  wrong: {
    image: './mascot/bravo.png',
    alt: 'Paçoca Bravo',
    defaultPhrase: 'Opa, foco total! Vamos prestar mais atenção!',
  },
  tip: {
    image: './mascot/atencao.png',
    alt: 'Paçoca Atento',
    defaultPhrase: 'Dica do Paçoca: repare bem nessa pronúncia e estrutura!',
  },
  proud: {
    image: './mascot/orgulhoso.png',
    alt: 'Paçoca Orgulhoso',
    defaultPhrase: 'Orgulho demais! Mais um passo rumo à fluência!',
  },
  scared: {
    image: './mascot/assustado.png',
    alt: 'Paçoca Assustado',
    defaultPhrase: 'Cuidado! Só sobrou mais um coraçãozinho!',
  },
  frenzy: {
    image: './mascot/doido.png',
    alt: 'Paçoca no Modo Frenesi',
    defaultPhrase: 'Tá pegando fogo! Combo x5 acertos seguidos!',
  },
  rest: {
    image: './mascot/dormindo_pausa.png',
    alt: 'Paçoca Descansando',
    defaultPhrase: 'Zzz... Não esquece de bater a ofensiva do casal hoje!',
  },
  surprised: {
    image: './mascot/surpreso.png',
    alt: 'Paçoca Surpreso',
    defaultPhrase: 'Caramba! Você acertou um desafio bônus!',
  },
};
