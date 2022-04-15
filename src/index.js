import './css/style.css';
import Notiflix from 'notiflix';
import ref from './js/refComp';
import galleryCard from './templates/galleryCard.hbs'
import Gallery from './js/fetchAPI';
import LoadMoreBtn from './js/loadMoreBtn';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const cardGallery = new Gallery();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});



ref.searchForm.addEventListener("submit", searchGallery);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreCard);

function openLightBox() {
    new SimpleLightbox('.gallery a', {
        captionDelay: 250,
        captionsData: 'alt',
        close: true,
    });
}

async function searchGallery(e) { 
    e.preventDefault();

      

    cardGallery.query = e.target.elements.searchQuery.value;
    cardGallery.resetPage();
    cardGallery.resentAmount();

    try {
        const response = await cardGallery.fetchGallery();
        if (response.total === 0)
        {
            throw new Error("Sorry, there are no images matching your search query. Please try again.")    
        }
        Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
        loadMoreBtn.show();
        loadMoreBtn.disable();
        clearGallery();
        loadMoreBtn.enable();
        loadMoreBtnHide(response.total);
        addCards(response.hits);
    } catch (error) {
        clearGallery();
        Notiflix.Notify.failure(error.message);
    }    
    
}

async function onLoadMoreCard() {
    loadMoreBtn.disable();   
    const response = await cardGallery.fetchGallery();    
    addCards(response.hits); 
    loadMoreBtn.enable();
    loadMoreBtnHide(response.total);
    
}


function addCards(arr) {
    let cards = arr.map(galleryCard).join("");        
    appendGallery(cards);
    let lastCards = cardGallery.amountEl % 4;
    styleGalerry(lastCards);
    openLightBox();
}

function loadMoreBtnHide(number) {
    if (cardGallery.amountEl === number) {
        loadMoreBtn.hide();         
    }
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

let appendGallery=(data)=>ref.gallery.insertAdjacentHTML("beforeend", data)
