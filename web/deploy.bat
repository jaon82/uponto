call grunt clean:build
call grunt cssmin:production
xcopy "C:\wamp\www2\uponto\web\libs" "C:\wamp\www2\uponto\web\build\libs" /e /i /h
xcopy "C:\wamp\www2\uponto\web\res" "C:\wamp\www2\uponto\web\build\res" /e /i /h
xcopy "C:\wamp\www2\uponto\web\js" "C:\wamp\www2\uponto\web\build\js" /e /i /h
call grunt imagemin:dist
call grunt uglify
call grunt minifyHtml

pause
rem grunt uglify:production
rem grunt concat min cssmin
rem grunt htmlmin
rem grunt lineremover
