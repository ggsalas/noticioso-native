import { Article } from "@/types";
import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export async function getArticle(url: string): Promise<Article> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      },
    });

    const responseText = await res.text();

    const { document } = parseHTML(responseText);
    const article = new Readability(document);

    return article.parse();
  } catch (error) {
    throw new Error(`Error on get article: ${error}`);
  }
}
