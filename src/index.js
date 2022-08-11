import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const limit = 10;

refs.input.addEventListener('input', debounce(onChangeInput, DEBOUNCE_DELAY));

function onChangeInput() {
  let inputValue = refs.input.value.trim();

  if (!inputValue) {
    clearMarkup();
    return;
  }

  fetchCountries(inputValue)
    .then(showCountries)
    .catch(error => {
      clearMarkup();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function showCountries(arr) {
  clearMarkup();

  if (arr.length > limit) {
    return Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (arr.length === 1) {
    refs.countryInfo.insertAdjacentHTML(
      'beforeend',
      createMarkupCountryInfo(arr[0])
    );
  } else {
    refs.countryList.insertAdjacentHTML(
      'beforeend',
      createMarkupCountryList(arr)
    );
  }
}

function createMarkupCountryInfo({
  flags: { svg },
  name: { official: officialName },
  capital,
  population,
  languages,
}) {
  return `<ul class="country__list-info">
  <li class="country__name">
  <img src="${svg}" alt="flag" width="20" height="20">
    <h2>${officialName}</h2></li>
  <li class="country__info"><b>Capital:</b> ${capital}</li>
  <li class="country__info"><b>Population:</b> ${population}</li>
  <li class="country__info"><b>Languages:</b> ${Object.values(languages)}</li>
</ul>`;
}

function createMarkupCountryList(countries) {
  return countries.reduce(
    (acc, { flags: { svg }, name: { official: officialName } }) =>
      acc +
      `<li class="country__item">
      <img src="${svg}" alt="flag" width="20" height="20"> <p><b>${officialName}</b></p>
     </li>`,
    ''
  );
}
