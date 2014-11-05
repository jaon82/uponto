call grunt clean:build
call grunt cssmin:production
xcopy "C:\wamp\www2\uponto\web\libs" "C:\wamp\www2\uponto\web\build\libs" /e /i /h
xcopy "C:\wamp\www2\uponto\web\res" "C:\wamp\www2\uponto\web\build\res" /e /i /h
xcopy "C:\wamp\www2\uponto\web\js" "C:\wamp\www2\uponto\web\build\js" /e /i /h
call grunt imagemin:dist
call grunt uglify
call grunt minifyHtml

pause

rem Instalar esses caras antes:
rem npm install -g grunt-cli
rem cd <yourProjectDir>
rem npm install grunt --save-dev

rem npm install grunt-contrib-cssmin --save-dev
rem npm install grunt-contrib-clean --save-dev
rem npm install grunt-contrib-imagemin --save-dev
rem npm install grunt-line-remover --save-dev
rem npm install grunt-contrib-uglify --save-dev
rem npm install grunt-minify-html


rem Não estão mais sendo utilizados
rem grunt uglify:production
rem grunt concat min cssmin
rem grunt htmlmin
rem grunt lineremover





