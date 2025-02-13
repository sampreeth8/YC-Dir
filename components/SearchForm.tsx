import React from 'react'
import {Search} from "lucide-react";
import SearchFormReset from './SearchFormReset';

const SearchForm = ({query}:{query?: string}) => {
  return (
<form className='search-form' action="/" defaultValue={query}>
  <input name="query" defaultValue={query} placeholder='Enter your Search' className='search-input'>
  </input>
  <div className="flex gap-2">
                {query && <SearchFormReset />}</div>
  <button type="submit" className="search-btn text-white">
                    <Search className="size-5" />
                </button>

</form>
  )
}

export default SearchForm
