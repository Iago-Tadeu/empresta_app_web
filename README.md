# empresta_app_web

Comandos a rodar após clonar o projeto!
Comando necessário para instalar as dependências.
npm install
Comando para rodar o projeto em ambiente de desenvolvimento.
npm run serve

A respeito do host de comunicação com a api mantive o mesmo da aplicação mobile, sendo necessário
pegar o ip da máquina local e adicionar junto ao comando de build da api como por exemplo:
php artisan serve --host=192.168.0.33
,permitindo assim que a aplicação back end seja acessada tanto por mobile tanto por web.
Recomendo iniciar o projeto back-end antes de compilar a aplicação web ou mobile para que
não seja necessário recarregar a página ou dar refresh na aplicação mobile.
