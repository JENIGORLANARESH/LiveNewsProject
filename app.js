import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import _ from "lodash";

const app = express();
const port = 3000;

const API_URL = "https://newsapi.org/v2/everything?q=";

const yourBearerToken = "5e102aefdf8d47f3943f0f53c2f935fa";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
  const homepage = "TopNews";
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
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const startIndex = (page - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;

    const articlesToDisplay = result.data.articles.slice(startIndex, endIndex);

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
