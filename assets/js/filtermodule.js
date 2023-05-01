let referenceItems;

export default function (menu, itemList) {
  referenceItems = itemList;

  let filterList = [];
  for (const item of itemList) {
    if (item.dataset.filtertext !== undefined) {
      let texts = item.dataset.filtertext.toLowerCase().split(";");

      for (const text of texts) {
        filterList.push(text);
      }
    }
  }

  let uniqueFilterList = [...new Set(filterList)]; // omg takhle se dělá unikátní pole? :O // tento komentář za mě doslova napsal copilot achjo mám pocit, že budeme nahrazeni AI

  for (const filterItem of uniqueFilterList) {
    const button = document.createElement("a");
    const normalizedFilterItem = normalizeText(filterItem); // search-string friendly
    button.href = `?search=${normalizedFilterItem}`; // todle nevím, jestli vůbec je legální nebo to máme dělat jinak
    button.classList.add("btn", "btn__filter");
    button.dataset.filter = normalizedFilterItem;

    const textNode = document.createTextNode(filterItem);
    button.appendChild(textNode); 

    button.addEventListener("click", (e) => {
      e.preventDefault();

      // Zruší aktuálně aktivní tlačítko
      for (const btn of menu.querySelectorAll(".btn__filter")) {
        btn.classList.remove("btn__filter--active");
      }
      // Nastaví novému tlačítku aktivní třídu
      button.classList.add("btn__filter--active");

      // Aplikuje filtr na obrázky
      applyFilter(button.dataset.filter);

      // Aktualizuje URL
      updateURL(button.dataset.filter);
    });

    menu.appendChild(button);

    // Aplikuje výchozí filtr při načtení stránky
    applyFilter("all");
  }

  const searchParam = new URLSearchParams(window.location.search).get("search");
  if (searchParam) {
    applyFilter(searchParam);
    // Nastavte tlačítko jako aktivní, pokud se shoduje s hodnotou searchParam
    for (const btn of menu.querySelectorAll(".btn__filter")) {
      if (btn.dataset.filter === searchParam) {
        btn.classList.add("btn__filter--active");
      } else {
        btn.classList.remove("btn__filter--active");
      }
    }
  }
}

function normalizeText(text) {
  return removeDiacritics(text.toLowerCase()).replace(/\s+/g, "-");
}

function applyFilter(filterKeyword) {
  for (const item of referenceItems) {
    // ověří, jestli má item atribut data-filtertext
    if (item.dataset.filtertext !== undefined) {
      if (
        // Pokud je filterKeyword "all" nebo se nachází filterKeyword ve filtertextu, tak zobrazí item
        filterKeyword === "all" ||
        normalizeText(item.dataset.filtertext).includes(filterKeyword)
      ) 
      { item.style.display = "block"; } 
      // pokud se filterKeyword nenachází ve filtertextu, tak item skryje
      else {
        item.style.display = "none";
      }
    } 
    // pokud item nemá atribut data-filtertext, tak ho skryje
    else {
      item.style.display = "none";
    }
  }
}

function updateURL(filterValue) {
  const parsedParams = new URLSearchParams(window.location.search);
  parsedParams.set("search", filterValue);
  history.pushState(
    null,
    "",
    window.location.pathname + "?" + parsedParams.toString()
  );
}

function removeDiacritics(str) {
  const diacriticsMap = [
    { base: "a", chars: "á" },
    { base: "c", chars: "č" },
    { base: "d", chars: "ď" },
    { base: "e", chars: "éě" },
    { base: "i", chars: "í" },
    { base: "n", chars: "ň" },
    { base: "o", chars: "ó" },
    { base: "r", chars: "ř" },
    { base: "s", chars: "š" },
    { base: "t", chars: "ť" },
    { base: "u", chars: "úů" },
    { base: "y", chars: "ý" },
    { base: "z", chars: "ž" },
  ];

  let result = "";

  for (let i = 0; i < str.length; i++) {
    const currentChar = str[i];
    let foundMatch = false;

    for (const entry of diacriticsMap) {
      if (entry.chars.includes(currentChar)) {
        result += entry.base;
        foundMatch = true;
        break;
      }
    }

    if (!foundMatch) {
      result += currentChar;
    }
  }

  return result;
}
