const axios = require("axios");
const dotenv = require("dotenv");
const exchangeName = require("../models/exchangeName");
const exchangeIcon = require("../models/exchangeIcon");
dotenv.config();

// const baseURL = "https://rest.coinapi.io/v1";
// const apiKey = "YOUR_COINAPI.IO_API_KEY_HERE";
const baseURL = process.env.Base_URL;
const apiKey = process.env.Api_Key;

const coinAPI = axios.create({
  baseURL,
  headers: {
    "X-CoinAPI-Key": apiKey,
  },
});

async function saveExchangeData(data) {
  try {
    if (Array.isArray(data)) {
      for (const exchange of data) {
        const existingExchange = await exchangeName.findOne({
          exchange_id: exchange.exchange_id,
        });

        if (!existingExchange) {
          await exchangeName.create(exchange);
        }
      }
    } else if (typeof data === "object") {
      const existingExchange = await exchangeName.findOne({
        exchange_id: data.exchange_id,
      });

      if (!existingExchange) {
        await exchangeName.create(data);
      }
    } else {
      console.log("Data is not iterable");
    }
  } catch (error) {
    console.log("Error occurred while saving exchange data:", error);
  }
}

async function saveExchangeIconData(data) {
  try {
    if (Array.isArray(data)) {
      for (const exchange of data) {
        const existingIcon = await exchangeIcon.findOne({
          exchange_id: exchange.exchange_id,
        });

        if (!existingIcon) {
          await exchangeIcon.create(exchange);
        }
      }
      console.log("Exchange Name data saved Successfully");
    } else if (typeof data === "object") {
      const existingIcon = await exchangeIcon.findOne({
        exchange_id: data.exchange_id,
      });

      if (!existingIcon) {
        await exchangeIcon.create(data);
      }
    } else {
      console.log("Data is not iterable");
    }
  } catch (error) {
    console.log("Error occurred while saving exchange data:", error);
  }
}

async function getExchanges(req, res) {
  try {
    const response = await coinAPI.get("/exchanges");
    const exchangesData = response.data;
    exchangesData.forEach(async (exchange) => {
      await saveExchangeData(exchange);
    });

    console.log("Exchange Name data saved Successfully");
    res.json({
      message: "Exchange Name data save successfully",
      exchangesData,
    });
  } catch (error) {
    console.error(
      "Error occurred while fetching exchanges:",
      error.response.data
    );
    res.status(error.response.status || 500).send("Error fetching exchanges");
  }
}

async function getExchangeIcons(req, res) {
  try {
    const response = await coinAPI.get("/exchanges/icons/32");
    const exchangeIconsData = response.data;
    await saveExchangeIconData(exchangeIconsData);

    console.log("Exchange Icon data saved Successfully");
    res.json({
      message: "Exchange Icon data save successfully",
      exchangeIconsData,
    });
  } catch (error) {
    console.error(
      "Error occurred while fetching exchange icons:",
      error.response.data
    );
    res
      .status(error.response.status || 500)
      .send("Error fetching exchange icons");
  }
}

async function getNameandIcons(req, res) {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const searchTerm = req.query.search || "";

  try {
    let query = [];

    if (searchTerm !== "") {
      query.push({
        $match: {
          name: { $regex: new RegExp(searchTerm, "i") },
        },
      });
    }

    query.push(
      {
        $lookup: {
          from: "exchangeicons",
          localField: "exchange_id",
          foreignField: "exchange_id",
          as: "exchange_info",
        },
      },
      {
        $unwind: "$exchange_info",
      },
      {
        $project: {
          _id: 0,
          name: "$name",
          icon_url: "$exchange_info.url",
          amount: "$volume_1day_usd",
        },
      },
      { $skip: (page - 1) * perPage },
      { $limit: perPage }
    );

    const countQuery =
      searchTerm !== ""
        ? { name: { $regex: new RegExp(searchTerm, "i") } }
        : {};

    const count = await exchangeName.countDocuments(countQuery);

    const exchangesList = await exchangeName.aggregate(query);

    if (!exchangesList || exchangesList.length === 0) {
      return res.status(404).json({ error: "No exchanges found" });
    }

    const totalPages = Math.ceil(count / perPage);

    res.json({ exchangesList, totalPages });
  } catch (error) {
    console.log("Error in fetching exchange list:", error);
    res.status(500).json({ error: "Error fetching exchange list" });
  }
}

module.exports = { getExchanges, getExchangeIcons, getNameandIcons };
