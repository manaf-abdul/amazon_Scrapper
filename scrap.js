const { JSDOM } = require("jsdom")
const scrapeIt = require("scrape-it")

let scrap = async (url) => {
    let product = {};
    const cleanData = (data) => data.replaceAll("\n", "").replaceAll("+", "").trim();
    const cleanKey = (key) => {
        key = key.trim().toLowerCase().replaceAll(/[ \(\)]/g, "_");

        if (key.endsWith("_")) {
            key = key.slice(0, key.length - 1)
        }
        return key
    };
    const { data } = await scrapeIt({
        url,
        headers: {
            "Host": 'www.amazon.in',
            "upgrade-insecure-requests": 1,
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        }
    }
        , {
            technicalDetailTable: {
                selector: "#productDetails_techSpec_section_1",
                how: "html"
            },
            title: "#title",
            image: {
                selector: "#imgTagWrapperId img",
                attr: "src"
            },
            price: ".priceToPay .a-offscreen",
            about: {
                selector: "#feature-bullets > ul > li"
            },
            table: {
                selector: ".a-section table",
                how: "html"
            },
        });

    console.log("data", data.technicalDetailTable)

    for (const d of data.technicalDetailTable.split('</tr>')) {
        let tr = cleanData(d);
        if (!tr) {
            continue
        }

        tr += "</tr>";
        const trDom = new JSDOM(`<!DOCTYPE html><table>${tr}</table>`);
        let key = cleanKey(trDom.window.document.querySelector("th").textContent)
        const value = trDom.window.document.querySelector("td").textContent.trim();

        product[key] = value;
    }

    for (const d of data.table.split('</tr>')) {
        let tr = cleanData(d);
        if (!tr) {
            continue
        }

        tr += "</tr>";
        const trDom = new JSDOM(`<!DOCTYPE html><table>${tr}</table>`);
        let key = cleanKey(trDom.window.document.querySelector("td:nth-of-type(1)").textContent)
        const value = trDom.window.document.querySelector("td:nth-of-type(2)").textContent.trim();

        product[key] = value;
    }
    product.image = data?.image;
    product.title = data?.title
    product.price = data?.price
    product.about = data?.about
    return product
}

module.exports = scrap