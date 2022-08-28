import './css/styles.css';
import { fetchCountries } from './js/fetch-countries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  inputSearch: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  DEBOUNCE_DELAY: 300,
};

refs.inputSearch.addEventListener(
  'input',
  debounce(handleInputCountry, refs.DEBOUNCE_DELAY)
);

function handleInputCountry(e) {
  const trimValue = refs.inputSearch.value;
  resetDescr();

  if (trimValue !== '') {
    fetchCountries(trimValue).then(foundData => {
      if (foundData.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (foundData.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else if (foundData.length >= 2 && foundData.length <= 10) {
        descriptionCountries(foundData);
      } else if (foundData.length === 1) {
        descriptionCountry(foundData);
      }
    });
  }
}

function descriptionCountries(countries) {
  const marckup = countries
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="30" hight="20">
      <p>${country.name.common}</p></li>`;
    })
    .join('');
  refs.countryList.innerHTML = marckup;
}

function descriptionCountry(countries) {
  const marckup = countries
    .map(country => {
      return `<li>
  <div>
  <img src="${country.flags.svg}" alt="Flag of ${
        country.name.common
      }" width="30" hight="20">
  <h2><b>${country.name.common}</b></h2></div>
  <p><b>Capital:</b>${country.capital}</p>
  <p><b>Population:</b>${country.population}</p>
  <p><b>Languages:</b>${Object.values(country.languages)}</p>
</li>`;
    })
    .join('');
  refs.countryInfo.innerHTML = marckup;
}

function resetDescr() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
