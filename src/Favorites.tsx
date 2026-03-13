import {useEffect, useState} from "react";
import {NavLink} from "react-router";
import NavBar from "./NavBar.tsx";

type node = {
    name: string;
}

interface title {
    english: string;
    romaji: string;
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

function Favorites() {
    const [favoriteAnimes,setFavoriteAnimes] = useState<Favorites>()
    const getFavorites = () => {
        const search = localStorage.getItem("favorites");
        if (search) {
            setData(JSON.parse(search));
        }
        else {
            const favorites:Favorites = {
                favoriteAnime:[]
            }
            setData(favorites);
        }
    }
    const setData = (data:Favorites) => {
        if (data) {
            setFavoriteAnimes(data);
        }
    }
    useEffect(() => {
        getFavorites();
    }, [])
    return (
        <>
            <NavBar />
            {favoriteAnimes && favoriteAnimes.favoriteAnime.map((item) => {
                 return (
                    <div key={item.id}>
                        <h1>{item.title.english !== null ? item.title.english : item.title.romaji}</h1>
                        <NavLink to={`/anime/${item.id}`}>
                            <img src={item.coverImage.extraLarge} alt={item.title.english} width="40%"/>
                        </NavLink>
                    </div>

                )
            })}
        </>
    )
}

export default Favorites;