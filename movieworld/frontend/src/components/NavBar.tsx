import React from 'react'
import { useGetMovieGenresQuery, useGetSeriesByGenreQuery, useGetTvGenresQuery } from '../store/api/tmdbApi';
import SearchBar, { SearchParams } from './SearchBar';
import { Navigate, useNavigate } from 'react-router-dom';


type Props = { 
    overlay?: boolean;
  onGenreSelect?: (g: { name: string; movieId?: number; tvId?: number } | null) => void;
  onSearch?: (params: SearchParams) => void;
  onReset: () => void;                                 // 👈 one reset
  searchValue: string;
  onSearchValueChange: (newValue: string) => void; 

};

const NavBar: React.FC<Props> = ({ overlay, onGenreSelect, onSearch, searchValue, onSearchValueChange, onReset }) => {

  const navigate = useNavigate();

  const handleCollectionClick = () => {
    // Navigate to the collection page
    navigate('/MyCollectionPage');
  }



    const { data: movieGenres } = useGetMovieGenresQuery();
    const { data: tvGenres } = useGetTvGenresQuery();

    const names = React.useMemo(() => {
    const set = new Set<string>();
    movieGenres?.forEach(g => set.add(g.name));
    tvGenres?.forEach(g => set.add(g.name));
    return Array.from(set).sort();
  }, [movieGenres, tvGenres]);

const handleGenrePick = (name: string) => {
  const movieId = movieGenres?.find(g => g.name === name)?.id;
  const tvId    = tvGenres?.find(g => g.name === name)?.id;
  onReset();                      // clears search/input/selectedGenre and sets view='home'
  onGenreSelect?.({ name, movieId, tvId }); // parent sets view='genre' and selectedGenre
};


  //   const safeValue = searchValue ?? '';
  // const safeOnChange = onSearchValueChange ?? (() => {});
  // const safeOnSearch = onSearch ?? (() => {});

  return (
    <div className={`nav-bar${overlay ? ' overlay' : ''}`}>

            <div className='logo-container'>
                <img src='logo.png' alt='Logo' className='logo'/>
            </div>

            <div className='nav-links-container'>
                <li onClick={onReset}>Home</li>
                <li className='nav-item'>
                    Genre
                    <div className='genre-popup'>
                        <ul>
                          {names.map(name => (
                            <li key={name} onClick={() => handleGenrePick(name)}>
                              {name}
                            </li>
              ))}
                        </ul>
                    </div>
                </li>
                <li onClick={handleCollectionClick}>My Collection</li>
                {/* <li onClick={onReset}>Top IMDb/ Rotten Tomatoes</li> */}
            </div>

            <div className='search-bar'>
                <SearchBar
                    value={searchValue ?? ''}
                    onChange={onSearchValueChange ?? (() => {})}
                    onSearch={onSearch ?? (() => {})}
                />
            </div>

        </div>
  )
}

export default NavBar