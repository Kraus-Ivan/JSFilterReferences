let referenceItems;

export default function (menu, itemList) {
  referenceItems = itemList;

  let filterList = [];
  for (const item of itemList) {
    if (item.dataset.filter !== undefined) {
      let keywords = item.dataset.filter.split(";");
      let texts = item.dataset.filtertext?.split(";");

      if (texts) {
        for (let i = 0; i < keywords.length; i++) {
          filterList.push({ keyword: keywords[i], text: texts[i] });
        }
      }
    }
  }

  let uniqueFilterList = filterList.reduce((unique, item) => {
    if (!unique.find((x) => x.keyword === item.keyword)) {
      unique.push(item);
    }
    return unique;
  }, []);

  for (const filterItem of uniqueFilterList) {
    const button = document.createElement("a");
    button.href = `?search=${filterItem.keyword}`;
    button.classList.add("btn", "btn__filter");
    button.dataset.filter = filterItem.keyword;

    const textNode = document.createTextNode(filterItem.text);
    button.appendChild(textNode);

    button.addEventListener("click", (e) => {
      e.preventDefault();

      // Zrušení aktivního stavu tlačítka
      for (const btn of menu.querySelectorAll(".btn__filter")) {
        btn.classList.remove("btn__filter--active");
      }
      // Aktivní aktuální tlačítko
      button.classList.add("btn__filter--active");

      // Filtrování
      applyFilter(button.dataset.filter);
      // URL
      updateURL(button.dataset.filter);
    });

    menu.appendChild(button);
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

function applyFilter(filterKeyword) {
  for (const item of referenceItems) {
    if (item.dataset.filtertext !== undefined) {
      if (
        filterKeyword === "all" ||
        item.dataset.filter?.includes(filterKeyword)
      ) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    } else {
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
