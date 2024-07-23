import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import _ from "lodash";

const app = express();
const port = 3000;

const API_URL = "https://newsapi.org/v2/everything?q=";

const yourBearerToken = "5e102aefdf8d47f3943f0f53c2f935fa";//Enter Your API Key from NewsAPI.

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

<<<<<<< HEAD
app.get("/", (req,res) => {
  const homepage = "India";
=======
app.get("/", (req, res) => {
  const homepage = "TopNews";
>>>>>>> facb25cf7b0c87b9ea0f3b2ac720f0b4b1f5d989
  res.redirect(`/${homepage}`);
});

app.post("/search", (req, res) => {
  const requestedTitle = req.body["category"];
  res.redirect(`/${requestedTitle}`);
});


app.get("/:postName", async (req, res) => {
  const requestedTitle = _.startCase(req.params.postName);
  const page = parseInt(req.query.page) || 1;
  const articlesPerPage = 16;

  try {
    const result = await axios.get(
      API_URL + requestedTitle + `&sortBy=popularity&apiKey=${yourBearerToken}`
    );

    const totalArticles = result.data.totalResults;
    
    const filteredArticles = result.data.articles.filter((article) => {
      return (
        article.title &&
        article.title !== "[Removed]" &&
        article.description &&
        article.description !== "[Removed]" &&
        article.source &&
        article.source.name &&
        article.source.name !== "[Removed]" &&
        article.urlToImage !== null
      );
    });


    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;

    const articlesToDisplay = filteredArticles.slice(startIndex, endIndex);

    res.render("index.ejs", {
      totalArticles: totalArticles,
      articles: articlesToDisplay,
      total: requestedTitle,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    res.render("index.ejs", { error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running is running at port ${port}`);
});
