import {NavLink, useParams} from "react-router";

interface title {
    english: string;
    romaji: string;
}

interface cover {
    medium: string;
    large: string;
    extraLarge: string;
}

type AnimeItem =  {
    id:number,
    title:title,
    averageScore:number,
    episodes:number,
    status:string,
    coverImage:cover,
}

interface Anime {
    animeData: AnimeItem[];
}

import {useEffect, useState} from "react";
import NavBar from "./NavBar.tsx";

function getData( page:number) {
    // Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
    const query = `
query ($page:Int,$seasonYear:Int, $season:MediaSeason,$perPage:Int,$sort:[MediaSort]) {
  # Define which variables will be used in the query (id)
  Page (page: $page,perPage: $perPage){
        pageInfo {
      hasNextPage
    }
    media (type: ANIME,seasonYear: $seasonYear,season: $season,sort:$sort) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query) {
    id
    status
    averageScore
    episodes
    title {
      english
      romaji
    }
    coverImage {
      extraLarge
    }
    }
  }
}
`;

// Define our query variables and values that will be used in the query request
    const variables = {
        "page":page,
        "perPage":12,
        "sort":"SCORE_DESC",
        "seasonYear": 2026,
        "season":"WINTER",
    }

// Define the config we'll need for our Api request
    const url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

// Make the HTTP Api request
    async function handleResponse(response: Response) {
        const json = await response.json();
        return response.ok ? json : Promise.reject(json);
    }

    function handleError(error:string) {
        alert('Error, check console');
        console.error(error);
    }
    return fetch(url, options).then(handleResponse).catch(handleError);
}

function App() {
    const {pageId} = useParams();
    const [data,setData] = useState<Anime>()
    const [page,setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const getAnimeData = async (page:number) => {
        if (localStorage.getItem('page' + page)===null) {
            const animeData = await getData(page);
            console.log(animeData);
            await setAnimeData({animeData:animeData.data.Page.media},page);
            localStorage.setItem('page' + page, JSON.stringify({animeData:animeData.data.Page.media}));
        }
        else {
            const animeData = JSON.parse(localStorage.getItem('page' + page) as string);
            await setAnimeData(animeData,page);
        }

    }
    const setAnimeData = async (data:Anime,page:number) => {
        setData(data);
        setLoading(false);
        if (pageId !== undefined) {
            setPage(Number(page));
        }
    }
    useEffect(() => {
        console.log("AA")
        getAnimeData(page)
    }, [])
    useEffect(() => {
        getAnimeData(page)
    }, [page]);
    if (loading) {
        return (<div>Loading...</div>)
    }
  return (
    <>
        <NavBar />
        <div>
            {data?.animeData.map((item: AnimeItem) => {
                return (
                        <div key={item.id}>
                            <h1>{item.title.english !== null ? item.title.english : item.title.romaji}</h1>
                            <NavLink to={`/anime/${item.id}`}>
                            <img src={item.coverImage.extraLarge} alt={item.title.english} width="20%"/>
                            </NavLink>
                            <div><span>Episodes: {item.episodes}</span> <span>Average Rating: {item.averageScore}</span> <span>Status: {item.status}</span></div>
                        </div>

                )
            })}
    </div>
        <NavLink to={`/?page=${page>=2?page-1:page}`}>
            <button onClick={() => {
                if (page>=2) {
                    setPage(page => page-1)
                }
            }}>Previous Page</button>
        </NavLink>
        <NavLink to={`/?page=${page+1}`}>
            <button onClick={() => {
                setPage(page => page+1)
            }}>Next Page</button>
        </NavLink>
    </>
  )
}

export default App
