import { apikey, showBrowser, sequence_id } from "./config";
import { browser } from "@crawlora/browser";

export default async function ({ ASIN }: { ASIN: string }) {
  const formedData = ASIN.trim()
    .split("\n")
    .map((v) => v.trim());

  await browser(
    async ({ page, wait, output, debug }) => {
      for await (const asin_number of formedData) {
        await page.goto(`https://www.amazon.co.uk/dp/${asin_number}`);

        debug(`Visiting Amazon website for United State`);
        await wait(2);

        const productData = await page.evaluate(() => {
          const getText = (selector: string) =>
            document.querySelector(selector)?.textContent?.trim() || "N/A";

          const getAttribute = (selector: string, attribute: string) =>
            document.querySelector(selector)?.getAttribute(attribute) || "N/A";

          const getTextFromLabel = (labelText: string) => {
            const rows = document.querySelectorAll("#prodDetails .a-text-bold");
            for (const row of rows) {
              if (row.textContent?.trim() === labelText) {
                return row.nextElementSibling?.textContent?.trim() || "N/A";
              }
            }
            return "N/A";
          };
          const ASIN = getAttribute("#ASIN", "value");
          const productName = getText("#productTitle");
          const productImage = getAttribute("#landingImage", "src");
          const productURL = window.location.href;
          const stars = getText(".a-icon-alt");
          const brand = getText("#bylineInfo");
          const ratingCount = getText("#acrCustomerReviewText");
          const answerQuestions = getText("#askATFLink");
          const price = getText(".a-price .a-offscreen");
          const variantAttribute = getText(".twisterTextDiv");
          const recentPurchase = getText(".a-text-bold .a-color-success");
          const inStock = getText("#availability .a-declarative");
          const seller = getText("#merchant-info");
          const aboutThisItem = getText("#feature-bullets ul");
          const delivery = getText(
            "#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE"
          );
          const fastestDelivery = getText(".delivery-speed-message");
          const productDescription = getText("#productDescription p");
          const bestSellersRank = getText("#SalesRank");
          const brandURL = getAttribute("#bylineInfo", "href");
          const manufacturerURL = getTextFromLabel("Manufacturer");
          const countryOfOrigin = getTextFromLabel("Country of Origin");
          const manufacturer = getTextFromLabel("Manufacturer");
          const dimensions = getTextFromLabel("Dimensions");
          const breadcrumbs = getText("#wayfinding-breadcrumbs_feature_div");
          const category = getText("#wayfinding-breadcrumbs_feature_div");
          const currentTime = new Date().toLocaleString();
          const imageUrls = Array.from(
            document.querySelectorAll("#altImages img")
          ).map((img: any) => img.src);

          return {
            ASIN,
            Title: productName,
            Image: productImage,
            URL: productURL,
            Stars: stars,
            Brand: brand,
            Rating_Count: ratingCount,
            Answer_Questions: answerQuestions,
            Price: price,
            Variant_Attribute: variantAttribute,
            Recent_Purchase: recentPurchase,
            In_Stock: inStock,
            Seller: seller,
            About_this_item: aboutThisItem,
            Delivery: delivery,
            Fastest_Delivery: fastestDelivery,
            Product_Description: productDescription,
            Best_Sellers_Rank: bestSellersRank,
            Brand_URL: brandURL,
            Manufacturer_URL: manufacturerURL,
            Country_of_Origin: countryOfOrigin,
            Breadcrumbs: breadcrumbs
              .replace(/\n|\r/g, "")
              .replace(/\s+/g, " ")
              .split("›")
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
              .join(", "),
            Manufacturer: manufacturer,
            Category: category
              .replace(/\n|\r/g, "")
              .replace(/\s+/g, " ")
              .split("›")
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
              .join(", "),
            Dimensions: dimensions,
            Current_Time: currentTime,
            Image_URL_1: imageUrls[1] || "N/A",
            Image_URL_2: imageUrls[2] || "N/A",
            Image_URL_3: imageUrls[3] || "N/A",
            Image_URL_4: imageUrls[4] || "N/A",
            Image_URL_5: imageUrls[5] || "N/A",
          };
        });

        debug(`Fetching product titles and links`);

        await wait(2);

        debug(`Started submitting product data`);

        await output.create({
          sequence_id,
          sequence_output: productData,
        });

        debug(`Submitted product data`);
      }
    },
    {
      showBrowser,
      apikey,
    }
  );
}
