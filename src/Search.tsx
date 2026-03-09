import {useEffect, useState} from "react";
import {NavLink} from "react-router";
import * as sea from "node:sea";
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

function getAnimeData(search:string) {
    const query = `query ($search: String!) {
  Page {
    media(search: $search, type: ANIME) {
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
}`
    const variables = {
        "search": search,
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

function Search() {
    const [search, setSearch] = useState('');
    const [animeData,setAnimeData] = useState<Anime>();
    const [loading, setLoading] = useState(false);

    const findAnime = async () => {
        if (search!==''){
            const data = await getAnimeData(search);
            setData({animeData:data.data.Page.media},search);
            console.log(data);
            sessionStorage.setItem("searchData", JSON.stringify({animeData:data.data.Page.media}));
            sessionStorage.setItem("search", JSON.stringify(search));
        }
    }
    const setData = (data?:Anime,search?:string) => {
        setLoading(true);
        console.log(data,search)
        if (search!==undefined){
            setSearch(search);
        }
        if (data!==undefined){
            setAnimeData(data);
        }
        setLoading(false);
    }
    useEffect(() => {
        if (sessionStorage.getItem("searchData")!==null) {
            setData(JSON.parse(sessionStorage.getItem("searchData") as string),search);
        }
        findAnime();
    }, []);
    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            Anime:
            <input type="text" placeholder="Search by anime name" value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target != null) {
                    setSearch(e.target.value)
                }
            }} />
            <button onClick={findAnime}>Search</button>
            <div id="anime">
                {animeData?.animeData !== undefined && animeData?.animeData.map(item => {
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
        </div>
    )
}

export default Search;