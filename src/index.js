import './css/style.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import ref from './js/refComp';
import galleryCard from './templates/galleryCard.hbs'
import Gallery from './js/fetchAPI';


ref.searchForm.addEventListener("submit", searchGallery);
ref.loadMore.addEventListener("click", onLoadMoreCard);
const cardGallery = new Gallery();

function searchGallery(e) {
    ref.loadMore.classList.add("is-hidden");
    e.preventDefault();
    cardGallery.query = e.target.elements.searchQuery.value;
    cardGallery.resetPage();
    cardGallery.resentAmount();
    cardGallery.fetchGallery().then(data => {        
        if (data.total === 0)
        {
            throw new Error("Sorry, there are no images matching your search query. Please try again.")    
        }

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        clearGallery();
        addCards(data.hits);
        ref.loadMore.classList.remove("is-hidden");        
       
    }).catch(error => Notiflix.Notify.failure(error.message)); 
    
}
function addCards(arr) {
    let cards = arr.map(galleryCard).join("");        
        appendGallery(cards);
        let lastCards = cardGallery.amountEl % 4;
        styleGalerry(lastCards);
}

function onLoadMoreCard() {
    ref.loadMore.disable = true;    
    cardGallery.fetchGallery().then(data => {
        if (cardGallery.amountEl === data.total) {
            ref.loadMore.classList.add("is-hidden");           
        }
        addCards(data.hits)
    });
    ref.loadMore.disable = false;
}

function styleGalerry(number) {
    let elem = '';
        if (number===0) {
            elem = document.querySelectorAll(`.photo-card:not(:nth-last-child(-n+4))`);            
        }
        else {
            elem = document.querySelectorAll(`.photo-card:not(:nth-last-child(-n+${number}))`);
        }       
        elem.forEach(e=>e.style.marginBottom = '20px')
}
let clearGallery =()=>ref.gallery.innerHTML = '';

let appendGallery=(data)=>ref.gallery.insertAdjacentHTML("beforeend", data);
