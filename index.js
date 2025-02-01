import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import ejs from "ejs";

const app = express();
const port = 3000;

let finalAmt = 0;

const apiKey = "f2c98c73631f24dbbc267c6e75820436";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {

  res.render("index.ejs", { content: finalAmt });
});

app.post("/submit", async (req, res) => {
  const amount = req.body;

  

  try {
    const response = await axios.get(
      `https://api.currencylayer.com/live?access_key=f2c98c73631f24dbbc267c6e75820436&currencies=EUR,GBP,NGN`
      
    );
    console.log(amount);
    let currencyPair = Object.keys(amount)[0] + amount[Object.keys(amount)[1]];

    console.log(currencyPair);
    const result = response.data;
    console.log(result);

    function convertedAmt(received) {
      let converted;
      Object.keys(received.quotes).forEach((key) => {
        if (key === currencyPair) {
          converted = Math.round(received.quotes[key] * Number(amount["USD"]));
        }
      });
      return converted;
    }

    finalAmt = convertedAmt(result);
    res.redirect("/");

    console.log(finalAmt);
  } catch (error) {
    console.log(error.message);
    res.send(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
