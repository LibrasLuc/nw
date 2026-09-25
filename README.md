# WS Advocacia e Consultoria Jurídica

Site publicado em: https://librasluc.github.io/nw/

Landing page institucional em HTML, CSS e JavaScript puro, compatível com Live Server e hospedagem estática.

## Executar

No VS Code, clique com o botão direito em `index.html` e selecione **Open with Live Server**. CSS, JavaScript e imagens usam caminhos relativos, inclusive quando o projeto é aberto em uma subpasta. Não precisa executar npm, Vite ou gerar um build para visualizar.

O símbolo do WhatsApp utiliza o vetor da marca distribuído pelo [Simple Icons](https://github.com/simple-icons/simple-icons/blob/develop/icons/whatsapp.svg), incorporado no HTML e sem dependência de CDN.

Ferramentas opcionais: `npm install`, `npm run build` para preparar a pasta `dist` e `npm test` para testes de navegação e responsividade em servidor estático (requer Python e `npx playwright install chromium`). No PowerShell com restrição de scripts, use `npm.cmd` e `npx.cmd`. O comando `npm run dev` continua disponível como alternativa.

## Fotografias

A logo original em `assets/logo.png` foi reaproveitada e convertida para WebP, preservando o arquivo original. Fotografia arquitetônica: [Unsplash](https://unsplash.com/photos/1486406146926-c627a92ad1ab), distribuída localmente em WebP.

As fotografias enviadas na conversa não estavam disponíveis no sistema de arquivos. Para integrá-las, salve as originais como `assets/retrato-hero.png` e `assets/retrato-sobre.png` (também aceita JPG ou WebP) e execute `npm run build`. Para desenvolvimento, execute `node scripts/prepare-assets.mjs` antes de iniciar o servidor. O layout substitui automaticamente a composição de marca e a imagem arquitetônica pelos retratos.

## Publicação

Defina `SITE_URL` com o domínio HTTPS oficial durante o build. Isso gera canonical, URL e imagem Open Graph, sitemap e referência no robots.txt. Exemplo em PowerShell:

```powershell
$env:SITE_URL = 'https://seu-dominio.com.br'
npm.cmd run build
```

Publique o diretório `dist`. Nenhum domínio foi inventado. O número de inscrição OAB/MG deve ser fornecido pela titular antes da publicação; há espaço reservado em comentário no rodapé. Não há número fictício visível.

Os cards de conteúdo levam a conversas sobre os temas no WhatsApp; não simulam artigos publicados. WhatsApp, telefone e endereço utilizam os dados do briefing. Fontes Google e mapa incorporado requerem internet. Não há formulário, coleta local de dados ou analytics.

PageSpeed acima de 90 é uma meta; não foi medido em produção.
