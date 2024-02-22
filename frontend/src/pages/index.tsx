'use client';

import React from "react";
import { InstantSearch, Snippet, InfiniteHits, connectStateResults, connectInfiniteHits } from "react-instantsearch-dom";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import Link from "next/link";
import { connectSearchBox } from "react-instantsearch-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import { isBrowser } from 'react-device-detect';
import RootLayout from "../components/Layout/";


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
                </Link>
                {hit.summary && 
                    <>
                        <span>&nbsp;|&nbsp;</span>
                        <Tippy placement={isBrowser ? "right" : "bottom"} content={<span>{hit.summary}</span>}>
                            <button>summary</button>
                        </Tippy>
                    </>
                }
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
                <label className="mb-2 text-gray-900 sr-only">Search</label>
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
    ({ searchState, searchResults, children }: any) => {
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
        <InstantSearch indexName="posts" searchClient={searchClient}>
            <CustomSearchBox />
            <CustomResults>
                <div className="pt-2">
                    <CustomInfiniteHits />
                </div>
            </CustomResults>
        </InstantSearch>
    )
};

export default App;