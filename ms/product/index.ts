import app from "./src/app";

const PORT = process.env.PORT || 4001

app.listen(PORT, function() {
    console.log("server listening on port " + PORT);
})

process.on("SIGINT", function() {
    console.log("Process is shutting down");
    process.exit(0)
})