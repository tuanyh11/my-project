import app from "./src/app";

const PORT = process.env.PORT || 5001

app.listen(PORT, function() {
    console.log("server listening on port " + PORT);
})