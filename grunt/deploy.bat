call grunt clean:build
call grunt cssmin:production
xcopy "C:\wamp\www2\uponto\grunt\libs" "C:\wamp\www2\uponto\grunt\build\libs" /e /i /h
xcopy "C:\wamp\www2\uponto\grunt\res" "C:\wamp\www2\uponto\grunt\build\res" /e /i /h
xcopy "C:\wamp\www2\uponto\grunt\js" "C:\wamp\www2\uponto\grunt\build\js" /e /i /h
call grunt imagemin:dist
call grunt uglify
call grunt minifyHtml

pause
rem grunt uglify:production
rem grunt concat min cssmin
rem grunt htmlmin
rem grunt lineremover
