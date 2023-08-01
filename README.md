## Know-how-BE

#### app.js와 server.js를 분리한 이유

-   api 테스트 시, 실제 서버가 구동되어 버리면 안되기 때문!
-   만일 app.js 내에 listen 메서드가 있는 경우 서버가 구동된다.
