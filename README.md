# 🐾 Paçoca English (Paçoca Lingo)

Uma plataforma interativa, acelerada e gamificada de aprendizado de inglês inspirada no Duolingo, estrelando o mascote **Paçoca** e suas 9 variantes de humor!

Construída especialmente para **Bryan e sua namorada** praticarem juntos, com mecânicas cooperativas de casal, suporte a login Google e hospedagem gratuita no GitHub Pages.

---

## ✨ Recursos Principais

- 🥜 **Mascote Paçoca Dinâmico**: O Paçoca reage a tudo em tempo real! Ele comemora acertos (`certinho.png`), cobra foco quando você erra (`bravo.png`), fica com medo quando resta 1 coração (`assustado.png`), entra em frenesi nos combos (`doido.png`), comemora vitórias (`orgulhoso.png`) e dorme quando você ainda não fez a lição do dia (`dormindo_pausa.png`).
- 💑 **Modo Especial de Casal**:
  - **Ofensiva Compartilhada**: O contador de dias de casal só avança se ambos fizerem a lição do dia!
  - **Cutucada do Paçoca**: Envie mensagens de carinho ou lembretes divertidos com 1 clique para ela treinar.
  - **Duelo Amigável de XP**: Acompanhe o placar semanal entre você e sua namorada.
  - **Alternador Instantâneo**: Alterne entre os perfis do Bryan e da Namorada diretamente no topo da tela com 1 clique.
- 🚀 **Foco em Fluência Rápida & Prática**:
  - Banco de palavras tátil (Word Bank estilo Duolingo).
  - Treino de escuta com pronúncia nativa e velocidade normal ou lenta (Snail Mode).
  - Prática de fala com o microfone e avaliação de pronúncia via navegador.
  - Diálogos da vida real (pedir comida, aeroporto, carinho a dois, trabalho e gírias).
  - Associação de pares de vocabulário.
- 🎵 **Áudio & Efeitos Sonoros**: Efeitos de acerto, erro, clique tátil e fanfarra de vitória gerados via Web Audio API (sem atrasos ou arquivos externos).
- 📱 **Totalmente Responsivo**: Design mobile-first com barra de navegação inferior estilo app nativo no celular e barra lateral completa no computador.
- 🌐 **Pronto para o GitHub Pages**: Configuração com caminhos relativos e automação GitHub Actions inclusa.

---

## 🚀 Como Executar Localmente

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Navegue até a pasta do projeto:
   ```bash
   cd pacoca-english
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Abra o link gerado (ex: `http://localhost:5173/`) no seu navegador ou no celular (pelo IP local da sua rede Wi-Fi).

---

## 🌐 Como Publicar no seu GitHub Pages

1. Inicialize o repositório git na pasta (se ainda não o fez):
   ```bash
   git init
   git add .
   git commit -m "feat: lancamento do pacoca english"
   ```
2. Crie um novo repositório no seu GitHub chamado `pacoca-english` (ou o nome que preferir).
3. Conecte e envie o código para o GitHub:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/pacoca-english.git
   git branch -M main
   git push -u origin main
   ```
4. No GitHub, vá na aba **Settings** > **Pages**:
   - Em **Source**, escolha **GitHub Actions**.
   - O workflow `.github/workflows/deploy.yml` irá compilar e publicar seu site automaticamente de graça!

---

Feito com carinho para o aprendizado de inglês do Bryan e sua namorada, guiados pelo Paçoca! 🐾❤️
