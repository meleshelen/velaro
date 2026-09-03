const DEFAULT_PRODUCTS = [
  {
    "id": 1,
    "name": "SKIING",
    "article": "VL-TS-001",
    "category": "men",
    "categoryName": "Чоловіча футболка",
    "type": "clothes",
    "price": 199,
    "image": "images/products/vl-ts-001-1.jpg",
    "images": [
      "images/products/vl-ts-001-1.jpg",
      "images/products/vl-ts-001-2.jpg"
    ],
    "description": "Чоловіча футболка. Фото товару без зміни моделі.",
    "badge": "Хіт",
    "sizes": {
      "S": 2
    }
  },
  {
    "id": 2,
    "name": "Flamingo",
    "article": "VL-TS-002",
    "category": "men",
    "categoryName": "Чоловіча футболка",
    "type": "clothes",
    "price": 199,
    "image": "images/products/vl-ts-002-1.jpg",
    "images": [
      "images/products/vl-ts-002-1.jpg"
    ],
    "description": "Чоловіча футболка. Фото товару без зміни моделі.",
    "badge": "Новинка",
    "sizes": {
      "S": 2,
      "M": 3,
      "L": 3,
      "XL": 2
    }
  },
  {
    "id": 3,
    "name": "BACK IN",
    "article": "VL-TS-003",
    "category": "men",
    "categoryName": "Чоловіча футболка",
    "type": "clothes",
    "price": 199,
    "image": "images/products/vl-ts-003-1.jpg",
    "images": [
      "images/products/vl-ts-003-1.jpg"
    ],
    "description": "Чоловіча футболка. Фото товару без зміни моделі.",
    "sizes": {
      "S": 2,
      "M": 3,
      "L": 3,
      "XL": 2
    }
  },
  {
    "id": 4,
    "name": "LOS ANGELES 12",
    "article": "VL-TS-004",
    "category": "men",
    "categoryName": "Чоловіча футболка",
    "type": "clothes",
    "price": 199,
    "image": "images/products/vl-ts-004-1.jpg",
    "images": [
      "images/products/vl-ts-004-1.jpg"
    ],
    "description": "Чоловіча футболка. Фото товару без зміни моделі.",
    "sizes": {
      "S": 2,
      "M": 3,
      "L": 3,
      "XL": 2
    }
  },
  {
    "id": 5,
    "name": "Signature",
    "article": "VL-TS-005",
    "category": "women",
    "categoryName": "Жіноча футболка",
    "type": "clothes",
    "price": 199,
    "image": "images/products/vl-ts-005-1.jpg",
    "images": [
      "images/products/vl-ts-005-1.jpg"
    ],
    "description": "Жіноча футболка. Фото товару без зміни моделі.",
    "sizes": {
      "S": 2,
      "M": 3,
      "L": 3,
      "XL": 2
    }
  },
  {
    "id": 6,
    "name": "I LOVE PARIS",
    "article": "VL-TS-006",
    "category": "women",
    "categoryName": "Жіноча футболка",
    "type": "clothes",
    "price": 199,
    "image": "images/products/vl-ts-006-1.jpg",
    "images": [
      "images/products/vl-ts-006-1.jpg"
    ],
    "description": "Жіноча футболка. Фото товару без зміни моделі.",
    "badge": "Новинка",
    "sizes": {
      "S": 2,
      "M": 3,
      "L": 3,
      "XL": 2
    }
  },
  {
    "id": 7,
    "name": "SOUTH CALIFORNIA",
    "article": "VL-TS-007",
    "category": "women",
    "categoryName": "Жіноча футболка",
    "type": "clothes",
    "price": 199,
    "image": "images/products/vl-ts-007-1.jpg",
    "images": [
      "images/products/vl-ts-007-1.jpg"
    ],
    "description": "Жіноча футболка. Фото товару без зміни моделі.",
    "sizes": {
      "S": 2,
      "M": 3,
      "L": 3,
      "XL": 2
    }
  },
  {
    "id": 8,
    "name": "Балетки пудрові",
    "article": "VL-WS-008",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 899,
    "image": "images/products/vl-ws-008-1.jpg",
    "images": [
      "images/products/vl-ws-008-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 9,
    "name": "Балетки біло-чорні",
    "article": "VL-WS-009",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 899,
    "image": "images/products/vl-ws-009-1.jpg",
    "images": [
      "images/products/vl-ws-009-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 10,
    "name": "Туфлі сріблясті",
    "article": "VL-WS-010",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 899,
    "image": "images/products/vl-ws-010-1.jpg",
    "images": [
      "images/products/vl-ws-010-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 11,
    "name": "Туфлі бежеві",
    "article": "VL-WS-011",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 899,
    "image": "images/products/vl-ws-011-1.jpg",
    "images": [
      "images/products/vl-ws-011-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 12,
    "name": "Чоловічі сандалі Urban",
    "article": "VL-MS-012",
    "category": "men-shoes",
    "categoryName": "Чоловіче взуття",
    "type": "shoes",
    "price": 749,
    "image": "images/products/vl-ms-012-1.jpg",
    "images": [
      "images/products/vl-ms-012-1.jpg",
      "images/products/vl-ms-012-2.jpg",
      "images/products/vl-ms-012-3.jpg",
      "images/products/vl-ms-012-4.jpg",
      "images/products/vl-ms-012-5.jpg",
      "images/products/vl-ms-012-6.jpg",
      "images/products/vl-ms-012-7.jpg"
    ],
    "description": "Чоловіче взуття. Фото товару без зміни моделі.",
    "badge": "Хіт",
    "sizes": {
      "40": 2,
      "41": 3,
      "42": 4,
      "43": 2,
      "44": 1
    }
  },
  {
    "id": 13,
    "name": "Кросівки бежеві",
    "article": "VL-WS-013",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 1099,
    "image": "images/products/vl-ws-013-1.jpg",
    "images": [
      "images/products/vl-ws-013-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 14,
    "name": "Шльопанці зі стразами",
    "article": "VL-WS-014",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 699,
    "image": "images/products/vl-ws-014-1.jpg",
    "images": [
      "images/products/vl-ws-014-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 15,
    "name": "Шльопанці золотисті",
    "article": "VL-WS-015",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 699,
    "image": "images/products/vl-ws-015-1.jpg",
    "images": [
      "images/products/vl-ws-015-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 16,
    "name": "Кросівки рожеві",
    "article": "VL-WS-016",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 1099,
    "image": "images/products/vl-ws-016-1.jpg",
    "images": [
      "images/products/vl-ws-016-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 17,
    "name": "Кросівки бордові",
    "article": "VL-WS-017",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 1099,
    "image": "images/products/vl-ws-017-1.jpg",
    "images": [
      "images/products/vl-ws-017-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 18,
    "name": "Балетки шампань",
    "article": "VL-WS-018",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 899,
    "image": "images/products/vl-ws-018-1.jpg",
    "images": [
      "images/products/vl-ws-018-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 19,
    "name": "В’єтнамки сині",
    "article": "VL-MS-019",
    "category": "men-shoes",
    "categoryName": "Чоловіче взуття",
    "type": "shoes",
    "price": 499,
    "image": "images/products/vl-ms-019-1.jpg",
    "images": [
      "images/products/vl-ms-019-1.jpg"
    ],
    "description": "Чоловіче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "40": 2,
      "41": 3,
      "42": 3,
      "43": 2,
      "44": 1
    }
  },
  {
    "id": 20,
    "name": "Кросівки білі Sport",
    "article": "VL-WS-020",
    "category": "women-shoes",
    "categoryName": "Жіноче взуття",
    "type": "shoes",
    "price": 1099,
    "image": "images/products/vl-ws-020-1.jpg",
    "images": [
      "images/products/vl-ws-020-1.jpg"
    ],
    "description": "Жіноче взуття. Фото товару без зміни моделі.",
    "sizes": {
      "36": 2,
      "37": 2,
      "38": 2,
      "39": 2,
      "40": 1
    }
  },
  {
    "id": 21,
    "name": "Комплект Noir",
    "article": "VL-LN-021",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-021-1.jpg",
    "images": [
      "images/products/vl-ln-021-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "badge": "Хіт",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 22,
    "name": "Комплект Navy",
    "article": "VL-LN-022",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-022-1.jpg",
    "images": [
      "images/products/vl-ln-022-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 23,
    "name": "Комплект Peach",
    "article": "VL-LN-023",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-023-1.jpg",
    "images": [
      "images/products/vl-ln-023-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "badge": "Новинка",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 24,
    "name": "Комплект Nude",
    "article": "VL-LN-024",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-024-1.jpg",
    "images": [
      "images/products/vl-ln-024-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 25,
    "name": "Комплект Navy Lace",
    "article": "VL-LN-025",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-025-1.jpg",
    "images": [
      "images/products/vl-ln-025-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 26,
    "name": "Комплект Silver",
    "article": "VL-LN-026",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-026-1.jpg",
    "images": [
      "images/products/vl-ln-026-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 27,
    "name": "Комплект White",
    "article": "VL-LN-027",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-027-1.jpg",
    "images": [
      "images/products/vl-ln-027-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 28,
    "name": "Комплект Black Basic",
    "article": "VL-LN-028",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-028-1.jpg",
    "images": [
      "images/products/vl-ln-028-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 29,
    "name": "Бюстгальтер White",
    "article": "VL-LN-029",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-029-1.jpg",
    "images": [
      "images/products/vl-ln-029-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 30,
    "name": "Комплект Silver Shine",
    "article": "VL-LN-030",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-030-1.jpg",
    "images": [
      "images/products/vl-ln-030-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "badge": "Новинка",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 31,
    "name": "Комплект Black Wine",
    "article": "VL-LN-031",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-031-1.jpg",
    "images": [
      "images/products/vl-ln-031-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  },
  {
    "id": 32,
    "name": "Комплект Purple",
    "article": "VL-LN-032",
    "category": "lingerie",
    "categoryName": "Жіноча білизна",
    "type": "lingerie",
    "price": 799,
    "image": "images/products/vl-ln-032-1.jpg",
    "images": [
      "images/products/vl-ln-032-1.jpg"
    ],
    "description": "Жіноча білизна. Фото товару без зміни моделі.",
    "braSizes": {
      "70B": 1,
      "75B": 2,
      "80B": 2,
      "75C": 2,
      "80C": 2,
      "85C": 1
    },
    "pantiesSizes": {
      "S": 2,
      "M": 3,
      "L": 2,
      "XL": 1
    }
  }
];

function getProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem("velaroProductsV31"));
    if (Array.isArray(saved) && saved.length > 0) return saved;
  } catch (error) { console.warn(error); }
  return structuredClone(DEFAULT_PRODUCTS);
}

let products = getProducts();
