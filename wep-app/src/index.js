const app = require("./app");

const port = process.env.PORT || 8080;

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://127.0.0.1:${port}`);
})