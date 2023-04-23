import React, { useEffect, useState } from "react";
import { copy, linkIcon, loader, tick } from "@/assets";
import { useLazyGetSummaryQuery } from "@/services/article.api";

function Demo() {
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const allArticlesFromLocalStorage = localStorage.getItem("articles");
    if (allArticlesFromLocalStorage) {
      setAllArticles(JSON.parse(allArticlesFromLocalStorage));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedArticles = [...allArticles, newArticle];
      setArticle(newArticle);
      setAllArticles(updatedArticles);
      localStorage.setItem("articles", JSON.stringify(updatedArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => {
      setCopied("");
    }, 3000);
  };

  return (
    <section className="w-full mt-16 max-w-xl">
      <div className="w-full flex flex-col gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link icon"
            className="absolute  left-0 my-2  ml-3 w-5 "
          />

          <input
            type="url"
            placeholder="Enter a url"
            value={article.url}
            onChange={(e) => {
              setArticle({ ...article, url: e.target.value });
            }}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ⏎
          </button>
        </form>
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((article, index) => (
            <a
              key={index}
              className="link_card"
              onClick={() => {
                setArticle(article);
              }}
            >
              <div
                className="copy_btn"
                onClick={() => {
                  handleCopy(article.url);
                }}
              >
                <img
                  src={copied === article.url ? tick : copy}
                  alt="copy button"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>

              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {article.url}
              </p>
            </a>
          ))}
        </div>
      </div>
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img
            src={loader}
            alt="loading spinner"
            className="w-10 h-10 object-contain"
          />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well that wasn't suppose to happen, please try again. <br />
            <span className="font-satoshi font-normal text-gray-700 ">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl ">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Demo;