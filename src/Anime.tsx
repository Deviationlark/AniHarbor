import {useParams} from "react-router";
import {useEffect, useState} from "react";
import * as sea from "node:sea";
import NavBar from "./NavBar.tsx";

type node = {
    name: string;
}

interface title {
    english: string;
}

interface cover {
    medium: string;
    large: string;
    extraLarge: string;
}

interface studios {
    nodes: node[];
}
interface Anime {
    id: number;
    title:title,
    description: string;
    genres: string[];
    episodes: number;
    studios: studios;
    coverImage: cover;
}
interface Favorites {
    favoriteAnime: Anime[];
}



async function getAnime(id: number) {
    // Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
    const query = `
query ($id: Int) {
  Media(id:$id, type:ANIME) {
    id
    title {
      english
    }
    description
    genres
    episodes
    studios {
      nodes {
        name
      }
    }
    coverImage {
      extraLarge
    }
  }
}
`;
// Define our query variables and values that will be used in the query request
    const variables = {
        id:id,
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
    return await fetch(url, options).then(handleResponse).catch(handleError);
}

function Anime() {
    const {id} = useParams()
    const [anime, setAnime] = useState<Anime>();
    const [isLoaded,setLoaded] = useState(false)
    const getAnimeData = async () => {
        if (!anime) {
            const data = await getAnime(Number(id));
            await setAnimeData(data.data.Media)
        }
    }
    const setAnimeData = async (anime: Anime) => {
        setAnime(anime)
        setLoaded(true);
    }
    const addToFavorites= () => {
        const search = localStorage.getItem('favorites')
        if (search!==null && anime!==undefined) {
            const favorites:Favorites = JSON.parse(search);
            console.log(favorites);
            favorites.favoriteAnime.push(anime);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
        else if(search==null && anime!==undefined) {
            const favorites:Favorites = {
                favoriteAnime: [anime]
            };
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
        else {
            Error("error anime is undefined")
        }
    }
    useEffect(() => {
        getAnimeData()
    }, []);
    if (!isLoaded) {
        return <div>Loading...</div>
    }
    return (
        <div>
            <NavBar />
            <h1>{anime?.title.english}</h1>
            <img src={anime?.coverImage.extraLarge} alt={anime?.title.english}/>
            <div>
                <div>Episodes: {anime?.episodes}</div>
                <div>Genres: {anime?.genres.map((genre: string) => {
                    return (<div key={genre}>{genre}</div>)
                })}</div>
                <div>Studios: {anime?.studios.nodes.map((node: node) => {
                    return (<div key={node.name}>{node.name}</div>)
                })}</div>
                <div>Description: <div dangerouslySetInnerHTML={{ __html: anime!.description}}></div></div>
            </div>
            <button onClick={addToFavorites}>Add to favorites</button>
        </div>
    )
}

export default Anime