"use client";
import { Badge } from "@ux-sting/react/badge";
import { ReviewStars } from "@ux-sting/react/rating";
import { SearchResult, SearchResults } from "@ux-sting/react/search-result";
import { NativeSelect } from "@ux-sting/react/native-select";

export function Results() {
  return (
    <SearchResults
      summary="3 results for “coffee”"
      toolbar={
        <NativeSelect size="sm" aria-label="Sort results" className="w-40">
          <option>Most relevant</option>
          <option>Highest rated</option>
        </NativeSelect>
      }
    >
      <SearchResult
        query="coffee"
        href="#"
        title="Café Atlas — specialty coffee"
        path="Casablanca › Cafés"
        description="Single-origin coffee roasted weekly, pastries baked in house."
        meta={
          <>
            <ReviewStars value={4.6} size="sm" showValue />
            <Badge variant="success" size="sm">
              Open
            </Badge>
          </>
        }
      />
      <SearchResult
        query="coffee"
        href="#"
        title="Blue Door Coffee Bar"
        path="Tangier › Cafés"
        description="Pour-over and cold brew with a view of the port."
      />
      <SearchResult
        query="coffee"
        href="#"
        title="Guide: where to find great coffee in Rabat"
        path="Guides"
        description="Our editors picked eight coffee shops worth the detour."
      />
    </SearchResults>
  );
}
