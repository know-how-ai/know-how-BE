const app = require("./app");

const PORT = "port";
const PORT_NUMBER = process.env.PORT_NUMBER || 3000;

const handleListening = () => {
  console.log(app.get(PORT), "번 포트에서 대기중입니다. ✅");
  console.log(`>>> http://localhost:${PORT_NUMBER}/ <<<`);
};

app.listen(app.get(PORT), handleListening);
