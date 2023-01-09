/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useReducer, useContext } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const SearchContext = createContext();

const searchReducer = (searchState, action) => {
  switch (action.type) {
    case "toggle-search-input": {
      return { ...searchState, showSearch: !searchState.showSearch };
    }
    case "set-history": {
      const { value } = action;
      return { ...searchState, showHistory: value };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useReducer(searchReducer, {
    toSearch: "",
  });

  const value = { searchState, setSearchState };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// hooks
const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined)
    throw new Error("searchContext must be used within a Provider");
  return context;
};

export { SearchProvider, useSearch };
