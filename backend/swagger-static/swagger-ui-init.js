
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "App"
          ]
        }
      },
      "/products": {
        "get": {
          "operationId": "ProductController_getListProducts",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "Page number for pagination",
              "schema": {
                "minimum": 1,
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Number of items per page",
              "schema": {
                "minimum": 1,
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search term for product name or SKU",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of products",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GetListProductsResponseDto"
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request"
            },
            "500": {
              "description": "Internal Server Error"
            }
          },
          "tags": [
            "Products"
          ]
        }
      },
      "/stocks": {
        "get": {
          "operationId": "StockController_getStocks",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "Page number for pagination",
              "schema": {
                "minimum": 1,
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Number of items per page",
              "schema": {
                "minimum": 1,
                "default": 10,
                "type": "number"
              }
            },
            {
              "name": "search",
              "required": false,
              "in": "query",
              "description": "Search term for product name or warehouse name",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "List of stock levels",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/GetStocksResponseDto"
                  }
                }
              }
            },
            "400": {
              "description": "Bad Request"
            },
            "500": {
              "description": "Internal Server Error"
            }
          },
          "tags": [
            "Stocks"
          ]
        }
      },
      "/purchase/request": {
        "post": {
          "operationId": "PurchaseController_createPurchaseRequest",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePurchaseRequestDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Purchase request created successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreatePurchaseRequestResponseDto"
                  }
                }
              }
            },
            "400": {
              "description": "Invalid input"
            },
            "500": {
              "description": "Internal server error"
            }
          },
          "summary": "Create a new purchase request",
          "tags": [
            "Purchases"
          ]
        }
      },
      "/purchase/request/{id}": {
        "put": {
          "operationId": "PurchaseController_updatePurchaseRequest",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdatePurchaseRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Purchase request updated successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CreatePurchaseRequestResponseDto"
                  }
                }
              }
            },
            "400": {
              "description": "Invalid input or status not DRAFT"
            },
            "404": {
              "description": "Purchase request not found"
            },
            "500": {
              "description": "Internal server error"
            }
          },
          "summary": "Update a purchase request",
          "tags": [
            "Purchases"
          ]
        }
      },
      "/webhook/receive-stock": {
        "post": {
          "operationId": "WebhookController_receiveStock",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ReceiveStockDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "summary": "Receive stock update via webhook",
          "tags": [
            "Webhooks"
          ]
        }
      }
    },
    "info": {
      "title": "SmartMKM API Documentation",
      "description": "API Documentation for SmartMKM",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "access-jwt": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http",
          "description": "Enter JWT access token",
          "in": "header"
        },
        "refresh-jwt": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http",
          "description": "Enter JWT refresh token",
          "in": "header"
        }
      },
      "schemas": {
        "ProductItem": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number",
              "description": "Product ID"
            },
            "name": {
              "type": "string",
              "description": "Product Name"
            },
            "sku": {
              "type": "string",
              "description": "Product SKU"
            }
          },
          "required": [
            "id",
            "name",
            "sku"
          ]
        },
        "GetListProductsResponseDto": {
          "type": "object",
          "properties": {
            "data": {
              "description": "List of products",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ProductItem"
              }
            },
            "total": {
              "type": "number",
              "description": "Total number of products"
            },
            "page": {
              "type": "number",
              "description": "Current page number"
            },
            "limit": {
              "type": "number",
              "description": "Number of items per page"
            }
          },
          "required": [
            "data",
            "total",
            "page",
            "limit"
          ]
        },
        "StockItem": {
          "type": "object",
          "properties": {
            "warehouseId": {
              "type": "number",
              "description": "Warehouse ID"
            },
            "productId": {
              "type": "number",
              "description": "Product ID"
            },
            "quantity": {
              "type": "number",
              "description": "Quantity"
            },
            "productName": {
              "type": "string",
              "description": "Product Name"
            },
            "productSku": {
              "type": "string",
              "description": "Product SKU"
            },
            "warehouseName": {
              "type": "string",
              "description": "Warehouse Name"
            }
          },
          "required": [
            "warehouseId",
            "productId",
            "quantity",
            "productName",
            "productSku",
            "warehouseName"
          ]
        },
        "GetStocksResponseDto": {
          "type": "object",
          "properties": {
            "data": {
              "description": "List of stocks",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/StockItem"
              }
            },
            "total": {
              "type": "number",
              "description": "Total number of records"
            },
            "page": {
              "type": "number",
              "description": "Current page number"
            },
            "limit": {
              "type": "number",
              "description": "Number of items per page"
            }
          },
          "required": [
            "data",
            "total",
            "page",
            "limit"
          ]
        },
        "CreatePurchaseRequestItemDto": {
          "type": "object",
          "properties": {
            "productId": {
              "type": "number",
              "description": "Product ID"
            },
            "quantity": {
              "type": "number",
              "description": "Quantity",
              "minimum": 1
            }
          },
          "required": [
            "productId",
            "quantity"
          ]
        },
        "CreatePurchaseRequestDto": {
          "type": "object",
          "properties": {
            "reference": {
              "type": "string",
              "description": "Unique Reference ID"
            },
            "warehouseId": {
              "type": "number",
              "description": "Warehouse ID"
            },
            "items": {
              "description": "List of items",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CreatePurchaseRequestItemDto"
              }
            }
          },
          "required": [
            "reference",
            "warehouseId",
            "items"
          ]
        },
        "PurchaseRequestItemResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "productId": {
              "type": "number"
            },
            "quantity": {
              "type": "number"
            }
          },
          "required": [
            "id",
            "productId",
            "quantity"
          ]
        },
        "CreatePurchaseRequestResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "number"
            },
            "reference": {
              "type": "string"
            },
            "warehouseId": {
              "type": "number"
            },
            "status": {
              "type": "string"
            },
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PurchaseRequestItemResponseDto"
              }
            }
          },
          "required": [
            "id",
            "reference",
            "warehouseId",
            "status",
            "items"
          ]
        },
        "UpdatePurchaseRequestDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "enum": [
                "DRAFT",
                "PENDING"
              ]
            },
            "reference": {
              "type": "string",
              "description": "Unique Reference ID"
            },
            "items": {
              "description": "List of items to replace existing items",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/CreatePurchaseRequestItemDto"
              }
            }
          }
        },
        "StockItemDetailDto": {
          "type": "object",
          "properties": {
            "sku_barcode": {
              "type": "string"
            },
            "qty": {
              "type": "number"
            }
          },
          "required": [
            "sku_barcode",
            "qty"
          ]
        },
        "WebhookDataDto": {
          "type": "object",
          "properties": {
            "reference": {
              "type": "string"
            },
            "details": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/StockItemDetailDto"
              }
            }
          },
          "required": [
            "reference",
            "details"
          ]
        },
        "ReceiveStockDto": {
          "type": "object",
          "properties": {
            "data": {
              "$ref": "#/components/schemas/WebhookDataDto"
            }
          },
          "required": [
            "data"
          ]
        }
      }
    },
    "security": [
      {
        "access-jwt": []
      }
    ]
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
