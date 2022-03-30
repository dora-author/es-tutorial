//import logo from './logo.svg';
//import './App.css';
import React from "react";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { 
  PagingInfo,
  ResultsPerPage,
  Paging,
  Facet,
  SearchProvider,
  Results,
  SearchBox,
  Sorting
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views"; 
import "@elastic/react-search-ui-views/lib/styles/styles.css"

const connector = new AppSearchAPIConnector({
  searchKey: "search-feodmjyfmqinygyb4u1y254k", //"search-16xev8pbpxre4eugon7apec2"
  engineName: "video-games",
  hostIdentifier: "host-2376rb" //"nuri-searchengine-test.kb.us-central1.gcp.cloud.es.io:9243"
});

const configurationOptions = {
  apiConnector: connector,
  // 함께 채워보겠습니다.
  //자동완성 기능
  autocompleteQuery: {
    suggestions: {
      types: {
        documents: {
          // 제안을 검색할 필드
          fields: ["name"]
        }
      },
      // 표시할 제안 수
      size: 5
    }
  },
  //
  searchQuery: {
    search_fields: {
      // 1. 비디오 게임 이름으로 검색합니다.
      name: {}
    },
    // 2. 결과: 이름, 장르, 게시자, 점수 및 플랫폼.
    result_fields: {
      name: {
        // snippet은 일치하는 검색 용어가 <em> 태그로 래핑됨을 의미합니다.
        snippet: {
          size: 75, // snippet을 75자로 제한합니다.
          //대체: 참 // ‘원시’ 결과로 대체합니다.
          fallback: true
        }
      },
      genre: {
        snippet: {
          size: 50,
          fallback: true
        }
      },
      publisher: {
        snippet: {
          size: 50,
          fallback: true
        }
      },
      critic_score: {
        //점수는 숫자이므로 snippet을 사용하지 않습니다.
        raw: {}
      },
      user_score: {
        raw: {}
      },
      platform: {
        snippet: {
          size: 50,
          fallback: true
        }
      },
      image_url: {
        raw: {}
      }
    },
    // 3. 점수, 장르, 게시자 및 플랫폼으로 패시팅(https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/)하여 나중에 필터를 구축할 때 사용합니다.
    facets: {
      user_score: {
        type: "range",
        ranges: [
          { from: 0, to: 5, name: "Not good" },
          { from: 5, to: 7, name: "Not bad" },
          { from: 7, to: 9, name: "Pretty good" },
          { from: 9, to: 10, name: "Must play!" }
        ]
      },
      critic_score: {
        type: "range",
        ranges: [
          { from: 0, to: 50, name: "Not good" },
          { from: 50, to: 70, name: "Not bad" },
          { from: 70, to: 90, name: "Pretty good" },
          { from: 90, to: 100, name: "Must play!" }
        ]
      },
      genre: { type: "value", size: 100 },
      publisher: { type: "value", size: 100 },
      platform: { type: "value", size: 100 }
    }
  }

};


export default function App() {
  return (
   /* <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>*/
    <SearchProvider config={configurationOptions}>
      <div className="App">
        <Layout
        // 함께 채워보겠습니다.
        header={<SearchBox autocompleteSuggestions={true} />} //SearchBox 자동완성 활성화
        // titleField는 결과: 결과 헤더에서 가장 눈의 띄는 필드입니다.
        bodyContent={<Results titleField="name" urlField="image_url" />}
        sideContent={
          <div>
            <Sorting
              label={"Sort by"}
              sortOptions={[
                {
                  name: "Relevance",
                  value: "",
                  direction: ""
                },
                {
                  name: "Name",
                  value: "name",
                  direction: "asc"
                }
              ]}
            />
            <Facet field="user_score" label="User Score" />
            <Facet field="critic_score" label="Critic Score" />
            <Facet field="genre" label="Genre" />
            <Facet field="publisher" label="Publisher" isFilterable={true} />
            <Facet field="platform" label="Platform" />
          </div>
        }
        bodyHeader={
          <>
            <PagingInfo />
            <ResultsPerPage />
          </>
        }
        bodyFooter={<Paging />}
        />
      </div>
    </SearchProvider>

  );
}

