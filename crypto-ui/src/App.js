import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function formatTradeVolume(amount) {
  const million = 1000000;
  const billion = 1000000000;

  if (amount >= billion) {
    return `$ ${(amount / billion).toFixed(2)} billion`;
  } else if (amount >= million) {
    return `$ ${(amount / million).toFixed(2)} million`;
  } else {
    return `$ ${amount}`;
  }
}

function App() {
  const [exchanges, setExchanges] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const entriesPerPage = 10;

  useEffect(() => {
    async function fetchExchanges() {
      try {
        const response = await axios.get(
          `http://localhost:5000/exchangeList?page=${currentPage}&perPage=${entriesPerPage}&search=${searchTerm}`
        );

        if (currentPage === 1) {
          setExchanges(response.data.exchangesList);
        } else {
          setExchanges(response.data.exchangesList);
        }

        console.log("pages --> ", response.data.totalPages);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log("Error fetching exchanges:", error);
      }
    }

    fetchExchanges();
  }, [currentPage, searchTerm]);

  const filteredExchanges = searchTerm
    ? exchanges.filter((exchange) =>
        exchange.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : exchanges;

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      setExchanges([]);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      setExchanges([]);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExchanges([]);
  };

  const generatePageNumbers = () => {
    const pageSpread = 2;
    let start = currentPage - pageSpread;
    let end = currentPage + pageSpread;

    if (start < 1) {
      start = 1;
      end = Math.min(totalPages, start + pageSpread * 2);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - pageSpread * 2);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  const visiblePageNumbers = generatePageNumbers();

  const startIndex = (currentPage - 1) * entriesPerPage + 1;
  const endIndex =
    startIndex + filteredExchanges.length - 1 > entriesPerPage * totalPages
      ? entriesPerPage * totalPages
      : startIndex + filteredExchanges.length - 1;

  return (
    <>
      <div className="bg-white p-8 rounded-md w-full">
        <div className="text-center pb-6">
          <h1 className="text-black text-3xl font-extrabold m-2">
            Top Crypto Exchanges
          </h1>
          <span className="text-base text-gray-600 font-medium">
            {` compare all crypto Exchanges. The list is ranked by trading
            volume`}
          </span>
        </div>
        <div className="bg-gray-50 p-4 rounded-md w-[254px] ml-[465px]">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              className="bg-gray-50 outline-none ml-1"
              type="text"
              name=""
              id=""
              placeholder="Find the Exchanges..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-base font-mono font-semibold text-gray-900 uppercase tracking-wider">
                      Exchanges
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-base font-mono font-semibold text-gray-900 uppercase tracking-wider">
                      24h TRADE VOLUME
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExchanges.length === 0 ? (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-5 py-5 text-gray-600 text-base font-mono font-bold bg-white text-center"
                      >
                        No results found
                      </td>
                    </tr>
                  ) : (
                    filteredExchanges.map((exchange, index) => (
                      <tr key={`${exchange.name}-${index}`}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <p className="text-gray-900 font-semibold font-mono whitespace-no-wrap">
                                {startIndex + index}
                              </p>
                            </div>
                            <div className="ml-3">
                              <img
                                className="w-10 h-10 rounded-full"
                                src={exchange.icon_url}
                                alt={exchange.name}
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-gray-900 font-semibold font-mono whitespace-no-wrap">
                                {exchange.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-end">
                          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span
                              aria-hidden
                              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                            ></span>
                            <span className="relative font-mono font-extrabold">
                              {formatTradeVolume(exchange.amount)}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                <div className="px-5 py-5 bg-white flex flex-col xs:flex-row items-center xs:justify-between">
                  <span className="text-sm font-mono font-bold fo xs:text-sm text-gray-900">
                    {`showing ${startIndex} to ${endIndex} entries of ${
                      entriesPerPage * totalPages
                    }`}
                  </span>
                  <div className="inline-flex mt-2">
                    <button
                      className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                      onClick={handlePrev}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    {visiblePageNumbers.map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                        className={`text-white bg-gray-300 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 ${
                          currentPage === pageNumber
                            ? "bg-gray-800 text-white"
                            : "text-gray-600 hover:bg-gray-300"
                        } font-semibold py-2 px-4 rounded`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
