'use client';

import React from "react";
import { InstantSearch, Snippet, InfiniteHits, connectStateResults, connectInfiniteHits } from "react-instantsearch-dom";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import Link from "next/link";
import { connectSearchBox } from "react-instantsearch-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import { isBrowser } from 'react-device-detect';


const truncate = (str: string) => {
  return str.length > 51 ? str.substring(0, 48) + "..." : str;
}

const Hit = ({ hit }: any) => {
  return (
    <div key={hit.id} className="mb-2">
      <div>
        <Link className="text-base text-blue-500 font-semibold" href={hit.url} target="_blank">
          {truncate(hit.title)}
        </Link>
      </div>
      <div className="mt-1 mb-2 text-xs text-gray-500">
        <Link href={hit.url} target="_blank">
          {hit.url}
        </Link> |
        <Tippy placement={isBrowser ? "right"  : "bottom"} content={<span>{hit.summary}</span>}>
          <button>&nbsp;summary</button>
        </Tippy>
      </div>
      <Snippet hit={hit}
        attribute="content" />
      <br />
      <br />
    </div>
  )
};


const CustomSearchBox = connectSearchBox(
  ({ refine }: any) => {
    return (
      <form className="max-w-2xl mx-auto mb-4">
        <label for="default-search" className="mb-2 text-gray-900 sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input autoFocus={true} onChange={(e) => refine(e.currentTarget.value)} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 focus:outline-none focus:border-blue-500 border border-gray-700 rounded-lg" placeholder="Search through the body of substack articles here..." required />
        </div>
        <p className="my-1 text-center text-xs italic text-gray-500 ">
          1234 articles indexed
        </p>
      </form>
    )
  }
)

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "RCr5NodaWh5jr4KbpTg88J4PaAAhwGpP", // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: "p2vgteflysaon14wp-1.a1.typesense.net",
        port: 443,
        path: "",
        protocol: "https",
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },
  additionalSearchParameters: {
    query_by: "content, title",
    sort_by: "_text_match:desc",
  },
});

const searchClient = typesenseInstantsearchAdapter.searchClient;

const CustomResults = connectStateResults(
  ({ searchState, searchResults, children }) => {
    if (Object.keys(searchState).length === 0 || searchState.query === '') {
      return null
    }

    let content = (<div>No results have been found for {searchState.query}.</div>)

    if (searchResults && searchResults.nbHits !== 0) {
      content = children
    }

    return (
      <div className=''>
        {content}
      </div>
    )
  }
)

const CustomInfiniteHits = connectInfiniteHits(
  ({ hasMore, refineNext, hits }: any) => {
    return (
      <div>
        <InfiniteHits hitComponent={Hit} />
        {hasMore && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={refineNext}
          >
            Load more
          </button>
        )}
      </div>
    );
  }
);

const App = () => {
  return (
    <>
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="Untitled.png" className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">Substack Spider</span>
          </a>
          <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">Github</a>
              </li>
              <li>
                <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0">About</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <InstantSearch indexName="posts" searchClient={searchClient}>
        <div className="p-4 md:px-16">
          <CustomSearchBox />
          <CustomResults>
            <div className="pt-2">
              <CustomInfiniteHits />
            </div>
          </CustomResults>
        </div>
      </InstantSearch>
    </>
  )
};

export default App;