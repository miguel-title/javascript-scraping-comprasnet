const puppeteer = require("puppeteer");

(async (event) => {
  const username = "fornec2";
  const password = "fornec2";
  const link = "https://treinamento.comprasnet.gov.br/";

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(200000);
    await page.goto(link);
    //Login Part
    await page.waitForSelector("button[aria-label='Expandir o card']");
    await page.click("button[aria-label='Expandir o card']");
    await page.waitForSelector("#txtLogin");
    await page.focus("#txtLogin");
    await page.keyboard.type(username);
    await page.waitForSelector("#txtSenha");
    await page.focus("#txtSenha");
    await page.keyboard.type(password);
    await page.keyboard.press("Enter");

    //select the pregao item
    console.log("Finding the menu Item");
    await page.waitForSelector("frame");
    const parentframeHandle = await page.$("frame");
    const parentframe = await parentframeHandle.contentFrame();
    if (parentframe) {
      console.log("Found the parent menu frame");
    }
    await parentframe.waitForXPath(
      '//div[contains(text(), "Serviços do Fornecedor")]'
    );
    const [parentMenu] = await parentframe.$x(
      '//div[contains(text(), "Serviços do Fornecedor")]'
    );
    if (parentMenu) {
      console.log("Found the parent menu");
      await parentMenu.hover();
    } else {
      console.log("Not Found the parent menu");
    }

    await page.waitForSelector("frame[name='main2']");
    const subframeHandle = await page.$("frame[name='main2']");
    const subframe = await subframeHandle.contentFrame();
    if (subframe) {
      console.log("Found the sub menu frame");
    }
    await subframe.waitForXPath('//div[contains(text(), "Pregão Eletrônico")]');
    const [subMenu] = await subframe.$x(
      '//div[contains(text(), "Pregão Eletrônico")]'
    );
    if (subMenu) {
      console.log("Found the sub menu");
      await page.waitForTimeout(1000);
      await subMenu.click();
    } else {
      console.log("Not Found the sub menu");
    }

    await subframe.waitForXPath('//a[contains(text(), "Lances")]');
    const [lacesitem] = await subframe.$x('//a[contains(text(), "Lances")]');
    if (lacesitem) {
      console.log("Found the Lances item");
      await lacesitem.click();
    } else {
      console.log("Found the Lances item");
    }

    await subframe.waitForSelector("table", { visible: true });
    console.log("Loading the table");

    await page.waitForTimeout(10000);
    console.log("finish the waiting");
    //await autoScroll(subframe);

    isEnd = false;
    prevdatacount = 0;
    while (!isEnd) {
      console.log("scroll");
      page.evaluate((_) => {
        window.scrollBy(0, document.body.scrollHeight);
      });

      await page.waitForTimeout(10000);

      let ntabledatacount = (
        await subframe.$x(
          "/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr[3]/td[2]/table/tbody/tr"
        )
      ).length;
      console.log(ntabledatacount);

      if (prevdatacount == ntabledatacount) {
        isEnd = true;
        console.log("Finish Loading the table");
      } else {
        prevdatacount = ntabledatacount;
        isEnd = false;
        continue;
      }

      const listElements = await page.$x(
        "/html/body/table/tbody/tr[2]/td/table[2]/tbody/tr[3]/td[2]/table/tbody/tr/td[1]/a"
      );

      endelement = listElements[count(listElements) - 1];

      if (endelement) {
        console.log("Select the Last element");
        await page.waitForTimeout(1000);
        endelement.click();
      }
    }

    console.log("----Click the last lances Element");
    // await page.close();
    // await browser.close();
  } catch (error) {
    console.log(error);
    // await browser.close();
  }
})();
