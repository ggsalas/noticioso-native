import { Article } from "@/types";
import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";

export async function getArticle(url: string): Promise<Article> {
  try {
    const res = await fetch(url);

    const responseText = await res.text();

    const { document } = parseHTML(responseText);
    const article = new Readability(document);

    return article.parse();
  } catch (error) {
    throw new Error(`Error on get article: ${error}`);
  }
}
