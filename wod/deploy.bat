call grunt clean:build
call grunt cssmin:production
xcopy "C:\wamp\www2\uponto\wod\libs" "C:\wamp\www2\uponto\wod\build\libs" /e /i /h
xcopy "C:\wamp\www2\uponto\wod\res" "C:\wamp\www2\uponto\wod\build\res" /e /i /h
xcopy "C:\wamp\www2\uponto\wod\js" "C:\wamp\www2\uponto\wod\build\js" /e /i /h
call grunt imagemin:dist
call grunt uglify
call grunt minifyHtml

pause
rem grunt uglify:production
rem grunt concat min cssmin
rem grunt htmlmin
rem grunt lineremover
